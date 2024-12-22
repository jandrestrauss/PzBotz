public class PaystackWebhookEvent
{
    public string Event { get; set; }
    public PaystackWebhookData Data { get; set; }
}

public class PaystackWebhookData
{
    public string Reference { get; set; }
    public string Status { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; }
    public PaystackMetadata Metadata { get; set; }
}

public class PaystackMetadata
{
    public string UserId { get; set; }
    public string PackageId { get; set; }
}
