const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class LocalizationManager {
    constructor() {
        this.translations = new Map();
        this.currentLocale = 'default';
        this.loadTranslations();
    }

    loadTranslations() {
        const localesPath = path.join(__dirname, '../../localization');
        try {
            const files = fs.readdirSync(localesPath).filter(file => file.endsWith('.json'));
            files.forEach(file => {
                const locale = file.replace('.json', '');
                const content = JSON.parse(fs.readFileSync(path.join(localesPath, file), 'utf8'));
                this.translations.set(locale, content);
            });
            logger.info(`Loaded ${files.length} translations`);
        } catch (error) {
            logger.error('Error loading translations:', error);
        }
    }

    setLocale(locale) {
        if (this.translations.has(locale)) {
            this.currentLocale = locale;
            return true;
        }
        return false;
    }

    translate(key, replacements = {}) {
        const translations = this.translations.get(this.currentLocale) || this.translations.get('default');
        let text = translations[key] || key;
        
        Object.entries(replacements).forEach(([key, value]) => {
            text = text.replace(`{${key}}`, value);
        });
        
        return text;
    }

    getAvailableLocales() {
        return Array.from(this.translations.keys());
    }
}

module.exports = new LocalizationManager();
