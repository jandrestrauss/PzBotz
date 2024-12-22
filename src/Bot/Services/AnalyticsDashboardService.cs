using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

public class AnalyticsDashboardService
{
    private readonly ILogger _logger;
    private readonly PaymentStatsService _statsService;
    private readonly IMetricsCollector _metrics;
    private readonly ICacheManager _cache;

    public AnalyticsDashboardService(
        ILogger logger,
        PaymentStatsService statsService,
        IMetricsCollector metrics,
        ICacheManager cache)
    {
        _logger = logger;
        _statsService = statsService;
        _metrics = metrics;
        _cache = cache;
    }

    public async Task<DashboardData> GetDashboardData()
    {
        try
        {
            var cacheKey = $"dashboard_data_{DateTime.UtcNow:yyyyMMdd_HH}";
            var cachedData = await _cache.GetAsync<DashboardData>(cacheKey);
            if (cachedData != null) return cachedData;

            var stats = await _statsService.GetSystemStats();
            var performanceMetrics = await _metrics.GetCurrentMetrics();
            
            var data = new DashboardData
            {
                SystemStats = stats,
                Performance = performanceMetrics,
                RecentTransactions = await GetRecentTransactionTrends()
            };

            await _cache.SetAsync(cacheKey, data, TimeSpan.FromMinutes(5));
            return data;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Failed to generate dashboard data: {ex.Message}");
            throw;
        }
    }

    private async Task<TransactionTrends> GetRecentTransactionTrends()
    {
        var last24Hours = await _metrics.GetHourlyTransactions(24);
        return new TransactionTrends
        {
            HourlyVolume = last24Hours,
            PeakTime = last24Hours.OrderByDescending(x => x.Value).First().Key,
            TotalVolume = last24Hours.Sum(x => x.Value)
        };
    }
}

public class DashboardData
{
    public SystemStats SystemStats { get; set; }
    public PerformanceMetrics Performance { get; set; }
    public TransactionTrends RecentTransactions { get; set; }
}

public class PerformanceMetrics
{
    public double AverageResponseTime { get; set; }
    public double ErrorRate { get; set; }
    public int ActiveConnections { get; set; }
    public double CacheHitRate { get; set; }
}

public class TransactionTrends
{
    public Dictionary<DateTime, int> HourlyVolume { get; set; }
    public DateTime PeakTime { get; set; }
    public int TotalVolume { get; set; }
}
