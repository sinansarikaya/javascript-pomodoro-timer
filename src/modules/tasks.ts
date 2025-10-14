import { Storage } from '../utils/storage';
import { SettingsManager } from './settings';
import { Toast } from '../utils/toast';
import { I18n } from '../utils/i18n';
import type { Task } from '../types';

export class TaskManager {
  private static tasks: Task[] = [];
  private static activeTaskId: string | null = null;

  static init(): void {
    this.tasks = Storage.get('tasks', []);
    this.activeTaskId = Storage.get('activeTaskId', null);
  }

  static addTask(title: string, description?: string, estimatedPomodoros: number = 1): Task {
    const task: Task = {
      id: this.generateId(),
      title,
      description,
      completed: false,
      pomodorosUsed: 0,
      estimatedPomodoros,
      createdAt: new Date()
    };

    this.tasks.push(task);
    this.save();
    return task;
  }

  static getTasks(): Task[] {
    return this.tasks;
  }

  static getActiveTasks(): Task[] {
    return this.tasks.filter(task => !task.completed);
  }

  static getCompletedTasks(): Task[] {
    return this.tasks.filter(task => task.completed);
  }

  static getTask(id: string): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  static updateTask(id: string, updates: Partial<Task>): boolean {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return false;

    this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };
    this.save();
    return true;
  }

  static editTask(id: string, title: string, estimatedPomodoros: number, notes?: string, goalId?: string): boolean {
    const task = this.getTask(id);
    if (!task) return false;

    return this.updateTask(id, {
      title: title.trim(),
      estimatedPomodoros,
      notes: notes?.trim() || '',
      goalId: goalId || undefined
    });
  }

  static completeTask(id: string): boolean {
    const task = this.getTask(id);
    if (!task) return false;

    const result = this.updateTask(id, {
      completed: true,
      completedAt: new Date()
    });

    if (result) {
      Toast.success(`${I18n.t('taskCompleted')} ${task.title}`);
    }

    return result;
  }

  static deleteTask(id: string): boolean {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return false;

    const taskToDelete = this.tasks[taskIndex];
    
    // Move to archive instead of permanent deletion
    const archivedTasks = this.getArchivedTasks();
    const archivedTask = {
      ...taskToDelete,
      archivedAt: new Date().toISOString(),
      deletedAt: new Date().toISOString()
    };
    archivedTasks.push(archivedTask);
    Storage.set('archived_tasks', archivedTasks);

    // Remove from active tasks
    this.tasks.splice(taskIndex, 1);
    this.save();
    return true;
  }

  static getArchivedTasks(): Task[] {
    return Storage.get('archived_tasks', []);
  }

  static restoreTask(taskId: string): boolean {
    const archivedTasks = this.getArchivedTasks();
    const taskIndex = archivedTasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) return false;
    
    const taskToRestore = archivedTasks[taskIndex];
    // Remove archived properties
    const { ...restoredTask } = taskToRestore;
    
    // Add back to active tasks
    this.tasks.push(restoredTask);
    this.save();
    
    // Remove from archived tasks
    archivedTasks.splice(taskIndex, 1);
    Storage.set('archived_tasks', archivedTasks);
    
    return true;
  }

  static permanentlyDeleteTask(taskId: string): boolean {
    const archivedTasks = this.getArchivedTasks();
    const taskIndex = archivedTasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) return false;
    
    archivedTasks.splice(taskIndex, 1);
    Storage.set('archived_tasks', archivedTasks);
    
    return true;
  }

  static addPomodoroToTask(id: string): boolean {
    const task = this.getTask(id);
    if (!task) return false;

    // Add to pomodoro history
    const history = task.pomodoroHistory || [];
    history.push({
      completedAt: new Date(),
      duration: SettingsManager.getPomodoroDuration()
    });

    return this.updateTask(id, {
      pomodorosUsed: task.pomodorosUsed + 1,
      pomodoroHistory: history
    });
  }

  static setActiveTask(id: string | null): void {
    this.activeTaskId = id;
    Storage.set('activeTaskId', id);
  }

  static getActiveTask(): Task | null {
    if (!this.activeTaskId) return null;
    return this.getTask(this.activeTaskId) || null;
  }

  static getActiveTaskId(): string | null {
    return this.activeTaskId;
  }

  static addPomodoroToActiveTask(): boolean {
    if (!this.activeTaskId) return false;
    return this.addPomodoroToTask(this.activeTaskId);
  }

  static uncompleteTask(id: string): boolean {
    return this.updateTask(id, {
      completed: false,
      completedAt: undefined
    });
  }

  static getTasksByProgress(): { completed: number; total: number } {
    const total = this.tasks.length;
    const completed = this.tasks.filter(task => task.completed).length;
    return { completed, total };
  }

  static getTotalEstimatedPomodoros(): number {
    return this.getActiveTasks().reduce((total, task) => total + task.estimatedPomodoros, 0);
  }

  static getTotalUsedPomodoros(): number {
    return this.tasks.reduce((total, task) => total + task.pomodorosUsed, 0);
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private static save(): void {
    Storage.set('tasks', this.tasks);
  }

  static clearData(): void {
    this.tasks = [];
    this.activeTaskId = null;
    this.save();
    Storage.set('activeTaskId', null);
  }
}
