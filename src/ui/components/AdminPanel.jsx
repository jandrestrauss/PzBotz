import React from 'react';
import { Box, Tabs, Paper } from '@mantine/core';
import { UserManagement } from './admin/UserManagement';
import { ServerConfig } from './admin/ServerConfig';
import { SystemLogs } from './admin/SystemLogs';

export const AdminPanel = () => {
    return (
        <Box p="md">
            <Tabs defaultValue="users">
                <Tabs.List>
                    <Tabs.Tab value="users">User Management</Tabs.Tab>
                    <Tabs.Tab value="config">Server Configuration</Tabs.Tab>
                    <Tabs.Tab value="logs">System Logs</Tabs.Tab>
                </Tabs.List>

                <Paper p="md" mt="md">
                    <Tabs.Panel value="users">
                        <UserManagement />
                    </Tabs.Panel>
                    <Tabs.Panel value="config">
                        <ServerConfig />
                    </Tabs.Panel>
                    <Tabs.Panel value="logs">
                        <SystemLogs />
                    </Tabs.Panel>
                </Paper>
            </Tabs>
        </Box>
    );
};
