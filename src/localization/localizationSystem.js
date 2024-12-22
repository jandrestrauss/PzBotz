const fs = require('fs');
const path = require('path');

// ...existing code...

const loadLocalization = (language) => {
  const localizationFile = path.join(__dirname, `locales/${language}.json`);
  if (fs.existsSync(localizationFile)) {
    return JSON.parse(fs.readFileSync(localizationFile, 'utf8'));
  } else {
    throw new Error(`Localization file for ${language} not found.`);
  }
};

// ...existing code...

module.exports = { loadLocalization };
