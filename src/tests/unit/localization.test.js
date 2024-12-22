const i18n = require('i18n');
const { translate } = require('../../localization/localization');

jest.mock('i18n');

describe('Localization', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should translate keys correctly', () => {
        i18n.__.mockReturnValue('Hello');
        const result = translate('greeting', 'en');
        expect(result).toBe('Hello');
        expect(i18n.setLocale).toHaveBeenCalledWith('en');
        expect(i18n.__).toHaveBeenCalledWith('greeting');
    });

    test('Should handle missing translations', () => {
        i18n.__.mockReturnValue('greeting');
        const result = translate('greeting', 'unknown');
        expect(result).toBe('greeting');
        expect(i18n.setLocale).toHaveBeenCalledWith('unknown');
        expect(i18n.__).toHaveBeenCalledWith('greeting');
    });
});
