using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

public class DatabaseMigrationService
{
    private readonly ILogger<DatabaseMigrationService> _logger;
    private readonly IDatabaseContext _dbContext;

    public DatabaseMigrationService(ILogger<DatabaseMigrationService> logger, IDatabaseContext dbContext)
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    public async Task MigrateAsync()
    {
        try
        {
            _logger.LogInformation("Starting database migration...");

            // Example migration: Create Users table
            await _dbContext.ExecuteAsync(@"
                CREATE TABLE IF NOT EXISTS Users (
                    Id SERIAL PRIMARY KEY,
                    Username VARCHAR(100) NOT NULL,
                    PasswordHash VARCHAR(255) NOT NULL,
                    Role VARCHAR(50) NOT NULL,
                    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            ");

            // Add more migrations as needed

            _logger.LogInformation("Database migration completed successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Database migration failed");
            throw;
        }
    }
}
