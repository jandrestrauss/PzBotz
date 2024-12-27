export interface BackupResult {
    message: string;
    backupFile: string;
}

export interface BackupService {
    createBackup(): Promise<BackupResult>;
    restoreBackup(file: string): Promise<void>;
    deleteBackup(file: string): Promise<void>;
}
