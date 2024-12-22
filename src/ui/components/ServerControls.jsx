import React from 'react';
import { Box, Group, Button, Paper, Text, Progress } from '@mantine/core';
import { useServerControls } from '../hooks/useServerControls';

export const ServerControls = () => {
    const { serverState, startServer, stopServer, restartServer, metrics } = useServerControls();

    return (
        <Box p="md">
            <Group position="apart" mb="xl">
                <Button 
                    color="green" 
                    onClick={startServer}
                    disabled={serverState === 'running'}>
                    Start Server
                </Button>
                <Button 
                    color="red" 
                    onClick={stopServer}
                    disabled={serverState === 'stopped'}>
                    Stop Server
                </Button>
                <Button onClick={restartServer}>
                    Restart Server
                </Button>
            </Group>

            <Paper p="md">
                <Text size="sm" mb="xs">CPU Usage</Text>
                <Progress 
                    value={metrics.cpu} 
                    color={metrics.cpu > 80 ? 'red' : 'blue'} 
                    mb="md"
                />
                <Text size="sm" mb="xs">Memory Usage</Text>
                <Progress 
                    value={metrics.memory} 
                    color={metrics.memory > 80 ? 'red' : 'blue'}
                />
            </Paper>
        </Box>
    );
};
