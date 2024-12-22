import React from 'react';
import { Box, TextInput, Button, Group } from '@mantine/core';
import { useSettingsState } from '../hooks/useSettingsState';

export const SettingsPanel = () => {
    const { settings, updateSetting, saveSettings } = useSettingsState();

    return (
        <Box p="md">
            <TextInput
                label="Server Path"
                value={settings.serverPath}
                onChange={(e) => updateSetting('serverPath', e.target.value)}
                mb="md"
            />
            <TextInput
                label="Admin Password"
                value={settings.adminPassword}
                onChange={(e) => updateSetting('adminPassword', e.target.value)}
                mb="md"
            />
            <TextInput
                label="RCON Password"
                value={settings.rconPassword}
                onChange={(e) => updateSetting('rconPassword', e.target.value)}
                mb="md"
            />
            <Group position="right">
                <Button onClick={saveSettings}>Save Settings</Button>
            </Group>
        </Box>
    );
};
