using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace LogCleanupAgent;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;
    private readonly LogCleanupService _cleanupService;

    public Worker(ILogger<Worker> logger, IConfiguration configuration)
    {
        _logger = logger;
        _cleanupService = new LogCleanupService(configuration);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        try
        {
            _logger.LogInformation("LogCleanupAgent started");

            _cleanupService.Cleanup();

            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
                _cleanupService.Cleanup();
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Startup failure");
            throw; // VERY IMPORTANT
        }
    }

}
