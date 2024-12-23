using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

public class Program
{
    public static async Task Main(string[] args)
    {
        var host = CreateHostBuilder(args).Build();

        using (var scope = host.Services.CreateScope())
        {
            var services = scope.ServiceProvider;
            try
            {
                var migrationService = services.GetRequiredService<DatabaseMigrationService>();
                await migrationService.MigrateAsync();

                var backupService = services.GetRequiredService<BackupService>();
                await backupService.PerformBackupAsync();

                var loggingService = services.GetRequiredService<LoggingService>();
                loggingService.LogInformation("Application started successfully.");

                var rateLimitingService = services.GetRequiredService<RateLimitingService>();
                // Example usage of rate limiting service
                if (rateLimitingService.IsRequestAllowed("client-id"))
                {
                    loggingService.LogInformation("Request allowed.");
                }
                else
                {
                    loggingService.LogWarning("Request denied due to rate limiting.");
                }

                var permissionService = services.GetRequiredService<PermissionService>();
                // Example usage of permission service
                if (permissionService.HasPermission("Admin", "FullServerControl"))
                {
                    loggingService.LogInformation("Admin has full server control.");
                }
                else
                {
                    loggingService.LogWarning("Admin does not have full server control.");
                }

                var localizationService = services.GetRequiredService<LocalizationService>();
                localizationService.SetLanguage("en"); // Set default language
            }
            catch (Exception ex)
            {
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "An error occurred during startup.");
            }
        }

        await host.RunAsync();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureServices((context, services) =>
            {
                services.AddSingleton<IDatabaseContext>(sp =>
                    new DatabaseContext(context.Configuration.GetConnectionString("DefaultConnection")));
                services.AddTransient<DatabaseMigrationService>();
                services.AddSingleton<BackupService>(sp =>
                    new BackupService(sp.GetRequiredService<ILogger<BackupService>>(), context.Configuration["BackupPath"]));
                services.AddSingleton<LoggingService>();
                services.AddSingleton<RateLimitingService>(sp =>
                    new RateLimitingService(sp.GetRequiredService<ILogger<RateLimitingService>>(), 100, TimeSpan.FromMinutes(1)));
                services.AddSingleton<PermissionService>();
                services.AddSingleton<LocalizationService>();
                // ...existing code...
            });
}
