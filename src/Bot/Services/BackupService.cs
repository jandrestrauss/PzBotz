using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.Timers;

public class BackupService
{
    private readonly ILogger<BackupService> _logger;
    private readonly string _backupPath;
    private readonly Timer _backupTimer;

    public BackupService(ILogger<BackupService> logger, string backupPath)
    {
        _logger = logger;
        _backupPath = backupPath;
        _backupTimer = new Timer(TimeSpan.FromHours(24).TotalMilliseconds); // Set to 24 hours
        _backupTimer.Elapsed += async (sender, e) => await PerformBackupAsync();
        _backupTimer.Start();
    }

    public async Task PerformBackupAsync()
    {
        try
        {
            _logger.LogInformation("Starting backup...");

            var backupFileName = Path.Combine(_backupPath, $"backup_{DateTime.UtcNow:yyyyMMddHHmmss}.zip");
            // Implement the logic to create a backup and save it to backupFileName

            _logger.LogInformation($"Backup completed successfully. Backup file: {backupFileName}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Backup failed");
        }
    }
}
