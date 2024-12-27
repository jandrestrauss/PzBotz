const { expect } = require('chai');
const LinkingManager = require('../../src/modules/linkingManager');

describe('LinkingManager', () => {
    let linkingManager;

    beforeEach(() => {
        linkingManager = new LinkingManager();
    });

    it('should generate valid link codes', () => {
        const code = linkingManager.generateLinkCode('123456789');
        expect(code).to.match(/^[A-F0-9]{6}$/);
    });

    it('should store pending links', () => {
        const discordId = '123456789';
        const code = linkingManager.generateLinkCode(discordId);
        const pending = linkingManager.pendingLinks.get(code);
        expect(pending).to.exist;
        expect(pending.discordId).to.equal(discordId);
    });

    it('should expire links after 5 minutes', () => {
        const code = linkingManager.generateLinkCode('123456789');
        const pending = linkingManager.pendingLinks.get(code);
        expect(pending.expires - pending.timestamp).to.equal(300000);
    });
});
