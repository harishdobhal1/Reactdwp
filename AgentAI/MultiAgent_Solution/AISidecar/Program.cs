using System.Text.Json;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseWindowsService();

builder.Logging.AddConsole();

builder.Services.AddHttpClient("dbagent", c =>
{
    c.BaseAddress = new Uri("http://localhost:5000/");
    c.Timeout = TimeSpan.FromSeconds(10);
});

var app = builder.Build();

var config = app.Configuration;

// 🔹 Read from appsettings.json
string tempFolderPath = config["Cleanup:FolderPath"]
    ?? throw new Exception("Cleanup:FolderPath missing");

string tempFilePrefix = config["Cleanup:FilePrefix"]
    ?? throw new Exception("Cleanup:FilePrefix missing");

string logPath = @"D:\Apps\AISidecar\aisidecar-actions.log";
Directory.CreateDirectory(Path.GetDirectoryName(logPath)!);

void AppendLog(string s)
{
    try
    {
        File.AppendAllText(
            logPath,
            $"{DateTime.UtcNow:o} - {s}{Environment.NewLine}"
        );
    }
    catch { }
}

string dwpUrl = "https://cfecom.www.supplychain-dwp.ikeadt.com";

app.MapPost("/telemetry", async (HttpContext ctx, IHttpClientFactory clients, ILogger<Program> logger) =>
{
    using var doc = await JsonDocument.ParseAsync(ctx.Request.Body);
    var root = doc.RootElement;

    AppendLog($"Telemetry received: {root}");

    // ============================================================
    // 🔹 LOG CLEANUP CHECK — ONLY FOR LogCleanupAgent
    // ============================================================
    if (root.TryGetProperty("source", out var sourceProp) &&
        sourceProp.GetString() == "LogCleanupAgent")
    {
        bool cleanupRequired = false;

        try
        {
            if (Directory.Exists(tempFolderPath))
            {
                var files = Directory.GetFiles(tempFolderPath, $"{tempFilePrefix}*");
                DateTime sysDate = DateTime.Now;

                foreach (var file in files)
                {
                    DateTime lastWrite = File.GetLastWriteTime(file);

                    if (lastWrite < sysDate)
                    {
                        cleanupRequired = true;
                        break;
                    }
                }
            }
        }
        catch (Exception ex)
        {
            AppendLog($"AISidecar cleanup check failed: {ex.Message}");
        }

        if (cleanupRequired)
        {
            var cleanupPlan = JsonSerializer.Serialize(new[]
            {
                new { Action = "cleanup_logs", Target = "temp" }
            });

            AppendLog("AISidecar → cleanup required, instructing LogCleanupAgent");
            return Results.Text(cleanupPlan, "application/json");
        }

        var noopCleanup = JsonSerializer.Serialize(new[]
        {
            new { Action = "noop", Message = "No temp cleanup required" }
        });

        AppendLog("AISidecar → no temp files eligible for cleanup");
        return Results.Text(noopCleanup, "application/json");
    }

    // ============================================================
    // 🔹 Existing HealingAgent logic — UNCHANGED
    // ============================================================
    if (root.TryGetProperty("probe_status", out var ps) &&
        ps.GetInt32() != 200)
    {
        var plan = JsonSerializer.Serialize(new[]
        {
            new { Action = "recycle_app_pool", Target = "DWP" }
        });
        AppendLog("HealingAgent reports unhealthy → recycle plan.");
        return Results.Text(plan, "application/json");
    }

    if (root.TryGetProperty("unhealthy", out var unhealthyProp) &&
        unhealthyProp.GetBoolean() == true)
    {
        var plan = JsonSerializer.Serialize(new[]
        {
            new { Action = "recycle_app_pool", Target = "DWP" }
        });
        AppendLog("HealingAgent telemetry: unhealthy=true → recycle plan.");
        return Results.Text(plan, "application/json");
    }

    // AISidecar health check
    try
    {
        using var http = new HttpClient { Timeout = TimeSpan.FromSeconds(5) };
        var resp = await http.GetAsync(dwpUrl);

        if (!resp.IsSuccessStatusCode)
        {
            var recyclePlan = JsonSerializer.Serialize(new[]
            {
                new { Action = "recycle_app_pool", Target = "DWP" }
            });
            AppendLog($"AISidecar check failed ({resp.StatusCode}) → recycle plan.");
            return Results.Text(recyclePlan, "application/json");
        }
    }
    catch (Exception ex)
    {
        var recyclePlan = JsonSerializer.Serialize(new[]
        {
            new { Action = "recycle_app_pool", Target = "DWP" }
        });
        AppendLog($"AISidecar check EXCEPTION ({ex.Message}) → recycle plan.");
        return Results.Text(recyclePlan, "application/json");
    }

    var noop = JsonSerializer.Serialize(new[]
    {
        new { Action = "noop", Message = "Site healthy" }
    });

    AppendLog("Site healthy → noop");
    return Results.Text(noop, "application/json");
});

app.MapGet("/", () => "AI Sidecar up");

app.Run();
