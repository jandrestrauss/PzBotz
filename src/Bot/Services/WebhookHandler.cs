using System;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.Text;

public class WebhookHandler
{
    private readonly ILogger _logger;
    private readonly PaymentResultsHandler _paymentHandler;
    private readonly IConfiguration _config;

    public WebhookHandler(ILogger logger, PaymentResultsHandler paymentHandler, IConfiguration config)
    {
        _logger = logger;
        _paymentHandler = paymentHandler;
        _config = config;
    }

    public async Task<bool> HandlePaystackWebhook(string payload, string signature)
    {
        try
        {
            if (!VerifySignature(payload, signature))
            {
                _logger.LogWarning("Invalid webhook signature received");
                return false;
            }

            var webhookEvent = JsonSerializer.Deserialize<PaystackWebhookEvent>(payload);
            await _paymentHandler.HandlePaymentCallback(webhookEvent.Data.Reference, "paystack");
            
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Webhook processing failed: {ex.Message}");
            return false;
        }
    }

    private bool VerifySignature(string payload, string signature)
    {
        var secretKey = _config["Paystack:WebhookSecret"];
        var computedHash = ComputeHash(secretKey, payload);
        return signature == computedHash;
    }

    private string ComputeHash(string secret, string payload)
    {
        var encoding = new ASCIIEncoding();
        byte[] keyByte = encoding.GetBytes(secret);
        byte[] messageBytes = encoding.GetBytes(payload);
        
        using (var hmacsha512 = new HMACSHA512(keyByte))
        {
            byte[] hashmessage = hmacsha512.ComputeHash(messageBytes);
            return Convert.ToHexString(hashmessage);
        }
    }
}
