using Discord.Commands;
using System.Threading.Tasks;

public class PaymentCommands : ModuleBase<SocketCommandContext>
{
    private readonly PaymentResultsHandler _paymentHandler;
    private readonly IPointsRepository _pointsRepo;

    public PaymentCommands(PaymentResultsHandler paymentHandler, IPointsRepository pointsRepo)
    {
        _paymentHandler = paymentHandler;
        _pointsRepo = pointsRepo;
    }

    [Command("points")]
    [Summary("Check your points balance")]
    public async Task CheckPoints()
    {
        var points = await _pointsRepo.GetPoints(Context.User.Id.ToString());
        await ReplyAsync(Localization.Get("points_balance_message")
            .KeyFormat(("points", points)));
    }

    [Command("buy")]
    [Summary("Purchase points package")]
    public async Task BuyPoints(string packageId)
    {
        // Implementation coming in next update
        await ReplyAsync(Localization.Get("points_purchase_initiated"));
    }
}
