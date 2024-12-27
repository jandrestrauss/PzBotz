import express from 'express';
import { BackupManager } from './services/backupManager';
import * as logger from './utils/logger';

const app = express();
const backupManager = new BackupManager('/path/to/backup');

app.post('/api/backup', async (req, res) => {
  try {
    await backupManager.createBackup();
    res.status(200).send({ message: 'Backup created successfully' });
  } catch (error) {
    logger.error('Backup creation failed');
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// ...existing code...

export default app;
