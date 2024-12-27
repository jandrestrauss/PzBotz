import express, { Request, Response, NextFunction } from 'express';
import { BackupManager } from '../services/backupManager';
import { metrics } from '../monitoring/advancedMetrics';
import { logger } from '../utils/logger';

const app = express();

// Basic Express configuration
app.disable('x-powered-by');

// JSON handling middleware
app.use(express.json());

// Response enhancement middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    const oldJson = res.json;
    res.json = function(data) {
        res.contentType('application/json');
        return oldJson.call(this, data);
    };
    next();
});

const backupManager = new BackupManager(process.env.BACKUP_PATH || './backups');

// Routes
app.get('/health', (req: Request, res: Response) => {
    res.contentType('application/json').json({ status: 'ok' });
});

app.get('/metrics', (req: Request, res: Response) => {
    res.contentType('application/json').json({
        system: metrics.getMetrics(),
        database: metrics.getMetrics()
    });
});

app.post('/api/backup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body.invalidData) {
            return res.status(400)
                     .contentType('application/json')
                     .json({ error: 'Invalid backup request data' });
        }

        const backupFile = await backupManager.createBackup();
        res.status(200)
           .contentType('application/json')
           .json({ 
                message: 'Backup created successfully',
                file: backupFile
            });
    } catch (error) {
        next(error);
    }
});

// Error handlers
app.use((req: Request, res: Response) => {
    res.status(404)
       .contentType('application/json')
       .json({ error: 'Route not found' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    res.status(500)
       .contentType('application/json')
       .json({ error: 'Internal server error' });
});

export { app };
