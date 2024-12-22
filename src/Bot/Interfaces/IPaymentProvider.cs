using System.Threading.Tasks;

public interface IPaymentProvider
{
    Task<string> CreateTransaction(TransactionRequest request);
    Task<TransactionStatus> GetTransactionStatus(string reference);
    Task<bool> ValidateWebhook(string payload, string signature);
    Task ProcessRefund(string reference, string reason);
}

public class TransactionRequest
{
    public string UserId { get; set; }
    public decimal Amount { get; set; }
    public string PackageId { get; set; }
    public string Currency { get; set; }
}
