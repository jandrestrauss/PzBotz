const { describe, test, expect } = require('@jest/globals');
const { loadTranslations, translate } = require('../../utils/localization');

describe('Localization', () => {
    test('should load translations correctly', () => {
        const translations = loadTranslations('en');
        expect(translations).toBeDefined();
        expect(typeof translations).toBe('object');
    });

    test('should translate known keys', () => {
        const result = translate('welcome', 'en');
        expect(result).not.toBe('welcome');
        expect(typeof result).toBe('string');
    });

    test('should fall back to key for unknown translations', () => {
        const unknownKey = 'nonexistent.key';
        const result = translate(unknownKey, 'en');
        expect(result).toBe(unknownKey);
    });
});
