import { Storage } from '../utils/storage';
import type { Theme } from '../types';

export class ThemeManager {
  private static themes: Theme[] = [
  {
    id: 'default',
    name: 'Indigo',
    colors: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      accent: '#6366f1',
      text: '#0f172a',
      textSecondary: '#64748b'
    }
  },
    {
      id: 'dark',
      name: '🌙 Midnight',
      colors: {
        primary: '#0d1117',
        secondary: '#161b22',
        accent: '#58a6ff',
        background: '#0d1117',
        surface: '#161b22',
        text: '#c9d1d9',
        textSecondary: '#8b949e'
      }
    },
    {
      id: 'light',
      name: '☀️ Daylight',
      colors: {
        primary: '#ffffff',
        secondary: '#f6f8fa',
        accent: '#0969da',
        background: '#ffffff',
        surface: '#f6f8fa',
        text: '#24292f',
        textSecondary: '#57606a'
      }
    },
    {
      id: 'ocean',
      name: '🌊 Ocean',
      colors: {
        primary: '#0a4d68',
        secondary: '#088395',
        accent: '#05bfdb',
        background: '#0a4d68',
        surface: '#088395',
        text: '#ffffff',
        textSecondary: '#00ffca'
      }
    },
    {
      id: 'forest',
      name: '🌲 Forest',
      colors: {
        primary: '#1a4d2e',
        secondary: '#2d6a4f',
        accent: '#52b788',
        background: '#1a4d2e',
        surface: '#2d6a4f',
        text: '#ffffff',
        textSecondary: '#95d5b2'
      }
    },
    {
      id: 'sunset',
      name: '🌅 Sunset',
      colors: {
        primary: '#d62828',
        secondary: '#f77f00',
        accent: '#fcbf49',
        background: '#d62828',
        surface: '#f77f00',
        text: '#ffffff',
        textSecondary: '#fef9ef'
      }
    },
    {
      id: 'purple',
      name: '💜 Purple Dream',
      colors: {
        primary: '#5a189a',
        secondary: '#7209b7',
        accent: '#b5179e',
        background: '#5a189a',
        surface: '#7209b7',
        text: '#ffffff',
        textSecondary: '#e0aaff'
      }
    },
    {
      id: 'focus',
      name: '🎯 Focus Mode',
      colors: {
        primary: '#1e293b',
        secondary: '#334155',
        accent: '#3b82f6',
        background: '#1e293b',
        surface: '#334155',
        text: '#f1f5f9',
        textSecondary: '#cbd5e1'
      }
    },
    {
      id: 'warm',
      name: '☕ Warm Coffee',
      colors: {
        primary: '#3e2723',
        secondary: '#5d4037',
        accent: '#ff6f00',
        background: '#3e2723',
        surface: '#5d4037',
        text: '#fafafa',
        textSecondary: '#ffccbc'
      }
    },
    {
      id: 'mint',
      name: '🍃 Mint Fresh',
      colors: {
        primary: '#06a77d',
        secondary: '#00d9b1',
        accent: '#00f5d4',
        background: '#06a77d',
        surface: '#00d9b1',
        text: '#ffffff',
        textSecondary: '#b8f2e6'
      }
    }
  ];

  private static currentTheme: string = 'default';

  static init(): void {
    this.currentTheme = Storage.get('currentTheme', 'default');
    this.applyTheme(this.currentTheme);
  }

  static getThemes(): Theme[] {
    return this.themes;
  }

  static getCurrentTheme(): Theme {
    return this.themes.find(theme => theme.id === this.currentTheme) || this.themes[0];
  }

  static setTheme(themeId: string): boolean {
    const theme = this.themes.find(t => t.id === themeId);
    if (!theme) return false;

    this.currentTheme = themeId;
    this.applyTheme(themeId);
    Storage.set('currentTheme', themeId);
    return true;
  }

  static applyTheme(themeId: string): void {
    const theme = this.themes.find(t => t.id === themeId);
    if (!theme) return;

    const root = document.documentElement;
    root.style.setProperty('--primary-bg', theme.colors.primary);
    root.style.setProperty('--secondary-bg', theme.colors.secondary);
    root.style.setProperty('--accent-color', theme.colors.accent);
    root.style.setProperty('--text-color', theme.colors.text);
    root.style.setProperty('--text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--surface-color', theme.colors.surface);
    
    // Update background colors for different modes
    root.style.setProperty('--pomodoro-bg', theme.colors.primary);
    root.style.setProperty('--short-break-bg', theme.colors.secondary);
    root.style.setProperty('--long-break-bg', theme.colors.accent);
  }

  static createCustomTheme(name: string, colors: Theme['colors']): Theme {
    const theme: Theme = {
      id: this.generateId(),
      name,
      colors
    };

    this.themes.push(theme);
    Storage.set('customThemes', this.themes.filter(t => !this.isDefaultTheme(t.id)));
    return theme;
  }

  static deleteCustomTheme(themeId: string): boolean {
    if (this.isDefaultTheme(themeId)) return false;

    const index = this.themes.findIndex(t => t.id === themeId);
    if (index === -1) return false;

    this.themes.splice(index, 1);
    Storage.set('customThemes', this.themes.filter(t => !this.isDefaultTheme(t.id)));
    
    if (this.currentTheme === themeId) {
      this.setTheme('default');
    }
    
    return true;
  }

  private static isDefaultTheme(themeId: string): boolean {
    const defaultThemes = ['default', 'dark', 'light', 'ocean', 'forest', 'sunset', 'purple', 'mint'];
    return defaultThemes.includes(themeId);
  }

  private static generateId(): string {
    return 'custom_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static loadCustomThemes(): void {
    const customThemes = Storage.get('customThemes', []);
    this.themes = [...this.themes.filter(t => this.isDefaultTheme(t.id)), ...customThemes];
  }
}
