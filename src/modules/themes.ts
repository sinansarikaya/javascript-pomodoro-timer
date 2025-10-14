import { Storage } from '../utils/storage';
import type { Theme } from '../types';

export class ThemeManager {
  private static themes: Theme[] = [
    {
      id: 'default',
      name: '🍅 Classic',
      colors: {
        primary: '#3d5a80',
        secondary: '#5089b0',
        accent: '#ee6c4d',
        background: '#293241',
        surface: '#3d5a80',
        text: '#e0fbfc',
        textSecondary: '#c8d5e0'
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
        primary: '#8b4049',
        secondary: '#9d5c63',
        accent: '#e8998d',
        background: '#7a3544',
        surface: '#9d5c63',
        text: '#fef3f0',
        textSecondary: '#f4d8d3'
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
    },
    {
      id: 'pink',
      name: '💗 Pink Blossom',
      colors: {
        primary: '#ffd6e8',
        secondary: '#ffe5f1',
        accent: '#ff6b9d',
        background: '#FFCDE1',
        surface: '#ffe5f1',
        text: '#4a1e3a',
        textSecondary: '#8b4f7d'
      }
    },
    {
      id: 'rose',
      name: '🌹 Rose Garden',
      colors: {
        primary: '#9e5770',
        secondary: '#b8738e',
        accent: '#dda5a5',
        background: '#8b4a5e',
        surface: '#a96782',
        text: '#fef5f7',
        textSecondary: '#f5dde2'
      }
    },
    {
      id: 'lavender',
      name: '💜 Lavender Dream',
      colors: {
        primary: '#9d84b7',
        secondary: '#c8b6e2',
        accent: '#f4a9d8',
        background: '#9d84b7',
        surface: '#c8b6e2',
        text: '#ffffff',
        textSecondary: '#f8f0ff'
      }
    },
    {
      id: 'neon',
      name: '⚡ Neon Night',
      colors: {
        primary: '#0f0e17',
        secondary: '#1a1a2e',
        accent: '#ff006e',
        background: '#0f0e17',
        surface: '#1a1a2e',
        text: '#fffffe',
        textSecondary: '#a7a9be'
      }
    },
    {
      id: 'nature',
      name: '🌿 Nature',
      colors: {
        primary: '#2d6a4f',
        secondary: '#40916c',
        accent: '#95d5b2',
        background: '#2d6a4f',
        surface: '#40916c',
        text: '#ffffff',
        textSecondary: '#d8f3dc'
      }
    },
    {
      id: 'cyberpunk',
      name: '🤖 Cyberpunk',
      colors: {
        primary: '#0a0e27',
        secondary: '#1a1f3a',
        accent: '#00fff5',
        background: '#0a0e27',
        surface: '#1a1f3a',
        text: '#ffffff',
        textSecondary: '#b8b8ff'
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
    const isDark = this.isColorDark(theme.colors.background);

    // Map theme colors to CSS variables (used by modern-styles.css)
    root.style.setProperty('--bg-primary', theme.colors.background);
    root.style.setProperty('--bg-secondary', theme.colors.surface);
    root.style.setProperty('--bg-tertiary', theme.colors.secondary);

    // Text colors - optimize based on background
    root.style.setProperty('--text-primary', theme.colors.text);
    root.style.setProperty('--text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--text-tertiary', theme.colors.textSecondary);

    // Primary color for buttons, links, etc.
    root.style.setProperty('--color-primary', theme.colors.accent);
    root.style.setProperty('--color-primary-hover', this.adjustBrightness(theme.colors.accent, -10));
    root.style.setProperty('--color-primary-light', this.adjustBrightness(theme.colors.accent, 40));
    root.style.setProperty('--color-secondary', theme.colors.primary);

    // Circle timer colors
    root.style.setProperty('--circle-stroke', theme.colors.accent);

    // Update border colors based on theme brightness
    root.style.setProperty('--color-border', isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)');
    root.style.setProperty('--color-border-light', isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)');

    // Input background color - lighter/darker based on theme
    const inputBg = isDark
      ? this.adjustBrightness(theme.colors.surface, 10)
      : this.adjustBrightness(theme.colors.surface, -5);
    root.style.setProperty('--color-input-bg', inputBg);

    // Update body background
    document.body.style.background = theme.colors.background;
  }

  private static isColorDark(color: string): boolean {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  }

  private static adjustBrightness(color: string, percent: number): string {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const adjust = (value: number) => {
      const adjusted = value + (value * percent / 100);
      return Math.max(0, Math.min(255, Math.round(adjusted)));
    };

    const newR = adjust(r).toString(16).padStart(2, '0');
    const newG = adjust(g).toString(16).padStart(2, '0');
    const newB = adjust(b).toString(16).padStart(2, '0');

    return `#${newR}${newG}${newB}`;
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
    const defaultThemes = ['default', 'dark', 'light', 'ocean', 'forest', 'sunset', 'purple', 'mint', 'pink', 'rose', 'lavender', 'neon', 'nature', 'cyberpunk', 'focus', 'warm'];
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
