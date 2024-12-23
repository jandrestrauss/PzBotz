using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

public class RateLimitingService
{
    private readonly ILogger<RateLimitingService> _logger;
    private readonly ConcurrentDictionary<string, RateLimitInfo> _rateLimits = new ConcurrentDictionary<string, RateLimitInfo>();
    private readonly int _requestLimit;
    private readonly TimeSpan _timeWindow;

    public RateLimitingService(ILogger<RateLimitingService> logger, int requestLimit, TimeSpan timeWindow)
    {
        _logger = logger;
        _requestLimit = requestLimit;
        _timeWindow = timeWindow;
    }

    public bool IsRequestAllowed(string clientId)
    {
        var now = DateTime.UtcNow;
        var rateLimitInfo = _rateLimits.GetOrAdd(clientId, new RateLimitInfo { WindowStart = now, RequestCount = 0 });

        lock (rateLimitInfo)
        {
            if (now - rateLimitInfo.WindowStart > _timeWindow)
            {
                rateLimitInfo.WindowStart = now;
                rateLimitInfo.RequestCount = 0;
            }

            if (rateLimitInfo.RequestCount < _requestLimit)
            {
                rateLimitInfo.RequestCount++;
                return true;
            }
            else
            {
                _logger.LogWarning($"Rate limit exceeded for client {clientId}");
                return false;
            }
        }
    }

    private class RateLimitInfo
    {
        public DateTime WindowStart { get; set; }
        public int RequestCount { get; set; }
    }
}
