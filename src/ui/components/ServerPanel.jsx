import React from 'react';
import { Box, Button, Group, Text, Paper } from '@mantine/core';
import { useServerState } from '../hooks/useServerState';

export const ServerPanel = () => {
    const { status, startServer, stopServer, restartServer, logs } = useServerState();

    return (
        <Box p="md">
            <Group position="apart" mb="md">
                <Button onClick={startServer} disabled={status === 'running'}>
                    Start Server
                </Button>
                <Button onClick={stopServer} disabled={status === 'stopped'}>
                    Stop Server
                </Button>
                <Button onClick={restartServer} disabled={status === 'stopped'}>
                    Restart Server
                </Button>
            </Group>
            
            <Paper p="md" style={{ height: '400px', overflowY: 'auto' }}>
                {logs.map((log, index) => (
                    <Text key={index}>{log}</Text>
                ))}
            </Paper>
        </Box>
    );
};
