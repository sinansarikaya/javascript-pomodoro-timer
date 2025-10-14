export type ToastType = 'success' | 'error' | 'warning' | 'info';

export class Toast {
  private static container: HTMLElement | null = null;

  static init(): void {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  }

  static show(message: string, type: ToastType = 'info', duration: number = 3000): void {
    this.init();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = this.getIcon(type);
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-message">${message}</div>
      <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    this.container!.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add('toast-show'), 10);

    // Auto remove
    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  static success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  static error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  static warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  static info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  private static getIcon(type: ToastType): string {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
    }
  }
}
