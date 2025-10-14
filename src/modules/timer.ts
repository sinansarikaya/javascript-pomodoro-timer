import { AudioManager } from '../utils/audio';
import { StatisticsManager } from './statistics';
import { GoalManager } from './goals';
import { TaskManager } from './tasks';
import { SettingsManager } from './settings';
import { Storage } from '../utils/storage';
import { I18n } from '../utils/i18n';
import type { TimeData, PomodoroSession } from '../types';

export class TimerManager {
  private static timeData: TimeData;
  private static interval: number | null = null;
  private static currentSession: PomodoroSession | null = null;
  private static callbacks: {
    onTick?: (time: number) => void;
    onComplete?: (mode: string) => void;
    onModeChange?: (mode: string) => void;
    onStart?: () => void;
  } = {};

  static init(): void {
    this.timeData = {
      pomodoro: SettingsManager.getPomodoroDuration(),
      shortBreak: SettingsManager.getShortBreakDuration(),
      longBreak: SettingsManager.getLongBreakDuration(),
      cycle: 0,
      mode: 'pomodoro',
      status: false
    };
    
    // Load saved state
    const savedState = Storage.get('timerState', null);
    if (savedState && typeof savedState === 'object') {
      this.timeData = { ...this.timeData, ...(savedState as Partial<TimeData>) };
    }
  }

  static getTimeData(): TimeData {
    return { ...this.timeData };
  }

  static getCurrentTime(): number {
    return this.timeData.mode === 'pomodoro' 
      ? this.timeData.pomodoro * 60
      : this.timeData.mode === 'short'
      ? this.timeData.shortBreak * 60
      : this.timeData.longBreak * 60;
  }

  static start(): void {
    if (this.timeData.status) return;

    this.timeData.status = true;
    
    // Start new session
    this.currentSession = {
      id: this.generateId(),
      startTime: new Date(),
      duration: this.getCurrentTime(),
      mode: this.timeData.mode,
      completed: false
    };
    

    this.interval = setInterval(() => {
      this.tick();
    }, 1000) as unknown as number;
    
    // Notify that timer started
    this.callbacks.onStart?.();
  }

  static pause(): void {
    this.timeData.status = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  static stop(): void {
    this.pause();
    this.timeData.cycle = 0;
    this.timeData.mode = 'pomodoro';
    this.currentSession = null;
  }

  static reset(): void {
    this.stop();
    this.timeData.mode = 'pomodoro';
    this.timeData.cycle = 0;
  }

  static setMode(mode: 'pomodoro' | 'short' | 'long'): void {
    const wasRunning = this.timeData.status;
    this.pause();
    this.timeData.mode = mode;
    this.currentSession = null; // Clear current session
    this.saveState();
    this.callbacks.onModeChange?.(mode);
    
    // Play sound when switching modes manually
    if (SettingsManager.isSoundEnabled()) {
      if (mode === 'pomodoro') {
        AudioManager.playWorkSound();
      } else {
        AudioManager.playBreakSound();
      }
    }
    
    // Update display immediately
    this.callbacks.onTick?.(this.getCurrentTime());
    
    // If timer was running, auto-start the new mode
    if (wasRunning) {
      setTimeout(() => {
        this.start();
      }, 100);
    }
  }

  static setCallbacks(callbacks: typeof this.callbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  private static tick(): void {
    // Decrease the current session duration
    if (this.currentSession && this.timeData.status) {
      this.currentSession.duration--;
      this.callbacks.onTick?.(this.currentSession.duration);

      if (this.currentSession.duration <= 0) {
        this.completeSession();
      }
    }
  }

  private static completeSession(): void {
    const completedMode = this.timeData.mode;
    this.pause();

    // Complete current session
    if (this.currentSession) {
      this.currentSession.completed = true;
      this.currentSession.endTime = new Date();
      
      // Only add pomodoro sessions to statistics
      if (this.currentSession.mode === 'pomodoro') {
        StatisticsManager.addSession(this.currentSession);
        
        // Update goals when pomodoro is completed
        GoalManager.completePomodoro();
        
        // Add pomodoro to active task if one is selected
        TaskManager.addPomodoroToActiveTask();
      }
    }

    // Switch to next mode IMMEDIATELY
    this.switchToNextMode();

    // Play sound - play the sound for the NEW mode
    if (SettingsManager.isSoundEnabled()) {
      if (completedMode === 'pomodoro') {
        // Pomodoro finished, now in break mode - play break sound
        AudioManager.playBreakSound();
      } else {
        // Break finished, now in pomodoro mode - play work sound
        AudioManager.playWorkSound();
      }
    }

    // Show notification
    if (SettingsManager.isNotificationsEnabled()) {
      this.showNotification(completedMode);
    }

    // Notify completion
    this.callbacks.onComplete?.(completedMode);

    // If auto-start is enabled, start the timer in the new mode
    if (this.shouldAutoStart()) {
      setTimeout(() => {
        this.start();
      }, 1000);
    }
  }

  private static switchToNextMode(): void {
    const currentMode = this.timeData.mode;
    
    switch (currentMode) {
      case 'pomodoro':
        this.timeData.cycle++;
        if (this.timeData.cycle % SettingsManager.getLongBreakInterval() === 0) {
          this.timeData.mode = 'long';
        } else {
          this.timeData.mode = 'short';
        }
        break;
      case 'short':
      case 'long':
        this.timeData.mode = 'pomodoro';
        break;
    }
    
    // Update UI
    this.saveState();
    this.callbacks.onModeChange?.(this.timeData.mode);
  }

  private static shouldAutoStart(): boolean {
    if (this.timeData.mode === 'pomodoro') {
      return SettingsManager.isAutoStartPomodoros();
    } else {
      return SettingsManager.isAutoStartBreaks();
    }
  }

  private static showNotification(completedMode?: string): void {
    if (!('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'granted') {
      const modeToShow = completedMode || this.timeData.mode;
      
      const title = modeToShow === 'pomodoro' 
        ? I18n.t('pomodoroCompleted')
        : I18n.t('breakCompleted');
      
      const body = modeToShow === 'pomodoro'
        ? I18n.t('workSessionCompleted').replace('{duration}', SettingsManager.getPomodoroDuration().toString())
        : I18n.t('breakFinished');
      
      try {
        const notification = new Notification(title, { 
          body,
          icon: '/favicon.svg',
          badge: '/favicon.svg',
          requireInteraction: false,
          silent: false,
          tag: 'pomodoro-timer'
        });
        
        // Auto-close notification after 10 seconds
        setTimeout(() => {
          notification.close();
        }, 10000);
      } catch (error) {
        // Silently fail
      }
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setTimeout(() => {
            this.showNotification(completedMode);
          }, 100);
        }
      }).catch(() => {
        // Silently fail
      });
    }
  }

  static requestNotificationPermission(): void {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Pomodoro Timer', {
            body: I18n.t('notificationsEnabled'),
            icon: '/favicon.svg'
          });
        }
      }).catch(() => {
        // Silently fail
      });
    }
  }

  static updateSettings(): void {
    this.timeData.pomodoro = SettingsManager.getPomodoroDuration();
    this.timeData.shortBreak = SettingsManager.getShortBreakDuration();
    this.timeData.longBreak = SettingsManager.getLongBreakDuration();
    this.saveState();
  }

  private static saveState(): void {
    Storage.set('timerState', {
      mode: this.timeData.mode,
      cycle: this.timeData.cycle,
      pomodoro: this.timeData.pomodoro,
      shortBreak: this.timeData.shortBreak,
      longBreak: this.timeData.longBreak
    });
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static getCurrentSession(): PomodoroSession | null {
    return this.currentSession;
  }

  static isRunning(): boolean {
    return this.timeData.status;
  }

  static getCycle(): number {
    return this.timeData.cycle;
  }

  static getMode(): string {
    return this.timeData.mode;
  }
}
