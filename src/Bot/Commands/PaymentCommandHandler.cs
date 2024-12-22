using Discord.Commands;
using System;
using System.Threading.Tasks;

public class PaymentCommandHandler : ModuleBase<SocketCommandContext>
{
    private readonly PaymentTransaction _paymentTransaction;
    private readonly UserRewardService _rewardService;
    private readonly ILogger _logger;

    public PaymentCommandHandler(
        PaymentTransaction paymentTransaction,
        UserRewardService rewardService,
        ILogger logger)
    {
        _paymentTransaction = paymentTransaction;
        _rewardService = rewardService;
        _logger = logger;
    }

    [Command("shop")]
    [Summary("View available point packages")]
    public async Task ViewShop()
    {
        var packages = Application.BotSettings.PointsConfig.Packages;
        var embed = new EmbedBuilder()
            .WithTitle(Localization.Get("shop_title"))
            .WithColor(Color.Blue);

        foreach (var package in packages)
        {
            embed.AddField(
                package.Name,
                Localization.Get("shop_package_details")
                    .KeyFormat(("points", package.Points), ("price", package.Price))
            );
        }

        await ReplyAsync(embed: embed.Build());
    }

    [Command("buy")]
    [Summary("Purchase a points package")]
    public async Task BuyPoints(string packageId)
    {
        try
        {
            var package = Application.BotSettings.PointsConfig.GetPackage(packageId);
            if (package == null)
            {
                await ReplyAsync(Localization.Get("invalid_package"));
                return;
            }

            var result = await _paymentTransaction.InitiateTransaction(
                Context.User.Id.ToString(),
                package.Price,
                packageId
            );

            if (result.Success)
            {
                var paymentUrl = $"{Application.BotSettings.PaymentConfig.BaseUrl}/pay/{result.Reference}";
                await Context.User.SendMessageAsync(
                    Localization.Get("payment_initiated")
                        .KeyFormat(("url", paymentUrl))
                );
            }
            else
            {
                await ReplyAsync(Localization.Get("payment_initiation_failed"));
            }
        }
        catch (Exception ex)
        {
            _logger.LogError($"Payment command failed: {ex.Message}");
            await ReplyAsync(Localization.Get("general_error"));
        }
    }

    [Command("transactions")]
    [Summary("View your transaction history")]
    public async Task ViewTransactions([Optional] int limit)
    {
        try
        {
            var history = await _transactionHistory.GetUserTransactions(
                Context.User.Id.ToString(), 
                limit > 0 ? limit : 5
            );

            var embed = new EmbedBuilder()
                .WithTitle(Localization.Get("transaction_history_title"))
                .WithColor(Color.Blue);

            foreach (var transaction in history)
            {
                embed.AddField(
                    $"Transaction {transaction.Reference}",
                    Localization.Get("transaction_details").KeyFormat(
                        ("amount", transaction.Amount),
                        ("status", transaction.Status),
                        ("date", transaction.CreatedAt.ToString("g"))
                    )
                );
            }

            await ReplyAsync(embed: embed.Build());
        }
        catch (Exception ex)
        {
            _logger.LogError($"Failed to get transaction history: {ex.Message}");
            await ReplyAsync(Localization.Get("transaction_history_error"));
        }
    }

    [Command("summary")]
    [Summary("View your payment summary")]
    public async Task ViewSummary()
    {
        try
        {
            var summary = await _transactionHistory.GetUserSummary(Context.User.Id.ToString());
            
            var embed = new EmbedBuilder()
                .WithTitle(Localization.Get("payment_summary_title"))
                .WithColor(Color.Gold)
                .AddField(Localization.Get("total_spent"), $"R{summary.TotalSpent:F2}")
                .AddField(Localization.Get("total_points"), summary.TotalPoints)
                .AddField(Localization.Get("success_rate"), $"{summary.SuccessRate:F1}%");

            await ReplyAsync(embed: embed.Build());
        }
        catch (Exception ex)
        {
            _logger.LogError($"Failed to get payment summary: {ex.Message}");
            await ReplyAsync(Localization.Get("summary_error"));
        }
    }
}
