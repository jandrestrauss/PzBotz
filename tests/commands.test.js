const { expect } = require('chai');
const sinon = require('sinon');
const { Message } = require('discord.js');
const commandHandler = require('../src/commands/handler');

describe('Command Tests', () => {
    let mockMessage;
    
    beforeEach(() => {
        mockMessage = {
            reply: sinon.spy(),
            author: { id: '123', tag: 'testUser#1234' },
            member: { permissions: { has: () => true } }
        };
    });

    describe('Status Command', () => {
        it('should return server status', async () => {
            await commandHandler.handleCommand(mockMessage, ['status']);
            expect(mockMessage.reply.called).to.be.true;
        });
    });

    describe('Points Command', () => {
        it('should return player points', async () => {
            await commandHandler.handleCommand(mockMessage, ['points']);
            expect(mockMessage.reply.called).to.be.true;
        });
    });
});
