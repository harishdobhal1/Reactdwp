using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace HealingAgent
{
    // Concrete hosted service that periodically probes a site and sends telemetry to the sidecar.
    // It calls the static PlanExecutor.HandlePlan(...) when a plan is received.
    public class PlanExecutorService : BackgroundService
    {
        private readonly ILogger<PlanExecutorService> _logger;
        private readonly IHttpClientFactory _httpFactory;
        private readonly string _logPath = @"D:\Apps\SelfHealingSupervisor\supervisor-actions.log"; // optional log file
        private readonly TimeSpan _poll = TimeSpan.FromSeconds(10);
        private readonly string _probeUrl = "https://cfecom.www.supplychain-dwp.ikeadt.com";
        private readonly string _appPoolName = "DWP";


        public PlanExecutorService(ILogger<PlanExecutorService> logger, IHttpClientFactory httpFactory)
        {
            _logger = logger;
            _httpFactory = httpFactory;

            // ensure folder exists
            try
            {
                var dir = System.IO.Path.GetDirectoryName(_logPath);
                if (!string.IsNullOrEmpty(dir))
                    System.IO.Directory.CreateDirectory(dir);
            }
            catch { /* best-effort */ }

            AppendLog($"PlanExecutor created. PID={Environment.ProcessId}, Arch={(Environment.Is64BitProcess ? "x64" : "x86")}, User={Environment.UserName}");
            AppendLog($"Supervisor started. Monitoring {_probeUrl} (pool='{_appPoolName}').");
        }

        private void AppendLog(string s)
        {
            try
            {
                var line = $"{DateTime.UtcNow:o} - {s}";
                System.IO.File.AppendAllText(_logPath, line + Environment.NewLine);
            }
            catch { /* ignore */ }

            try { _logger.LogInformation(s); } catch { }
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            AppendLog("PlanExecutorService: ExecuteAsync started.");

            var client = _httpFactory.CreateClient("sidecar");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    // Do a light probe of your host to detect unhealthy site
                    bool probeOk = false;
                    try
                    {
                        using var probeClient = new HttpClient() { Timeout = TimeSpan.FromSeconds(5) };
                        var resp = await probeClient.GetAsync(_probeUrl, stoppingToken).ConfigureAwait(false);
                        probeOk = resp.IsSuccessStatusCode;
                        AppendLog($"Probe returned {(int)resp.StatusCode} {(resp.IsSuccessStatusCode ? "OK" : "NOT OK")}");
                    }
                    catch (Exception pex)
                    {
                        AppendLog($"Probe exception: {pex.Message}");
                        probeOk = false;
                    }

                    // build telemetry for sidecar
                    var telemetry = new
                    {
                        type = probeOk ? "healthy" : "unhealthy",
                        source = "HealingAgent",
                        timestamp = DateTime.UtcNow,
                        site = _probeUrl,
                        pool = _appPoolName,
                        message = probeOk ? "probe ok" : "probe failed"
                    };

                    var json = JsonSerializer.Serialize(telemetry);
                    var content = new StringContent(json, Encoding.UTF8, "application/json");

                    // send telemetry to sidecar
                    HttpResponseMessage sidecarResp = null;
                    try
                    {
                        sidecarResp = await client.PostAsync("telemetry", content, stoppingToken).ConfigureAwait(false);
                        AppendLog($"Sent telemetry to sidecar, status={(int)sidecarResp.StatusCode}");
                    }
                    catch (Exception ex)
                    {
                        AppendLog($"Sidecar sending error: {ex.Message}");
                    }

                    // If sidecar returned a plan body, call PlanExecutor.HandlePlan
                    if (sidecarResp != null && sidecarResp.IsSuccessStatusCode)
                    {
                        var body = await sidecarResp.Content.ReadAsStringAsync(stoppingToken).ConfigureAwait(false);
                        if (!string.IsNullOrWhiteSpace(body))
                        {
                            AppendLog($"Sidecar response length={body.Length}. Passing to PlanExecutor.HandlePlan.");
                            try
                            {
                                // pass a logging delegate that appends to file + logger
                                await PlanExecutor.HandlePlan(body, s => AppendLog($"PlanExecutor: {s}"), stoppingToken).ConfigureAwait(false);
                            }
                            catch (Exception ex)
                            {
                                AppendLog($"Exception calling PlanExecutor.HandlePlan: {ex}");
                            }
                        }
                    }
                }
                catch (OperationCanceledException) { /* shutting down */ }
                catch (Exception ex)
                {
                    AppendLog($"PlanExecutorService loop exception: {ex}");
                }

                try
                {
                    await Task.Delay(_poll, stoppingToken).ConfigureAwait(false);
                }
                catch (OperationCanceledException) { break; }
            }

            AppendLog("PlanExecutorService: stopping.");
        }
    }
}
