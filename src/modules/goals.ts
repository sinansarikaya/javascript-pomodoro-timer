import { Storage } from '../utils/storage';
import { DateUtils } from '../utils/date';
import { Toast } from '../utils/toast';
import { I18n } from '../utils/i18n';
import type { Goal } from '../types';

export class GoalManager {
  private static goals: Goal[] = [];
  private static activeGoalId: string | null = null;

  static init(): void {
    this.goals = Storage.get('goals', []);
    this.activeGoalId = Storage.get('activeGoalId', null);
  }

  static createGoal(title: string, target: number, period: 'daily' | 'weekly' | 'monthly'): Goal {
    const goal: Goal = {
      id: this.generateId(),
      title,
      target,
      current: 0,
      period,
      createdAt: new Date()
    };

    this.goals.push(goal);
    this.save();
    return goal;
  }

  static getGoals(): Goal[] {
    return this.goals;
  }

  static getActiveGoals(): Goal[] {
    return this.goals.filter(goal => !goal.achievedAt);
  }

  static getCompletedGoals(): Goal[] {
    return this.goals.filter(goal => goal.achievedAt);
  }

  static getGoal(id: string): Goal | undefined {
    return this.goals.find(goal => goal.id === id);
  }

  static updateGoal(id: string, updates: Partial<Goal>): boolean {
    const goalIndex = this.goals.findIndex(goal => goal.id === id);
    if (goalIndex === -1) return false;

    this.goals[goalIndex] = { ...this.goals[goalIndex], ...updates };
    this.save();
    return true;
  }

  static setActiveGoal(id: string | null): void {
    this.activeGoalId = id;
    Storage.set('activeGoalId', id);
  }

  static getActiveGoal(): Goal | null {
    if (!this.activeGoalId) return null;
    return this.getGoal(this.activeGoalId) || null;
  }

  static getActiveGoalId(): string | null {
    return this.activeGoalId;
  }

  static deleteGoal(id: string): boolean {
    const goalIndex = this.goals.findIndex(goal => goal.id === id);
    if (goalIndex === -1) return false;

    this.goals.splice(goalIndex, 1);
    this.save();
    return true;
  }

  static updateProgress(goalId: string, progress: number): boolean {
    const goal = this.getGoal(goalId);
    if (!goal) return false;

    const newCurrent = Math.min(goal.current + progress, goal.target);
    const isCompleted = newCurrent >= goal.target && !goal.achievedAt;

    return this.updateGoal(goalId, {
      current: newCurrent,
      achievedAt: isCompleted ? new Date() : goal.achievedAt
    });
  }

  static getTodayGoal(): Goal | null {
    const today = new Date();
    return this.goals.find(goal => 
      goal.period === 'daily' && 
      DateUtils.isToday(goal.createdAt) &&
      !goal.achievedAt
    ) || null;
  }

  static getWeekGoal(): Goal | null {
    const today = new Date();
    return this.goals.find(goal => 
      goal.period === 'weekly' && 
      DateUtils.isThisWeek(goal.createdAt) &&
      !goal.achievedAt
    ) || null;
  }

  static getProgressPercentage(goalId: string): number {
    const goal = this.getGoal(goalId);
    if (!goal) return 0;
    return Math.round((goal.current / goal.target) * 100);
  }

  static getOverallProgress(): { completed: number; total: number; percentage: number } {
    const total = this.goals.length;
    const completed = this.goals.filter(goal => goal.achievedAt).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  }

  static resetDailyGoals(): void {
    const today = new Date();
    this.goals.forEach(goal => {
      if (goal.period === 'daily' && !DateUtils.isToday(goal.createdAt)) {
        this.updateGoal(goal.id, {
          current: 0,
          achievedAt: undefined
        });
      }
    });
  }

  static resetWeeklyGoals(): void {
    const today = new Date();
    this.goals.forEach(goal => {
      if (goal.period === 'weekly' && !DateUtils.isThisWeek(goal.createdAt)) {
        this.updateGoal(goal.id, {
          current: 0,
          achievedAt: undefined
        });
      }
    });
  }

  static completePomodoro(): void {
    const today = new Date();
    
    // Update daily goals
    this.goals.forEach(goal => {
      if (goal.period === 'daily' && 
          DateUtils.isToday(goal.createdAt) && 
          !goal.achievedAt) {
        const newCurrent = goal.current + 1;
        this.updateGoal(goal.id, { current: newCurrent });
        
        // Check if goal is achieved
        if (newCurrent >= goal.target) {
          this.updateGoal(goal.id, { 
            achievedAt: today,
            current: goal.target 
          });
          Toast.success(`${I18n.t('goalCompleted')} ${goal.title}`);
        }
      }
    });

    // Update weekly goals
    this.goals.forEach(goal => {
      if (goal.period === 'weekly' && 
          DateUtils.isThisWeek(goal.createdAt) && 
          !goal.achievedAt) {
        const newCurrent = goal.current + 1;
        this.updateGoal(goal.id, { current: newCurrent });
        
        // Check if goal is achieved
        if (newCurrent >= goal.target) {
          this.updateGoal(goal.id, { 
            achievedAt: today,
            current: goal.target 
          });
          Toast.success(`${I18n.t('goalCompleted')} ${goal.title}`);
        }
      }
    });

    this.save();
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private static save(): void {
    Storage.set('goals', this.goals);
  }

  static clearData(): void {
    this.goals = [];
    this.save();
  }
}
