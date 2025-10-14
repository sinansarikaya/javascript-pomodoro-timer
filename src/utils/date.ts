// Date utility functions
export class DateUtils {
  static formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0];
  }

  static formatTime(date: Date): string {
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  static getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
    return new Date(d.setDate(diff));
  }

  static getWeekEnd(date: Date): Date {
    const start = this.getWeekStart(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return end;
  }

  static getWeekString(date: Date): string {
    const start = this.getWeekStart(date);
    const end = this.getWeekEnd(date);
    return `${this.formatDate(start)} - ${this.formatDate(end)}`;
  }

  static isToday(date: Date | string): boolean {
    const today = new Date();
    return this.formatDate(date) === this.formatDate(today);
  }

  static isThisWeek(date: Date): boolean {
    const today = new Date();
    const weekStart = this.getWeekStart(today);
    const weekEnd = this.getWeekEnd(today);
    return date >= weekStart && date <= weekEnd;
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
