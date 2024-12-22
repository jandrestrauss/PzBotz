import React, { useState, useEffect } from 'react';
import { Box, Table, Button, Text, Modal, Group } from '@mantine/core';
import { useBackupState } from '../hooks/useBackupState';

export const BackupManager = () => {
    const { backups, createBackup, restoreBackup, deleteBackup, scheduleBackup } = useBackupState();
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <Box p="md">
            <Group position="apart" mb="md">
                <Button onClick={() => setModalOpen(true)}>Create Backup</Button>
                <Button onClick={scheduleBackup}>Schedule Backup</Button>
            </Group>

            <Table>
                <thead>
                    <tr>
                        <th>Backup Name</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {backups.map(backup => (
                        <tr key={backup.id}>
                            <td>{backup.name}</td>
                            <td>{new Date(backup.date).toLocaleString()}</td>
                            <td>
                                <Group spacing="xs">
                                    <Button size="xs" onClick={() => restoreBackup(backup.id)}>
                                        Restore
                                    </Button>
                                    <Button size="xs" color="red" onClick={() => deleteBackup(backup.id)}>
                                        Delete
                                    </Button>
                                </Group>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Create Backup">
                <Button onClick={createBackup}>Confirm</Button>
            </Modal>
        </Box>
    );
};
