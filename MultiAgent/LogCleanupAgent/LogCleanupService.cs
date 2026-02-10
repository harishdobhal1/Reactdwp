using Microsoft.Extensions.Configuration;

namespace LogCleanupAgent;

public class LogCleanupService
{
    private readonly string _folderPath;
    private readonly string _filePrefix;

    public LogCleanupService(IConfiguration configuration)
    {
        _folderPath = configuration["LogCleanup:FolderPath"]
       ?? throw new Exception("LogCleanup:FolderPath is missing");

        _filePrefix = configuration["LogCleanup:FilePrefix"]
            ?? throw new Exception("LogCleanup:FilePrefix is missing");
    }

    public void Cleanup()
    {
        if (!Directory.Exists(_folderPath))
        {
            Console.WriteLine($"Directory not found: {_folderPath}");
            return;
        }

        DateTime sysDate = DateTime.Now;

        var files = Directory.GetFiles(_folderPath, $"{_filePrefix}*");

        foreach (var file in files)
        {
            try
            {
                DateTime lastWriteTime = File.GetLastWriteTime(file);

                // Delete files less than sysdate (any past file)
                if (lastWriteTime < sysDate)
                {
                    File.Delete(file);
                    Console.WriteLine($"Deleted: {file}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to delete {file}: {ex.Message}");
            }
        }
    }
}
