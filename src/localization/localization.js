const i18n = require('i18n');

i18n.configure({
    locales: ['en', 'es', 'fr'],
    directory: __dirname + '/locales',
    defaultLocale: 'en',
    objectNotation: true
});

const translate = (key, language) => {
    i18n.setLocale(language);
    return i18n.__(key);
};

module.exports = { translate };
