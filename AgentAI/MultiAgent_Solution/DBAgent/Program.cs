using System.Data;
using Microsoft.Data.SqlClient;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Logging to console and keep minimal.
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

var app = builder.Build();

// Log file
string logPath = Environment.GetEnvironmentVariable("DBAGENT_LOG") ?? @"D:\Apps\DBAgent\dbagent-actions.log";
try { Directory.CreateDirectory(Path.GetDirectoryName(logPath)!); } catch { }
void AppendLog(string s)
{
    try { File.AppendAllText(logPath, $"{DateTime.UtcNow:o} - {s}{Environment.NewLine}"); } catch { }
}

// Read connection string from environment variable; optional per-request override
string defaultConn = Environment.GetEnvironmentVariable("DBAGENT_CONN") ?? string.Empty;

app.MapGet("/", () => Results.Text("DBAgent up"));

app.MapPost("/dbanalyze", async (HttpContext ctx, ILogger<Program> logger, CancellationToken ct) =>
{
    using var doc = await JsonDocument.ParseAsync(ctx.Request.Body, cancellationToken: ct);
    var body = doc.RootElement.GetRawText();
    AppendLog($"DBAnalyze request: {body}");

    // Try to parse optional fields: server, database, connOverride
    string? connOverride = null;
    try
    {
        if (doc.RootElement.TryGetProperty("dbagent_conn", out var c)) connOverride = c.GetString();
    }
    catch { }

    string connStr = !string.IsNullOrWhiteSpace(connOverride) ? connOverride : defaultConn;

    if (string.IsNullOrWhiteSpace(connStr))
    {
        var nf = new DiagnosticResponse
        {
            RootCause = "No connection configured",
            RecommendedFix = new[] { "Set DBAGENT_CONN environment variable to a readonly SQL Server connection string" },
            Details = new Dictionary<string, object> { ["receivedTelemetry"] = body }
        };
        var nfJson = JsonSerializer.Serialize(nf);
        AppendLog($"DBAgent response (no-conn): {nfJson}");
        return Results.Text(nfJson, "application/json");
    }

    // Run diagnostics in read-only mode
    try
    {
        using var conn = new SqlConnection(connStr);
        await conn.OpenAsync(ct);

        var response = new DiagnosticResponse();
        response.DetectedProblems = new List<string>();
        response.RecommendedFix = new List<string>();
        response.Details = new Dictionary<string, object>();

        // 1) Long running requests: sys.dm_exec_requests
        try
        {
            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                SELECT TOP(10)
                  r.session_id,
                  DB_NAME(r.database_id) AS database_name,
                  r.status,
                  r.command,
                  r.wait_type,
                  r.wait_time,
                  r.total_elapsed_time/1000.0 AS seconds_elapsed,
                  SUBSTRING(t.text, (r.statement_start_offset/2)+1, 
                    (CASE WHEN r.statement_end_offset = -1 THEN LEN(CONVERT(nvarchar(max), t.text)) * 2 
                          ELSE (r.statement_end_offset - r.statement_start_offset) END)/2) AS current_statement
                FROM sys.dm_exec_requests r
                CROSS APPLY sys.dm_exec_sql_text(r.sql_handle) t
                WHERE r.session_id <> @@SPID
                ORDER BY r.total_elapsed_time DESC;";
            cmd.CommandType = CommandType.Text;
            using var rdr = await cmd.ExecuteReaderAsync(ct);
            var longRunning = new List<object>();
            while (await rdr.ReadAsync(ct))
            {
                longRunning.Add(new
                {
                    session_id = rdr["session_id"],
                    database = rdr["database_name"],
                    status = rdr["status"],
                    command = rdr["command"],
                    wait_type = rdr["wait_type"],
                    seconds_elapsed = rdr["seconds_elapsed"],
                    statement = rdr["current_statement"]
                });
            }
            response.Details!["long_running_requests"] = longRunning;
            if (longRunning.Count > 0) response.DetectedProblems!.Add("long_running_queries");
        }
        catch (Exception ex)
        {
            AppendLog($"Long-running diagnostics failed: {ex}");
            response.Details!["long_running_error"] = ex.Message;
        }

        // 2) Top resource-consuming queries: sys.dm_exec_query_stats
        try
        {
            using var cmd2 = conn.CreateCommand();
            cmd2.CommandText = @"
                SELECT TOP(10)
                  qs.execution_count,
                  qs.total_worker_time/1000 AS total_cpu_ms,
                  qs.total_elapsed_time/1000 AS total_elapsed_ms,
                  qs.max_elapsed_time/1000 AS max_elapsed_ms,
                  SUBSTRING(st.text, (qs.statement_start_offset/2)+1,
                    (CASE WHEN qs.statement_end_offset = -1 THEN LEN(CONVERT(nvarchar(max), st.text)) * 2 ELSE (qs.statement_end_offset-qs.statement_start_offset) END)/2) AS statement_text,
                  qp.query_plan
                FROM sys.dm_exec_query_stats qs
                CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) st
                CROSS APPLY sys.dm_exec_query_plan(qs.plan_handle) qp
                ORDER BY qs.total_elapsed_time DESC;";
            using var rdr2 = await cmd2.ExecuteReaderAsync(ct);
            var heavy = new List<object>();
            while (await rdr2.ReadAsync(ct))
            {
                heavy.Add(new
                {
                    execution_count = rdr2["execution_count"],
                    total_cpu_ms = rdr2["total_cpu_ms"],
                    total_elapsed_ms = rdr2["total_elapsed_ms"],
                    max_elapsed_ms = rdr2["max_elapsed_ms"],
                    statement = rdr2["statement_text"],
                });
            }
            response.Details!["heavy_queries"] = heavy;
            if (heavy.Count > 0) response.DetectedProblems!.Add("heavy_queries");
        }
        catch (Exception ex)
        {
            AppendLog($"Query-stats diagnostics failed: {ex}");
            response.Details!["query_stats_error"] = ex.Message;
        }

        // 3) Missing index suggestions: sys.dm_db_missing_index_details + stats
        try
        {
            using var cmd3 = conn.CreateCommand();
            cmd3.CommandText = @"
                SELECT TOP(10
                )
                  DB_NAME(mid.database_id) AS database_name,
                  OBJECT_SCHEMA_NAME(mid.object_id, mid.database_id) AS object_schema,
                  OBJECT_NAME(mid.object_id, mid.database_id) AS object_name,
                  mid.equality_columns,
                  mid.inequality_columns,
                  mid.included_columns,
                  migs.avg_user_impact,
                  mid.statement
                FROM sys.dm_db_missing_index_groups mig
                JOIN sys.dm_db_missing_index_group_stats migs ON migs.group_handle = mig.index_group_handle
                JOIN sys.dm_db_missing_index_details mid ON mig.index_handle = mid.index_handle
                ORDER BY migs.avg_user_impact DESC;";

            using var rdr3 = await cmd3.ExecuteReaderAsync(ct);
            var missing = new List<object>();
            while (await rdr3.ReadAsync(ct))
            {
                var tbl = rdr3["object_name"]?.ToString();
                var eq = rdr3["equality_columns"]?.ToString();
                var ineq = rdr3["inequality_columns"]?.ToString();
                var inc = rdr3["included_columns"]?.ToString();
                // Build a friendly suggestion (do not auto-apply)
                var suggestion = $"Missing index on {tbl} (equality={eq}, inequality={ineq})";
                var create = "";
                if (!string.IsNullOrWhiteSpace(eq))
                {
                    create = $"CREATE NONCLUSTERED INDEX IX_{tbl}_REC ON {tbl} ({eq}{(string.IsNullOrWhiteSpace(ineq) ? "" : " ," + ineq)})" +
                             (string.IsNullOrWhiteSpace(inc) ? "" : $" INCLUDE ({inc})");
                }

                missing.Add(new { suggestion, create, impact = rdr3["avg_user_impact"] });
            }
            response.Details!["missing_index_suggestions"] = missing;
            if (missing.Count > 0) response.DetectedProblems!.Add("missing_index_suggestions");
        }
        catch (Exception ex)
        {
            AppendLog($"Missing-index diagnostics failed: {ex}");
            response.Details!["missing_index_error"] = ex.Message;
        }

        // 4) Wait stats (high-level)
        try
        {
            using var cmd4 = conn.CreateCommand();
            cmd4.CommandText = @"
                SELECT TOP(20) wait_type, wait_time_ms, waiting_tasks_count
                FROM sys.dm_os_wait_stats
                WHERE waiting_tasks_count > 0
                ORDER BY wait_time_ms DESC;";
            using var rdr4 = await cmd4.ExecuteReaderAsync(ct);
            var waits = new List<object>();
            while (await rdr4.ReadAsync(ct))
            {
                waits.Add(new { wait_type = rdr4["wait_type"], wait_time_ms = rdr4["wait_time_ms"], waiting_tasks = rdr4["waiting_tasks_count"] });
            }
            response.Details!["wait_stats"] = waits;
            if (waits.Count > 0) response.DetectedProblems!.Add("wait_stats_high");
        }
        catch (Exception ex)
        {
            AppendLog($"Wait-stat diagnostics failed: {ex}");
            response.Details!["wait_stats_error"] = ex.Message;
        }

        // 5) Heuristic root-cause & recommendations assembly
        var rootCauses = new List<string>();
        var recs = new List<string>();

        if (response.DetectedProblems!.Contains("missing_index_suggestions"))
        {
            rootCauses.Add("Missing indexes / suboptimal query plans");
            recs.Add("Review missing index suggestions and evaluate CREATE INDEX statements during maintenance windows");
        }
        if (response.DetectedProblems.Contains("long_running_queries") || response.DetectedProblems.Contains("heavy_queries"))
        {
            rootCauses.Add("Long running or expensive queries detected");
            recs.Add("Investigate heavy queries and consider query tuning, adding appropriate indexes, or query parameterization");
            recs.Add("Consider increasing command timeout as a temporary mitigation if safe");
        }
        if (response.DetectedProblems.Contains("wait_stats_high"))
        {
            rootCauses.Add("High wait times detected — investigate IO/CPU/lock waits");
            recs.Add("Investigate dominant wait types from wait_stats and correlate with query times");
        }

        if (rootCauses.Count == 0)
        {
            rootCauses.Add("No obvious issues found from quick DMVs scan");
            recs.Add("If problem persists, run extended diagnostics or capture an xEvent/deadlock graph");
        }

        response.RootCause = string.Join("; ", rootCauses);
        response.RecommendedFix = recs;

        var outJson = JsonSerializer.Serialize(response, new JsonSerializerOptions { WriteIndented = false });
        AppendLog($"DBAgent response: {outJson}");
        return Results.Text(outJson, "application/json");
    }
    catch (Exception ex)
    {
        AppendLog($"DBAgent fatal: {ex}");
        var err = new DiagnosticResponse { RootCause = "Diagnostics failed", RecommendedFix = new[] { ex.Message }, Details = new Dictionary<string, object> { ["exception"] = ex.ToString() } };
        var errjson = JsonSerializer.Serialize(err);
        return Results.Text(errjson, "application/json");
    }
});

app.Run();

// Helper POCO
public class DiagnosticResponse
{
    [JsonPropertyName("RootCause")]
    public string? RootCause { get; set; }

    [JsonPropertyName("RecommendedFix")]
    public IEnumerable<string>? RecommendedFix { get; set; }

    [JsonPropertyName("DetectedProblems")]
    public List<string>? DetectedProblems { get; set; }

    [JsonPropertyName("Details")]
    public Dictionary<string, object>? Details { get; set; }
}

