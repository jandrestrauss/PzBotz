import React from 'react';
import { Box, Table, ActionIcon, Text, Badge } from '@mantine/core';
import { usePlayerState } from '../hooks/usePlayerState';

export const PlayerManager = () => {
    const { players, kickPlayer, banPlayer, getPlayerStats } = usePlayerState();

    return (
        <Box p="md">
            <Table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Status</th>
                        <th>Time Played</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map(player => (
                        <tr key={player.id}>
                            <td>{player.username}</td>
                            <td><Badge>{player.status}</Badge></td>
                            <td>{player.timePlayed}</td>
                            <td>
                                <ActionIcon onClick={() => kickPlayer(player.id)} color="red">
                                    Kick
                                </ActionIcon>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Box>
    );
};
