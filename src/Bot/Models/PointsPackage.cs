public class PointsPackage
{
    public string Id { get; set; }
    public string Name { get; set; }
    public int Points { get; set; }
    public decimal Price { get; set; }
    public string Currency { get; set; } = "ZAR";
    public bool IsActive { get; set; } = true;
}

public class PointsConfig
{
    public List<PointsPackage> Packages { get; set; }
    public decimal ConversionRate { get; set; }
    public bool TransferEnabled { get; set; }
    public int MinTransfer { get; set; }
    public int MaxTransfer { get; set; }

    public PointsPackage GetPackage(string id)
    {
        return Packages?.FirstOrDefault(p => p.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
    }
}
