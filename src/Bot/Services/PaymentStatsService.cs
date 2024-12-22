using System;
using System.Threading.Tasks;
using System.Linq;

public class PaymentStatsService
{
    private readonly ITransactionRepository _transactionRepo;
    private readonly ILogger _logger;

    public PaymentStatsService(ITransactionRepository transactionRepo, ILogger logger)
    {
        _transactionRepo = transactionRepo;
        _logger = logger;
    }

    public async Task<SystemStats> GetSystemStats()
    {
        try
        {
            var transactions = await _transactionRepo.GetRecentTransactions(30); // Last 30 days
            var completedTransactions = transactions.Where(t => t.Status == "completed");

            return new SystemStats
            {
                TotalTransactions = transactions.Count,
                TotalRevenue = completedTransactions.Sum(t => t.Amount),
                SuccessRate = (decimal)completedTransactions.Count() / transactions.Count * 100,
                ActiveUsers = transactions.Select(t => t.UserId).Distinct().Count()
            };
        }
        catch (Exception ex)
        {
            _logger.LogError($"Failed to generate system stats: {ex.Message}");
            throw;
        }
    }
}

public class SystemStats
{
    public int TotalTransactions { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal SuccessRate { get; set; }
    public int ActiveUsers { get; set; }
}
