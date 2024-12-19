module.exports = {
    roles: {
        admin: ['Administrator', 'ServerAdmin'],
        moderator: ['Moderator'],
        player: ['Player']
    },
    commands: {
        backup: ['admin'],
        setPrice: ['admin'],
        wheel: ['player'],
        store: ['player'],
        stats: ['player']
    }
};