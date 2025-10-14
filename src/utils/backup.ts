import { Storage } from './storage';

export interface BackupData {
  version: string;
  timestamp: Date;
  data: {
    tasks: any[];
    goals: any[];
    statistics: any;
    settings: any;
    theme: string;
    timerState: any;
    archived_tasks?: any[];
    customThemes?: any[];
  };
}

export class BackupManager {
  private static readonly BACKUP_VERSION = '1.0.0';

  /**
   * Create a complete backup of all application data
   */
  static createBackup(): BackupData {
    const backup: BackupData = {
      version: this.BACKUP_VERSION,
      timestamp: new Date(),
      data: {
        tasks: Storage.get('tasks', []),
        goals: Storage.get('goals', []),
        statistics: Storage.get('statistics', {}),
        settings: Storage.get('settings', {}),
        theme: Storage.get('currentTheme', 'default'),
        timerState: Storage.get('timerState', {}),
        archived_tasks: Storage.get('archived_tasks', []),
        customThemes: Storage.get('customThemes', [])
      }
    };

    return backup;
  }

  /**
   * Export backup data as JSON file
   */
  static exportBackup(): void {
    const backup = this.createBackup();
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;

    const timestamp = new Date().toISOString().split('T')[0];
    link.download = `pomodoro-backup-${timestamp}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  /**
   * Import and restore backup from file
   */
  static async importBackup(file: File): Promise<{ success: boolean; message: string }> {
    try {
      const text = await file.text();
      const backup: BackupData = JSON.parse(text);

      // Validate backup structure
      if (!this.validateBackup(backup)) {
        return {
          success: false,
          message: 'Invalid backup file format'
        };
      }

      // Restore all data
      this.restoreBackup(backup);

      return {
        success: true,
        message: 'Backup restored successfully! Please refresh the page.'
      };
    } catch (error) {
      console.error('Backup import error:', error);
      return {
        success: false,
        message: 'Failed to import backup file'
      };
    }
  }

  /**
   * Validate backup data structure
   */
  private static validateBackup(backup: any): backup is BackupData {
    return (
      backup &&
      typeof backup === 'object' &&
      backup.version &&
      backup.timestamp &&
      backup.data &&
      typeof backup.data === 'object'
    );
  }

  /**
   * Restore backup data to localStorage
   */
  private static restoreBackup(backup: BackupData): void {
    const { data } = backup;

    // Restore all data to localStorage
    if (data.tasks) Storage.set('tasks', data.tasks);
    if (data.goals) Storage.set('goals', data.goals);
    if (data.statistics) Storage.set('statistics', data.statistics);
    if (data.settings) Storage.set('settings', data.settings);
    if (data.theme) Storage.set('currentTheme', data.theme);
    if (data.timerState) Storage.set('timerState', data.timerState);
    if (data.archived_tasks) Storage.set('archived_tasks', data.archived_tasks);
    if (data.customThemes) Storage.set('customThemes', data.customThemes);
  }

  /**
   * Get backup info without restoring
   */
  static async getBackupInfo(file: File): Promise<{ valid: boolean; info?: any }> {
    try {
      const text = await file.text();
      const backup: BackupData = JSON.parse(text);

      if (!this.validateBackup(backup)) {
        return { valid: false };
      }

      return {
        valid: true,
        info: {
          version: backup.version,
          timestamp: backup.timestamp,
          tasksCount: backup.data.tasks?.length || 0,
          goalsCount: backup.data.goals?.length || 0,
          theme: backup.data.theme
        }
      };
    } catch (error) {
      return { valid: false };
    }
  }

  /**
   * Create automatic backup to localStorage
   */
  static createAutoBackup(): void {
    const backup = this.createBackup();
    const backupKey = `auto-backup-${Date.now()}`;

    Storage.set(backupKey, backup);

    // Keep only last 5 auto backups
    this.cleanupOldAutoBackups();
  }

  /**
   * Clean up old automatic backups
   */
  private static cleanupOldAutoBackups(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('auto-backup-'));

    if (keys.length > 5) {
      // Sort by timestamp and remove oldest
      keys.sort().slice(0, keys.length - 5).forEach(key => {
        localStorage.removeItem(key);
      });
    }
  }

  /**
   * Get list of automatic backups
   */
  static getAutoBackups(): Array<{ key: string; timestamp: Date }> {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('auto-backup-'));

    return keys.map(key => ({
      key,
      timestamp: new Date(parseInt(key.replace('auto-backup-', '')))
    })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Restore from automatic backup
   */
  static restoreAutoBackup(key: string): boolean {
    const backup = Storage.get(key, null);

    if (backup && this.validateBackup(backup)) {
      this.restoreBackup(backup);
      return true;
    }

    return false;
  }
}
