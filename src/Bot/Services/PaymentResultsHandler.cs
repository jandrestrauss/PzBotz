using System;
using System.Threading.Tasks;

public class PaymentResultsHandler
{
    private readonly ILogger _logger;
    private readonly UserRewardService _rewardService;
    private readonly PaymentValidationService _validationService;

    public PaymentResultsHandler(
        ILogger logger,
        UserRewardService rewardService,
        PaymentValidationService validationService)
    {
        _logger = logger;
        _rewardService = rewardService;
        _validationService = validationService;
    }

    public async Task HandlePaymentCallback(string reference, string providerId)
    {
        try
        {
            var validationResult = await _validationService.ValidateTransaction(reference);
            if (validationResult.IsValid)
            {
                await _rewardService.ProcessReward(validationResult);
                _logger.LogInfo($"Payment {reference} processed successfully");
            }
            else
            {
                _logger.LogWarning($"Payment {reference} validation failed");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError("Payment handling failed: {@exMessage}", ex.Message);
            throw;
        }
    }

}
