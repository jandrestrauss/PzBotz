using System;
using System.Threading.Tasks;

public class UserRewardService
{
    private readonly ILogger _logger;
    private readonly IPointsRepository _pointsRepo;
    private readonly IDiscordNotifier _notifier;

    public UserRewardService(ILogger logger, IPointsRepository pointsRepo, IDiscordNotifier notifier)
    {
        _logger = logger;
        _pointsRepo = pointsRepo;
        _notifier = notifier;
    }

    public async Task ProcessReward(ValidationResult validation)
    {
        if (!validation.IsValid)
        {
            _logger.LogWarning($"Attempted to process invalid transaction for user {validation.UserId}");
            return;
        }

        try
        {
            var points = CalculatePoints(validation.Amount);
            await _pointsRepo.AddPoints(validation.UserId, points);
            await _notifier.NotifyUser(validation.UserId, 
                Localization.Get("reward_points_added").KeyFormat(("points", points)));
        }
        catch (Exception ex)
        {
            _logger.LogError($"Failed to process reward: {ex.Message}");
            throw;
        }
    }

    private int CalculatePoints(decimal amount)
    {
        return (int)(amount * Application.BotSettings.PointsConfig.ConversionRate);
    }
}
