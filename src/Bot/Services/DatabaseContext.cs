using System.Data;
using System.Threading.Tasks;
using Dapper;
using Npgsql;

public class DatabaseContext : IDatabaseContext
{
    private readonly string _connectionString;

    public DatabaseContext(string connectionString)
    {
        _connectionString = connectionString;
    }

    public async Task ExecuteAsync(string query)
    {
        using (var connection = new NpgsqlConnection(_connectionString))
        {
            await connection.ExecuteAsync(query);
        }
    }
}
