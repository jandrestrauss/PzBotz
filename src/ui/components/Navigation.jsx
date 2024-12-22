import React from 'react';
import { Navbar as MantineNavbar, Text } from '@mantine/core';

export const Navigation = ({ onSelect }) => {
    const items = [
        { label: 'Server Control', value: 'server' },
        { label: 'Discord Bot', value: 'discord' },
        { label: 'Mod Manager', value: 'mods' },
        { label: 'Backup Manager', value: 'backup' },
        { label: 'Settings', value: 'settings' },
        { label: 'Logs', value: 'logs' }
    ];

    return (
        <MantineNavbar width={{ base: 250 }} p="xs">
            {items.map(item => (
                <MantineNavbar.Section key={item.value} 
                    onClick={() => onSelect(item.value)}
                    style={{ cursor: 'pointer', padding: '10px' }}>
                    <Text>{item.label}</Text>
                </MantineNavbar.Section>
            ))}
        </MantineNavbar>
    );
};
