using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

public class LocalizationService
{
    private readonly ILogger<LocalizationService> _logger;
    private readonly Dictionary<string, Dictionary<string, string>> _localizations;
    private string _currentLanguage;

    public LocalizationService(ILogger<LocalizationService> logger)
    {
        _logger = logger;
        _localizations = new Dictionary<string, Dictionary<string, string>>();
        _currentLanguage = "en"; // Default language
        LoadLocalizations();
    }

    private void LoadLocalizations()
    {
        var localizationFiles = Directory.GetFiles("localization", "*.json");
        foreach (var file in localizationFiles)
        {
            var language = Path.GetFileNameWithoutExtension(file);
            var content = File.ReadAllText(file);
            var localization = JsonConvert.DeserializeObject<Dictionary<string, string>>(content);
            _localizations[language] = localization;
        }
    }

    public string Get(string key)
    {
        if (_localizations.TryGetValue(_currentLanguage, out var localization) && localization.TryGetValue(key, out var value))
        {
            return value;
        }

        _logger.LogWarning($"Localization key '{key}' not found for language '{_currentLanguage}'.");
        return key; // Return the key as a fallback
    }

    public void SetLanguage(string language)
    {
        if (_localizations.ContainsKey(language))
        {
            _currentLanguage = language;
            _logger.LogInformation($"Language set to '{language}'.");
        }
        else
        {
            _logger.LogWarning($"Language '{language}' not found.");
        }
    }

    public async Task AddLocalization(string language, Dictionary<string, string> localization)
    {
        _localizations[language] = localization;
        var filePath = Path.Combine("localization", $"{language}.json");
        var content = JsonConvert.SerializeObject(localization, Formatting.Indented);
        await File.WriteAllTextAsync(filePath, content);
        _logger.LogInformation($"Localization for language '{language}' added.");
    }
}
