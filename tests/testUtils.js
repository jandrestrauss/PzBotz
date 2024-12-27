const database = require('../src/database');

async function createTestUser() {
    // Add code to create test user in database
    return await database.users.create({
        username: 'testUser',
        discordId: '123456789'
    });
}

async function cleanupTestData() {
    // Clean up all test data
    await database.users.destroy({
        where: {
            username: 'testUser'
        }
    });
}

module.exports = {
    createTestUser,
    cleanupTestData
};
