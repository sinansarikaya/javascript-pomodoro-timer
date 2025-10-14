// Core Types
export interface TimeData {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  cycle: number;
  mode: 'pomodoro' | 'short' | 'long';
  status: boolean;
}

export interface PomodoroSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  mode: 'pomodoro' | 'short' | 'long';
  completed: boolean;
  taskId?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  pomodorosUsed: number;
  estimatedPomodoros: number;
  createdAt: Date;
  completedAt?: Date;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  notes?: string;
  goalId?: string;
  recurring?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    lastCompleted?: Date;
  };
  pomodoroHistory?: Array<{
    completedAt: Date;
    duration: number;
  }>;
}

export interface DailyStats {
  date: string;
  pomodorosCompleted: number;
  totalTime: number; // in minutes
  tasksCompleted: number;
  goal: number;
}

export interface WeeklyStats {
  week: string;
  pomodorosCompleted: number;
  totalTime: number;
  tasksCompleted: number;
  averagePerDay: number;
}

export interface Goal {
  id: string;
  title: string;
  target: number; // pomodoros per day
  current: number;
  period: 'daily' | 'weekly' | 'monthly';
  createdAt: Date;
  achievedAt?: Date;
  linkedTaskIds?: string[]; // Tasks linked to this goal
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
}

export interface Settings {
  pomodoroDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  theme: string;
  language: string;
}

export interface NotificationSettings {
  workSound: string;
  breakSound: string;
  volume: number;
  desktopNotifications: boolean;
}
