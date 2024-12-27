import { ChannelType, Message, TextChannel } from 'discord.js';

export const createMockChannel = (): TextChannel => ({
    id: '123',
    type: 0, // ChannelType.GuildText is 0
    send: jest.fn(),
    messages: {
        fetch: jest.fn()
    },
    guild: {
        id: '456',
        name: 'Test Guild'
    },
    isTextBased: () => true,
    isThread: () => false
} as unknown as TextChannel);

export const createMockMessage = (channel: TextChannel): Message => ({
    content: '!test',
    reply: jest.fn(),
    author: { 
        bot: false,
        id: '789',
        username: 'testUser'
    },
    channel,
    id: '123456789',
    createdTimestamp: Date.now(),
    guild: channel.guild,
    partial: false
} as unknown as Message);
