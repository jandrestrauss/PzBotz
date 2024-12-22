using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

public class TransactionHistoryService
{
    private readonly ILogger _logger;
    private readonly ITransactionRepository _transactionRepo;

    public TransactionHistoryService(ILogger logger, ITransactionRepository transactionRepo)
    {
        _logger = logger;
        _transactionRepo = transactionRepo;
    }

    public async Task<List<TransactionRecord>> GetUserTransactions(string userId, int limit = 10)
    {
        try
        {
            return await _transactionRepo.GetTransactionsByUser(userId, limit);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Failed to get user transactions: {ex.Message}");
            throw;
        }
    }

    public async Task<TransactionSummary> GetUserSummary(string userId)
    {
        var transactions = await GetUserTransactions(userId, 100);
        return new TransactionSummary
        {
            TotalSpent = transactions.Where(t => t.Status == "completed").Sum(t => t.Amount),
            TotalPoints = transactions.Where(t => t.Status == "completed").Sum(t => t.PointsAwarded),
            SuccessRate = CalculateSuccessRate(transactions)
        };
    }

    private decimal CalculateSuccessRate(List<TransactionRecord> transactions)
    {
        if (!transactions.Any()) return 0;
        return (decimal)transactions.Count(t => t.Status == "completed") / transactions.Count * 100;
    }
}

public class TransactionSummary
{
    public decimal TotalSpent { get; set; }
    public int TotalPoints { get; set; }
    public decimal SuccessRate { get; set; }
}
