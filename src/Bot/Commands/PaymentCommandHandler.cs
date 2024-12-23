using Discord.Commands;
using System;
using System.Threading.Tasks;

public class PaymentCommandHandler : ModuleBase<SocketCommandContext>
{
    private readonly PaymentTransaction _paymentTransaction;
    private readonly UserRewardService _rewardService;
    private readonly ILogger _logger;
    private readonly ITransactionHistory _transactionHistory;

    public PaymentCommandHandler(
        PaymentTransaction paymentTransaction,
        UserRewardService rewardService,
        ILogger logger,
        ITransactionHistory transactionHistory)
    {
        _paymentTransaction = paymentTransaction;
        _rewardService = rewardService;
        _logger = logger;
        _transactionHistory = transactionHistory;
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

            if (package.Price <= 0 || package.Points <= 0)
            {
                await ReplyAsync(Localization.Get("invalid_package_details"));
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

                // Distribute points after successful payment
                await _rewardService.DistributePoints(Context.User.Id.ToString(), package.Points);
                await ReplyAsync(Localization.Get("points_distributed").KeyFormat(("points", package.Points)));
            }
            else
            {
                await ReplyAsync(Localization.Get("payment_initiation_failed"));
            }
        }
        catch (NetworkException ex)
        {
            _logger.LogError(ex, "Network error occurred while processing payment");
            await ReplyAsync(Localization.Get("network_error"));
        }
        catch (PaymentException ex)
        {
            _logger.LogError(ex, "Payment processing error");
            await ReplyAsync(Localization.Get("payment_error"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unexpected error occurred");
            await ReplyAsync(Localization.Get("general_error"));
        }
    }

    [Command("transactions")]
    [Summary("View your transaction history")]
    public async Task ViewTransactions([Optional] int page = 1, [Optional] int pageSize = 5)
    {
        try
        {
            if (page <= 0) page = 1;
            if (pageSize <= 0) pageSize = 5;

            var history = await _transactionHistory.GetUserTransactions(
                Context.User.Id.ToString(), 
                page, 
                pageSize
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
            _logger.LogError(ex, "Failed to get transaction history");
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
            _logger.LogError(ex, "Failed to get payment summary");
            await ReplyAsync(Localization.Get("summary_error"));
        }
    }

    [Command("transactionStatus")]
    [Summary("Check the status of a pending transaction")]
    public async Task CheckTransactionStatus(string reference)
    {
        try
        {
            var status = await _paymentTransaction.GetTransactionStatus(reference);
            await ReplyAsync(Localization.Get("transaction_status").KeyFormat(("status", status)));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to check transaction status");
            await ReplyAsync(Localization.Get("transaction_status_error"));
        }
    }

    [Command("refund")]
    [Summary("Refund a transaction (Admin only)")]
    [RequireUserPermission(GuildPermission.Administrator)]
    public async Task RefundTransaction(string reference)
    {
        try
        {
            var result = await _paymentTransaction.RefundTransaction(reference);
            if (result.Success)
            {
                await ReplyAsync(Localization.Get("refund_success"));
            }
            else
            {
                await ReplyAsync(Localization.Get("refund_failed"));
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to refund transaction");
            await ReplyAsync(Localization.Get("refund_error"));
        }
    }
}
