using Discord.Commands;
using System;
using System.Threading.Tasks;

[RequireUserPermission(GuildPermission.Administrator)]
public class AdminPaymentCommands : ModuleBase<SocketCommandContext>
{
    private readonly ILogger _logger;
    private readonly PaymentTransaction _paymentTransaction;
    private readonly TransactionHistoryService _historyService;
    private readonly AnalyticsDashboardService _analyticsDashboard;

    public AdminPaymentCommands(
        ILogger logger,
        PaymentTransaction paymentTransaction,
        TransactionHistoryService historyService,
        AnalyticsDashboardService analyticsDashboard)
    {
        _logger = logger;
        _paymentTransaction = paymentTransaction;
        _historyService = historyService;
        _analyticsDashboard = analyticsDashboard;
    }

    [Command("payment-stats")]
    [Summary("View payment system statistics")]
    public async Task ViewPaymentStats()
    {
        try
        {
            var stats = await _historyService.GetSystemStats();
            var embed = new EmbedBuilder()
                .WithTitle("Payment System Statistics")
                .WithColor(Color.Blue)
                .AddField("Total Transactions", stats.TotalTransactions)
                .AddField("Total Revenue", $"R{stats.TotalRevenue:F2}")
                .AddField("Success Rate", $"{stats.SuccessRate:F1}%")
                .AddField("Active Users", stats.ActiveUsers);

            await ReplyAsync(embed: embed.Build());
        }
        catch (Exception ex)
        {
            _logger.LogError($"Failed to get payment stats: {ex.Message}");
            await ReplyAsync("Failed to retrieve payment statistics.");
        }
    }

    [Command("refund")]
    [Summary("Process a refund")]
    public async Task ProcessRefund(string transactionId, string reason)
    {
        try
        {
            var result = await _paymentTransaction.ProcessRefund(transactionId, reason);
            if (result.Success)
            {
                await ReplyAsync($"Refund processed successfully for transaction {transactionId}");
            }
            else
            {
                await ReplyAsync($"Failed to process refund: {result.Error}");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError($"Refund processing failed: {ex.Message}");
            await ReplyAsync("Failed to process refund.");
        }
    }

    [Command("dashboard")]
    [Summary("View payment system analytics dashboard")]
    public async Task ViewDashboard()
    {
        try
        {
            var dashboard = await _analyticsDashboard.GetDashboardData();
            var embed = new EmbedBuilder()
                .WithTitle("Payment Analytics Dashboard")
                .WithColor(Color.Purple)
                .AddField("Transaction Volume (24h)", dashboard.RecentTransactions.TotalVolume)
                .AddField("Peak Hour", dashboard.RecentTransactions.PeakTime.ToString("HH:mm"))
                .AddField("System Performance", 
                    $"Response Time: {dashboard.Performance.AverageResponseTime:F2}ms\n" +
                    $"Error Rate: {dashboard.Performance.ErrorRate:F2}%\n" +
                    $"Cache Hit Rate: {dashboard.Performance.CacheHitRate:F2}%")
                .WithFooter($"Last Updated: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC");

            await ReplyAsync(embed: embed.Build());
        }
        catch (Exception ex)
        {
            _logger.LogError($"Failed to generate dashboard: {ex.Message}");
            await ReplyAsync("Failed to retrieve dashboard data.");
        }
    }
}
