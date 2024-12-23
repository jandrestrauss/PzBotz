using System;
using System.IO;
using Microsoft.Extensions.Logging;
using Serilog;
using Serilog.Events;
using Serilog.Formatting.Compact;

public class LoggingService
{
    private readonly ILogger<LoggingService> _logger;

    public LoggingService(ILogger<LoggingService> logger)
    {
        _logger = logger;
        ConfigureLogging();
    }

    private void ConfigureLogging()
    {
        var logPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "logs");

        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Debug()
            .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
            .Enrich.FromLogContext()
            .WriteTo.Console()
            .WriteTo.File(new CompactJsonFormatter(), Path.Combine(logPath, "log-.json"), rollingInterval: RollingInterval.Day)
            .CreateLogger();

        _logger.LogInformation("Logging configured successfully.");
    }

    public void LogInformation(string message)
    {
        _logger.LogInformation(message);
    }

    public void LogWarning(string message)
    {
        _logger.LogWarning(message);
    }

    public void LogError(Exception ex, string message)
    {
        _logger.LogError(ex, message);
    }

    public void LogCritical(Exception ex, string message)
    {
        _logger.LogCritical(ex, message);
    }
}
