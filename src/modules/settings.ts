import { Storage } from '../utils/storage';
import { AudioManager } from '../utils/audio';
import type { Settings, NotificationSettings } from '../types';

export class SettingsManager {
  private static settings: Settings = {
    pomodoroDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartBreaks: true,
    autoStartPomodoros: true,
    soundEnabled: true,
    notificationsEnabled: true,
    theme: 'default',
    language: 'en'
  };

  private static notificationSettings: NotificationSettings = {
    workSound: '/work.mp3',
    breakSound: '/break.mp3',
    volume: 0.5,
    desktopNotifications: true
  };

  static init(): void {
    this.settings = Storage.get('settings', this.settings);
    this.notificationSettings = Storage.get('notificationSettings', this.notificationSettings);
    
    // Apply settings
    AudioManager.setVolume(this.notificationSettings.volume);
  }

  static getSettings(): Settings {
    return { ...this.settings };
  }

  static getNotificationSettings(): NotificationSettings {
    return { ...this.notificationSettings };
  }

  static updateSettings(updates: Partial<Settings>): void {
    this.settings = { ...this.settings, ...updates };
    this.save();
  }

  static updateNotificationSettings(updates: Partial<NotificationSettings>): void {
    this.notificationSettings = { ...this.notificationSettings, ...updates };
    
    // Apply audio settings
    if (updates.volume !== undefined) {
      AudioManager.setVolume(updates.volume);
    }
    
    this.save();
  }

  static getPomodoroDuration(): number {
    return this.settings.pomodoroDuration;
  }

  static getShortBreakDuration(): number {
    return this.settings.shortBreakDuration;
  }

  static getLongBreakDuration(): number {
    return this.settings.longBreakDuration;
  }

  static getLongBreakInterval(): number {
    return this.settings.longBreakInterval;
  }

  static isAutoStartBreaks(): boolean {
    return this.settings.autoStartBreaks;
  }

  static isAutoStartPomodoros(): boolean {
    return this.settings.autoStartPomodoros;
  }

  static isSoundEnabled(): boolean {
    return this.settings.soundEnabled;
  }

  static isNotificationsEnabled(): boolean {
    return this.settings.notificationsEnabled;
  }

  static getTheme(): string {
    return this.settings.theme;
  }

  static getLanguage(): string {
    return this.settings.language;
  }

  static setPomodoroDuration(duration: number): void {
    this.updateSettings({ pomodoroDuration: Math.max(1, Math.min(60, duration)) });
  }

  static setShortBreakDuration(duration: number): void {
    this.updateSettings({ shortBreakDuration: Math.max(1, Math.min(30, duration)) });
  }

  static setLongBreakDuration(duration: number): void {
    this.updateSettings({ longBreakDuration: Math.max(1, Math.min(60, duration)) });
  }

  static setLongBreakInterval(interval: number): void {
    this.updateSettings({ longBreakInterval: Math.max(1, Math.min(10, interval)) });
  }

  static setAutoStartBreaks(enabled: boolean): void {
    this.updateSettings({ autoStartBreaks: enabled });
  }

  static setAutoStartPomodoros(enabled: boolean): void {
    this.updateSettings({ autoStartPomodoros: enabled });
  }

  static setSoundEnabled(enabled: boolean): void {
    this.updateSettings({ soundEnabled: enabled });
  }

  static setNotificationsEnabled(enabled: boolean): void {
    this.updateSettings({ notificationsEnabled: enabled });
  }

  static setTheme(theme: string): void {
    this.updateSettings({ theme });
  }

  static setLanguage(language: string): void {
    this.updateSettings({ language });
  }

  static setVolume(volume: number): void {
    this.updateNotificationSettings({ volume: Math.max(0, Math.min(1, volume)) });
  }

  static setDesktopNotifications(enabled: boolean): void {
    this.updateNotificationSettings({ desktopNotifications: enabled });
  }

  static resetToDefaults(): void {
    this.settings = {
      pomodoroDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      longBreakInterval: 4,
      autoStartBreaks: false,
      autoStartPomodoros: false,
      soundEnabled: true,
      notificationsEnabled: true,
      theme: 'default',
      language: 'tr'
    };

    this.notificationSettings = {
      workSound: '/work.mp3',
      breakSound: '/break.mp3',
      volume: 0.5,
      desktopNotifications: true
    };

    this.save();
    AudioManager.setVolume(this.notificationSettings.volume);
  }

  static exportSettings(): string {
    return JSON.stringify({
      settings: this.settings,
      notificationSettings: this.notificationSettings
    }, null, 2);
  }

  static importSettings(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.settings) {
        this.settings = { ...this.settings, ...data.settings };
      }
      if (data.notificationSettings) {
        this.notificationSettings = { ...this.notificationSettings, ...data.notificationSettings };
      }
      this.save();
      return true;
    } catch (error) {
      console.error('Error importing settings:', error);
      return false;
    }
  }

  private static save(): void {
    Storage.set('settings', this.settings);
    Storage.set('notificationSettings', this.notificationSettings);
  }
}
