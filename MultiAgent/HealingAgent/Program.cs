using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace HealingAgent
{
    public static class Program
    {
        public static int Main(string[] args)
        {
            try
            {
                var builder = Host.CreateDefaultBuilder(args)
                    .ConfigureLogging((ctx, lb) =>
                    {
                        lb.ClearProviders();
                        lb.AddConsole();
                        lb.SetMinimumLevel(LogLevel.Information);
                    })
                    // Add Windows Service support when installed as a service (requires package Microsoft.Extensions.Hosting.WindowsServices)
                    .UseWindowsService()
                    .ConfigureServices((ctx, services) =>
                    {
                        // register HttpClient factory used by PlanExecutorService (sidecar)
                        services.AddHttpClient("sidecar", c =>
                        {
                             c.BaseAddress = new Uri("http://localhost:5000/");
                            // sidecar base
                            c.Timeout = TimeSpan.FromSeconds(10);
                        });

                        // register the concrete hosted service (wrapper around static PlanExecutor)
                        services.AddHostedService<PlanExecutorService>();
                    });

                using var host = builder.Build();
                host.Run(); // runs as console or as service based on environment
                return 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Fatal: " + ex);
                try
                {
                    System.IO.File.AppendAllText(@"D:\Apps\SelfHealingSupervisor\supervisor-actions.log",
                        $"{DateTime.UtcNow:o} - Fatal: {ex}{Environment.NewLine}");
                }
                catch { }
                return 1;
            }
        }
    }
}
