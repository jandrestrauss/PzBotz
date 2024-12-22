import React from 'react';
import { Box, Grid, Paper, Title, Text } from '@mantine/core';
import { useStatistics } from '../hooks/useStatistics';
import { LineChart } from './charts/LineChart';

export const StatisticsPanel = () => {
    const { serverStats, playerStats, loading } = useStatistics();

    if (loading) return <Text>Loading statistics...</Text>;

    return (
        <Box p="md">
            <Grid>
                <Grid.Col span={6}>
                    <Paper p="md">
                        <Title order={3}>Server Performance</Title>
                        <LineChart 
                            data={serverStats.map(stat => ({
                                time: new Date(stat.timestamp),
                                value: stat.cpu
                            }))}
                        />
                    </Paper>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Paper p="md">
                        <Title order={3}>Player Activity</Title>
                        <LineChart 
                            data={playerStats.map(stat => ({
                                time: new Date(stat.timestamp),
                                value: stat.count
                            }))}
                        />
                    </Paper>
                </Grid.Col>
            </Grid>
        </Box>
    );
};
