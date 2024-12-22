using System;
using System.Threading.Tasks;

public class PaymentTransaction
{
    private readonly ILogger _logger;
    private readonly LoadBalancerService _loadBalancer;
    private readonly UserRewardService _rewardService;

    public PaymentTransaction(ILogger logger, LoadBalancerService loadBalancer, UserRewardService rewardService)
    {
        _logger = logger;
        _loadBalancer = loadBalancer;
        _rewardService = rewardService;
    }

    public async Task<TransactionResult> InitiateTransaction(string userId, decimal amount, string packageId)
    {
        try
        {
            var provider = await _loadBalancer.GetOptimalProvider(amount);
            var reference = await provider.CreateTransaction(new TransactionRequest
            {
                UserId = userId,
                Amount = amount,
                PackageId = packageId,
                Currency = "ZAR"
            });

            _logger.LogInfo($"Transaction initiated: {reference} for user {userId}");
            return new TransactionResult { 
                Success = true, 
                Reference = reference 
            };
        }
        catch (NoHealthyProvidersException)
        {
            _logger.LogError("No payment providers available");
            return new TransactionResult { 
                Success = false, 
                Error = "Payment system temporarily unavailable" 
            };
        }
        catch (Exception ex)
        {
            _logger.LogError($"Transaction initiation failed: {ex.Message}");
            return new TransactionResult { 
                Success = false, 
                Error = ex.Message 
            };
        }
    }
}
