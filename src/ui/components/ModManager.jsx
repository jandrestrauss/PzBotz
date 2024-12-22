import React, { useState, useEffect } from 'react';
import { Box, Table, Button, Text, Badge, Modal } from '@mantine/core';
import { useModState } from '../hooks/useModState';

export const ModManager = () => {
    const { mods, updateMod, installMod, removeMod, checkUpdates } = useModState();
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <Box p="md">
            <Group position="apart" mb="md">
                <Button onClick={checkUpdates}>Check Updates</Button>
                <Button onClick={() => setModalOpen(true)}>Add Mod</Button>
            </Group>

            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Workshop ID</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {mods.map(mod => (
                        <tr key={mod.id}>
                            <td>{mod.name}</td>
                            <td>{mod.workshopId}</td>
                            <td>
                                <Badge color={mod.isEnabled ? 'green' : 'red'}>
                                    {mod.isEnabled ? 'Enabled' : 'Disabled'}
                                </Badge>
                            </td>
                            <td>
                                <Group spacing="xs">
                                    <Button size="xs" onClick={() => updateMod(mod.id)}>
                                        Update
                                    </Button>
                                    <Button size="xs" color="red" onClick={() => removeMod(mod.id)}>
                                        Remove
                                    </Button>
                                </Group>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Box>
    );
};
