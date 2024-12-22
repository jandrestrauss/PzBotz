using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using System.Linq;

public class LoadBalancerService
{
    private readonly ILogger _logger;
    private readonly ICacheManager _cache;
    private readonly ConcurrentDictionary<string, ProviderHealth> _healthStatus;
    private readonly IEnumerable<IPaymentProvider> _providers;

    public LoadBalancerService(
        ILogger logger,
        ICacheManager cache,
        IEnumerable<IPaymentProvider> providers)
    {
        _logger = logger;
        _cache = cache;
        _providers = providers;
        _healthStatus = new ConcurrentDictionary<string, ProviderHealth>();
        InitializeHealthChecks();
    }

    private void InitializeHealthChecks()
    {
        foreach (var provider in _providers)
        {
            _healthStatus[provider.Name] = new ProviderHealth
            {
                IsHealthy = true,
                LastCheck = DateTime.UtcNow,
                FailureCount = 0
            };
        }
    }

    public async Task<IPaymentProvider> GetOptimalProvider(decimal amount)
    {
        var healthyProviders = _providers.Where(p => 
            _healthStatus[p.Name].IsHealthy && 
            p.SupportsAmount(amount));

        if (!healthyProviders.Any())
        {
            _logger.LogError("No healthy providers available");
            throw new NoHealthyProvidersException();
        }

        var provider = await SelectProviderByWeight(healthyProviders);
        _logger.LogInfo($"Selected provider: {provider.Name}");
        return provider;
    }

    public async Task UpdateProviderHealth(string providerName, bool isHealthy)
    {
        if (_healthStatus.TryGetValue(providerName, out var health))
        {
            health.IsHealthy = isHealthy;
            health.LastCheck = DateTime.UtcNow;
            
            if (!isHealthy)
            {
                health.FailureCount++;
                if (health.FailureCount >= 3)
                {
                    await HandleProviderFailure(providerName);
                }
            }
            else
            {
                health.FailureCount = 0;
            }
        }
    }

    private async Task HandleProviderFailure(string providerName)
    {
        _logger.LogError($"Provider {providerName} marked as unhealthy");
        await _cache.SetAsync($"provider_health_{providerName}", false, TimeSpan.FromMinutes(5));
        // Notify administrators about provider failure
    }
}

public class ProviderHealth
{
    public bool IsHealthy { get; set; }
    public DateTime LastCheck { get; set; }
    public int FailureCount { get; set; }
}

public class NoHealthyProvidersException : Exception
{
    public NoHealthyProvidersException() 
        : base("No healthy payment providers available") { }
}
