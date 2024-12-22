using System;
using System.Threading.Tasks;

public class PaymentValidationService
{
    private readonly ILogger _logger;
    private readonly IPaymentProvider _provider;

    public PaymentValidationService(ILogger logger, IPaymentProvider provider)
    {
        _logger = logger;
        _provider = provider;
    }

    public async Task<ValidationResult> ValidateTransaction(string reference)
    {
        try
        {
            var transaction = await _provider.GetTransaction(reference);
            return new ValidationResult
            {
                IsValid = transaction.Status == "success",
                Amount = transaction.Amount,
                Currency = transaction.Currency,
                UserId = transaction.Metadata.UserId
            };
        }
        catch (Exception ex)
        {
            _logger.LogError($"Payment validation failed: {ex.Message}");
            return new ValidationResult { IsValid = false };
        }
    }
}
