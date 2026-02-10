// Place this file as PlanExecutor.cs in the same project (folder) as Program.cs and PlanExecutorService.cs
// Make sure Project's default namespace is "HealingAgent"

using System;
using System.Diagnostics;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace HealingAgent
{
    public static class PlanExecutor
    {
        public static async Task HandlePlan(string body, Action<string> appendLog, CancellationToken ct)
        {
            try
            {
                appendLog($"PlanExecutor: HandlePlan called. payload length={(body?.Length ?? 0)}");

                // Extract target (used as AppPool + Site name)
                string poolName = ExtractTargetFromPayload(body) ?? "DWP";
                string siteName = "DWP"; // <-- actual IIS site name;

                if (!string.IsNullOrWhiteSpace(body) &&
                    (body.IndexOf("recycle", StringComparison.OrdinalIgnoreCase) >= 0 ||
                     body.IndexOf("restart", StringComparison.OrdinalIgnoreCase) >= 0 ||
                     body.IndexOf("recycle_app_pool", StringComparison.OrdinalIgnoreCase) >= 0))
                {
                    appendLog($"PlanExecutor: executing heal for Pool '{poolName}'");
                    appendLog($"PlanExecutor: executing heal for Site '{siteName}'");
                    await EnsureAppPoolAndSiteStartedAsync(poolName, siteName, appendLog, ct).ConfigureAwait(false);
                }
                else
                {
                    appendLog("PlanExecutor: payload did not request recycle; skipping action.");
                }
            }
            catch (OperationCanceledException)
            {
                appendLog("PlanExecutor: cancelled");
            }
            catch (Exception ex)
            {
                appendLog($"PlanExecutor: unexpected error: {ex}");
            }
        }

        // ============================================================
        // 🔹 Ensure App Pool + IIS Site are both started
        // ============================================================
        private static async Task EnsureAppPoolAndSiteStartedAsync(
            string poolName,string siteName,
            Action<string> appendLog,
            CancellationToken ct)
        {
            try
            {
                string appcmd = ResolveAppCmd();
                appendLog($"Using appcmd: {appcmd}");

                // -------------------------------
                // 1️⃣ Ensure App Pool
                // -------------------------------
                var poolState = RunProcessCapture(
                    appcmd,
                    $"list apppool \"{poolName}\" /text:state",
                    appendLog,
                    5000
                );

                appendLog($"AppPool '{poolName}' state = '{poolState?.Trim() ?? "UNKNOWN"}'");

                if (poolState == null ||
                    poolState.IndexOf("Started", StringComparison.OrdinalIgnoreCase) < 0)
                {
                    appendLog($"Starting AppPool '{poolName}'");
                    RunProcessCapture(
                        appcmd,
                        $"start apppool \"{poolName}\"",
                        appendLog,
                        10000
                    );
                }
                else
                {
                    appendLog($"AppPool '{poolName}' already started");
                }

                // -------------------------------
                // 2️⃣ Ensure IIS Site
                // -------------------------------
                var siteState = RunProcessCapture(
                    appcmd,
                    $"list site \"{siteName}\" /text:state",
                    appendLog,
                    5000
                );

                appendLog($"Site '{siteName}' state = '{siteState?.Trim() ?? "UNKNOWN"}'");

                if (siteState == null ||
                    siteState.IndexOf("Started", StringComparison.OrdinalIgnoreCase) < 0)
                {
                    appendLog($"Starting IIS Site '{siteName}'");
                    RunProcessCapture(
                        appcmd,
                        $"start site \"{siteName}\"",
                        appendLog,
                        10000
                    );
                }
                else
                {
                    appendLog($"Site '{siteName}' already started");
                }
            }
            catch (Exception ex)
            {
                appendLog($"EnsureAppPoolAndSiteStartedAsync error: {ex}");
            }

            await Task.CompletedTask;
        }

        // ============================================================
        // 🔹 Helpers
        // ============================================================

        private static string ExtractTargetFromPayload(string jsonOrText)
        {
            if (string.IsNullOrEmpty(jsonOrText)) return null;

            try
            {
                var idx = jsonOrText.IndexOf("\"Target\"", StringComparison.OrdinalIgnoreCase);
                if (idx >= 0)
                {
                    var sub = jsonOrText.Substring(idx);
                    var colon = sub.IndexOf(':');
                    if (colon >= 0)
                    {
                        var after = sub.Substring(colon + 1).Trim();
                        if (after.StartsWith("\""))
                        {
                            var end = after.IndexOf('"', 1);
                            if (end > 0)
                                return after.Substring(1, end - 1);
                        }
                    }
                }
            }
            catch { }

            return null;
        }

        private static string ResolveAppCmd()
        {
            var windir = Environment.GetFolderPath(Environment.SpecialFolder.Windows);
            var sys32 = Path.Combine(windir, "System32", "inetsrv", "appcmd.exe");
            var sysnative = Path.Combine(windir, "Sysnative", "inetsrv", "appcmd.exe");

            if (!Environment.Is64BitProcess && File.Exists(sysnative)) return sysnative;
            if (File.Exists(sys32)) return sys32;
            if (File.Exists(sysnative)) return sysnative;
            return "appcmd.exe";
        }

        private static string RunProcessCapture(
            string exe,
            string args,
            Action<string> appendLog,
            int timeoutMs)
        {
            try
            {
                var psi = new ProcessStartInfo
                {
                    FileName = exe,
                    Arguments = args,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using var p = Process.Start(psi);
                if (p == null)
                {
                    appendLog($"Failed to start process {exe}");
                    return null;
                }

                string stdout = p.StandardOutput.ReadToEnd();
                string stderr = p.StandardError.ReadToEnd();

                p.WaitForExit(timeoutMs);

                if (!string.IsNullOrWhiteSpace(stderr))
                    appendLog($"{exe} stderr: {stderr.Trim()}");

                return (stdout ?? string.Empty) + (stderr ?? string.Empty);
            }
            catch (Exception ex)
            {
                appendLog($"RunProcessCapture error: {ex.Message}");
                return null;
            }
        }
    }
}
