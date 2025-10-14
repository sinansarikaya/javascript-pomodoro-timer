import { Storage } from '../utils/storage';
import { DateUtils } from '../utils/date';
import type { PomodoroSession, DailyStats, WeeklyStats } from '../types';

export class StatisticsManager {
  private static sessions: PomodoroSession[] = [];
  private static dailyStats: DailyStats[] = [];

  static init(): void {
    // Try to load from new format first, fallback to old format
    const statistics = Storage.get('statistics', {}) as any;
    if (statistics.sessions && statistics.dailyStats) {
      this.sessions = statistics.sessions;
      this.dailyStats = statistics.dailyStats;
    } else {
      // Fallback to old format for backward compatibility
      this.sessions = Storage.get('sessions', []);
      this.dailyStats = Storage.get('dailyStats', []);
    }
  }

  static addSession(session: PomodoroSession): void {
    this.sessions.push(session);
    this.updateDailyStats(session);
    this.save();
  }

  static getSessions(): PomodoroSession[] {
    return this.sessions;
  }

  static getTodaySessions(): PomodoroSession[] {
    return this.sessions.filter(session => 
      DateUtils.isToday(new Date(session.startTime))
    );
  }

  static getWeekSessions(): PomodoroSession[] {
    return this.sessions.filter(session => 
      DateUtils.isThisWeek(new Date(session.startTime))
    );
  }

  static getDailyStats(): DailyStats[] {
    return this.dailyStats;
  }

  static getTodayStats(): DailyStats | null {
    const today = DateUtils.formatDate(new Date());
    return this.dailyStats.find(stat => stat.date === today) || null;
  }

  static getWeeklyStats(): WeeklyStats[] {
    const weeklyMap = new Map<string, WeeklyStats>();

    this.dailyStats.forEach(daily => {
      const date = new Date(daily.date);
      const weekString = DateUtils.getWeekString(date);
      
      if (!weeklyMap.has(weekString)) {
        weeklyMap.set(weekString, {
          week: weekString,
          pomodorosCompleted: 0,
          totalTime: 0,
          tasksCompleted: 0,
          averagePerDay: 0
        });
      }

      const weekly = weeklyMap.get(weekString)!;
      weekly.pomodorosCompleted += daily.pomodorosCompleted;
      weekly.totalTime += daily.totalTime;
      weekly.tasksCompleted += daily.tasksCompleted;
    });

    // Calculate averages
    weeklyMap.forEach(weekly => {
      const daysInWeek = 7;
      weekly.averagePerDay = Math.round(weekly.pomodorosCompleted / daysInWeek * 10) / 10;
    });

    return Array.from(weeklyMap.values()).sort((a, b) => 
      new Date(a.week.split(' - ')[0]).getTime() - new Date(b.week.split(' - ')[0]).getTime()
    );
  }

  static getTotalPomodoros(): number {
    return this.sessions.filter(s => s.mode === 'pomodoro' && s.completed).length;
  }

  static getTotalTime(): number {
    return this.sessions
      .filter(s => s.completed)
      .reduce((total, session) => total + session.duration, 0);
  }

  static getStreak(): number {
    const sortedStats = this.dailyStats
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let streak = 0;
    let currentDate = new Date();
    
    for (const stat of sortedStats) {
      const statDate = new Date(stat.date);
      const daysDiff = Math.floor((currentDate.getTime() - statDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak && stat.pomodorosCompleted > 0) {
        streak++;
      } else if (daysDiff > streak + 1) {
        break;
      }
    }
    
    return streak;
  }

  private static updateDailyStats(session: PomodoroSession): void {
    const date = DateUtils.formatDate(new Date(session.startTime));
    let dailyStat = this.dailyStats.find(stat => stat.date === date);
    
    if (!dailyStat) {
      dailyStat = {
        date,
        pomodorosCompleted: 0,
        totalTime: 0,
        tasksCompleted: 0,
        goal: 8 // Default goal
      };
      this.dailyStats.push(dailyStat);
    }

    if (session.completed) {
      if (session.mode === 'pomodoro') {
        dailyStat.pomodorosCompleted++;
      }
      dailyStat.totalTime += session.duration;
    }
  }

  private static save(): void {
    // Save in new format
    Storage.set('statistics', {
      sessions: this.sessions,
      dailyStats: this.dailyStats
    });
    
    // Also save in old format for backward compatibility
    Storage.set('sessions', this.sessions);
    Storage.set('dailyStats', this.dailyStats);
  }

  static clearData(): void {
    this.sessions = [];
    this.dailyStats = [];
    this.save();
  }
}
