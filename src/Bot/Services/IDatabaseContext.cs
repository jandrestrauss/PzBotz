
using System.Threading.Tasks;

public interface IDatabaseContext
{
    Task ExecuteAsync(string query);
}