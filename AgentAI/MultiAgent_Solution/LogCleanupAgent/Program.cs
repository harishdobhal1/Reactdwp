using LogCleanupAgent;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection; // ⭐ REQUIRED

IHost host = Host.CreateDefaultBuilder(args)
    .UseWindowsService()
    .ConfigureServices(services =>
    {
        services.AddHostedService<Worker>(); // now works
    })
    .Build();

host.Run();
