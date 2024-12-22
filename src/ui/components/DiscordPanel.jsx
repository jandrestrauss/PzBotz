import React from 'react';
import { Box, Switch, TextInput, Button, Group, Text, Paper } from '@mantine/core';
import { useDiscordBot } from '../hooks/useDiscordBot';

export const DiscordPanel = () => {
    const { status, settings, updateSettings, toggleBot, commandLogs } = useDiscordBot();

    return (
        <Box p="md">
            <Group position="apart" mb="lg">
                <Switch 
                    label="Bot Status"
                    checked={status === 'running'}
                    onChange={toggleBot}
                />
                <Text color={status === 'running' ? 'green' : 'red'}>
                    {status === 'running' ? 'Online' : 'Offline'}
                </Text>
            </Group>

            <Paper p="md" mb="lg">
                <TextInput
                    label="Bot Token"
                    value={settings.token}
                    onChange={(e) => updateSettings('token', e.target.value)}
                    type="password"
                />
            </Paper>

            <Paper p="md" style={{ height: '300px', overflowY: 'auto' }}>
                {commandLogs.map((log, index) => (
                    <Text key={index} size="sm">{log}</Text>
                ))}
            </Paper>
        </Box>
    );
};
