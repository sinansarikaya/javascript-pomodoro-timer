// Internationalization utility
export interface Translations {
  // Common
  pomodoro: string;
  shortBreak: string;
  longBreak: string;
  start: string;
  pause: string;
  stop: string;
  reset: string;
  
  // Navigation
  statistics: string;
  tasks: string;
  goals: string;
  settings: string;
  help: string;
  
  // Timer
  youAreInPomodoroTime: string;
  youAreInShortBreak: string;
  youAreInLongBreak: string;
  cycle: string;
  today: string;
  pomodoros: string;
  
  // Statistics
  totalPomodoros: string;
  totalTime: string;
  streak: string;
  thisWeek: string;
  weeklyActivity: string;
  taskProgress: string;
  days: string;
  
  // Tasks
  addNewTask: string;
  newTask: string;
  estimatedPomodoros: string;
  usedPomodoros: string;
  completed: string;
  active: string;
  noTasksYet: string;
  noCompletedTasks: string;
  taskCompleted: string;
  complete: string;
  delete: string;
  undo: string;
  confirmDeleteTask: string;
  confirmDeleteGoal: string;
  activeTask: string;
  high: string;
  medium: string;
  low: string;
  work: string;
  personal: string;
  learning: string;
  health: string;
  other: string;
  all: string;
  searchTasks: string;
  noGoal: string;
  notes: string;
  hasNotes: string;
  addNote: string;
  saveNote: string;
  cancel: string;
  history: string;
  pomodoroHistory: string;
  noHistory: string;
  completedOn: string;
  completeAll: string;
  deleteCompleted: string;
  recurringTask: string;
  moveUp: string;
  moveDown: string;
  
  // Goals
  addNewGoal: string;
  goalName: string;
  targetNumber: string;
  progress: string;
  noGoalsYet: string;
  goalAchieved: string;
  activeGoal: string;
  
  // Settings
  timeSettings: string;
  pomodoroDuration: string;
  shortBreakDuration: string;
  longBreakDuration: string;
  longBreakInterval: string;
  theme: string;
  soundAndNotifications: string;
  soundEffects: string;
  notifications: string;
  soundLevel: string;
  autoStartBreaks: string;
  autoStartPomodoros: string;
  language: string;
  selectLanguage: string;
  minutes: string;
  testSound: string;
  resetSettings: string;
  resetToDefaults: string;
  
  // Notifications
  pomodoroCompleted: string;
  breakCompleted: string;
  workSessionCompleted: string;
  breakFinished: string;
  notificationsEnabled: string;
  
  // Themes
  default: string;
  darkMode: string;
  lightMode: string;
  ocean: string;
  forest: string;
  sunset: string;
  
  // Info Modal
  whatIsPomodoroTechnique: string;
  step1: string;
  step1Desc: string;
  step2: string;
  step2Desc: string;
  step3: string;
  step3Desc: string;
  step4: string;
  step4Desc: string;
  step5: string;
  step5Desc: string;
  features: string;
  featuresDesc: string;
  tips: string;
  tipsDesc: string;
  keyboardShortcuts: string;
  shortcutsDesc: string;
  
  // Footer
  madeWith: string;
  by: string;
  
  // Toast Messages
  settingsUpdated: string;
  pomodoroDurationError: string;
  shortBreakDurationError: string;
  longBreakDurationError: string;
  taskTitleRequired: string;
  pomodoroCountError: string;
  goalTitleRequired: string;
  goalTargetError: string;
  goalAddedSuccessfully: string;
  add: string;
  resetSettingsConfirm: string;
  reloadPageConfirm: string;
  goalCompleted: string;
  taskCompleted: string;
  nextTaskQuestion: string;
}

export const translations: Record<string, Translations> = {
  tr: {
    // Common
    pomodoro: 'Pomodoro',
    shortBreak: 'Kısa Mola',
    longBreak: 'Uzun Mola',
    start: 'Başlat',
    pause: 'Duraklat',
    stop: 'Durdur',
    reset: 'Sıfırla',
    
    // Navigation
    statistics: 'İstatistikler',
    tasks: 'Görevler',
    goals: 'Hedefler',
    settings: 'Ayarlar',
    help: 'Yardım',
    
    // Timer
    youAreInPomodoroTime: 'Pomodoro zamanındasınız',
    youAreInShortBreak: 'Kısa moladasınız',
    youAreInLongBreak: 'Uzun moladasınız',
    cycle: 'Döngü',
    today: 'Bugün',
    pomodoros: 'pomodoro',
    
    // Statistics
    totalPomodoros: 'Toplam Pomodoro',
    totalTime: 'Toplam Süre',
    streak: 'Seri',
    thisWeek: 'Bu Hafta',
    weeklyActivity: 'Haftalık Aktivite',
    taskProgress: 'Görev İlerlemesi',
    days: 'gün',
    
    // Tasks
    addNewTask: 'Yeni görev ekle...',
    newTask: 'Yeni Görev',
    estimatedPomodoros: 'Tahmini Pomodoro',
    usedPomodoros: 'Kullanılan Pomodoro',
    completed: 'Tamamlandı',
    active: 'Aktif',
    noTasksYet: 'Henüz görev yok. Yukarıdan ekleyin!',
    noCompletedTasks: 'Tamamlanan görev yok',
    taskCompleted: 'Tamamlandı!',
    complete: 'Tamamla',
    delete: 'Sil',
    undo: 'Geri Al',
    confirmDeleteTask: 'Bu görevi silmek istediğinizden emin misiniz?',
    confirmDeleteGoal: 'Bu hedefi silmek istediğinizden emin misiniz?',
    activeTask: 'Aktif Görev',
    high: 'Yüksek',
    medium: 'Orta',
    low: 'Düşük',
    work: 'İş',
    personal: 'Kişisel',
    learning: 'Öğrenme',
    health: 'Sağlık',
    other: 'Diğer',
    all: 'Tümü',
    searchTasks: 'Görevlerde ara...',
    noGoal: 'Hedef Yok',
    notes: 'Notlar',
    hasNotes: 'Not var',
    addNote: 'Not ekle',
    saveNote: 'Notu Kaydet',
    cancel: 'İptal',
    history: 'Geçmiş',
    pomodoroHistory: 'Pomodoro Geçmişi',
    noHistory: 'Henüz pomodoro tamamlanmamış',
    completedOn: 'Tamamlanma:',
    completeAll: 'Tümünü Tamamla',
    deleteCompleted: 'Tamamlananları Sil',
    recurringTask: 'Tekrarlayan görev',
    moveUp: 'Yukarı taşı',
    moveDown: 'Aşağı taşı',
    
    // Goals
    addNewGoal: 'Yeni hedef ekle...',
    goalName: 'Hedef adı...',
    targetNumber: 'Hedef sayısı',
    progress: 'İlerleme',
    noGoalsYet: 'Henüz hedef yok. Yukarıdan ekleyin!',
    goalAchieved: 'Hedef Ulaşıldı!',
    activeGoal: 'Aktif Hedef',
    
    // Settings
    timeSettings: 'Zaman Ayarları',
    pomodoroDuration: 'Pomodoro Süresi (dakika)',
    shortBreakDuration: 'Kısa Mola (dakika)',
    longBreakDuration: 'Uzun Mola (dakika)',
    longBreakInterval: 'Uzun Mola Aralığı',
    theme: 'Tema',
    soundAndNotifications: 'Ses ve Bildirimler',
    soundEffects: 'Ses efektleri',
    notifications: 'Bildirimler',
    soundLevel: 'Ses Seviyesi',
    autoStartBreaks: 'Molaları otomatik başlat',
    autoStartPomodoros: 'Pomodoroları otomatik başlat',
    language: 'Dil',
    selectLanguage: 'Dil Seçin',
    minutes: 'dk',
    testSound: 'Ses Testi',
    resetSettings: 'Ayarları Sıfırla',
    resetToDefaults: 'Varsayılan Ayarlara Dön',
    
    // Notifications
    pomodoroCompleted: 'Pomodoro Tamamlandı!',
    breakCompleted: 'Mola Tamamlandı!',
    workSessionCompleted: '{duration} dakikalık çalışma tamamlandı. Mola zamanı!',
    breakFinished: 'Mola bitti. Yeni pomodoro başlayabilirsiniz.',
    notificationsEnabled: 'Bildirimler başarıyla etkinleştirildi!',
    
    // Themes
    default: 'Varsayılan',
    darkMode: 'Karanlık Mod',
    lightMode: 'Aydınlık Mod',
    ocean: 'Okyanus',
    forest: 'Orman',
    sunset: 'Gün Batımı',
    
    // Info Modal
    whatIsPomodoroTechnique: 'Pomodoro Tekniği Nedir?',
    step1: 'ADIM 1:',
    step1Desc: 'Bir görev seçin',
    step2: 'ADIM 2:',
    step2Desc: '25 dakikalık bir zamanlayıcı kurun',
    step3: 'ADIM 3:',
    step3Desc: 'Zamanlayıcı bitene kadar görevinizde tam konsantrasyonla çalışın',
    step4: 'ADIM 4:',
    step4Desc: '5 dakika mola verin',
    step5: 'ADIM 5:',
    step5Desc: 'Her 4 pomodorodan sonra 15-20 dakika uzun mola verin',
    features: 'Özellikler',
    featuresDesc: '• Görev yönetimi ve takibi\n• Hedef belirleme ve ilerleme\n• Detaylı istatistikler\n• Tema seçenekleri\n• Ses ve bildirim ayarları\n• Yedekleme ve geri yükleme',
    tips: 'İpuçları',
    tipsDesc: '• Dikkat dağıtıcıları uzaklaştırın\n• Mola sırasında ekrandan uzak durun\n• Görevleri küçük parçalara bölün\n• Düzenli molalar verin\n• İlerlemenizi takip edin',
    keyboardShortcuts: 'Klavye Kısayolları',
    shortcutsDesc: '• Space: Başlat/Duraklat\n• R: Sıfırla\n• 1: Pomodoro modu\n• 2: Kısa mola\n• 3: Uzun mola',
    
    // Footer
    madeWith: 'Made with',
    by: 'by',
    
    // Toast Messages
    settingsUpdated: 'Ayarlar güncellendi',
    pomodoroDurationError: 'Pomodoro süresi 1-60 dakika arasında olmalıdır',
    shortBreakDurationError: 'Kısa mola süresi 1-30 dakika arasında olmalıdır',
    longBreakDurationError: 'Uzun mola süresi 1-60 dakika arasında olmalıdır',
    taskTitleRequired: 'Lütfen bir görev başlığı girin',
    pomodoroCountError: 'Pomodoro sayısı 1-20 arasında olmalıdır',
    goalTitleRequired: 'Lütfen bir hedef başlığı girin',
    goalTargetError: 'Hedef pomodoro sayısı 1-50 arasında olmalıdır',
    goalAddedSuccessfully: 'Hedef başarıyla eklendi!',
    add: 'Ekle',
    resetSettingsConfirm: 'Tüm ayarları varsayılan değerlere sıfırlamak istediğinizden emin misiniz?',
    reloadPageConfirm: 'Sayfayı yenilemek ister misiniz?',
    goalCompleted: '🎯 Hedef tamamlandı!',
    taskCompleted: '✅ Görev tamamlandı!',
    nextTaskQuestion: 'Bir sonraki göreve geçmek ister misiniz?'
  },
  en: {
    // Common
    pomodoro: 'Pomodoro',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
    start: 'Start',
    pause: 'Pause',
    stop: 'Stop',
    reset: 'Reset',
    
    // Navigation
    statistics: 'Statistics',
    tasks: 'Tasks',
    goals: 'Goals',
    settings: 'Settings',
    help: 'Help',
    
    // Timer
    youAreInPomodoroTime: 'You are in pomodoro time',
    youAreInShortBreak: 'You are in short break',
    youAreInLongBreak: 'You are in long break',
    cycle: 'Cycle',
    today: 'Today',
    pomodoros: 'pomodoros',
    
    // Statistics
    totalPomodoros: 'Total Pomodoros',
    totalTime: 'Total Time',
    streak: 'Streak',
    thisWeek: 'This Week',
    weeklyActivity: 'Weekly Activity',
    taskProgress: 'Task Progress',
    days: 'days',
    
    // Tasks
    addNewTask: 'Add new task...',
    newTask: 'New Task',
    estimatedPomodoros: 'Estimated Pomodoros',
    usedPomodoros: 'Used Pomodoros',
    completed: 'Completed',
    active: 'Active',
    noTasksYet: 'No tasks yet. Add one above!',
    noCompletedTasks: 'No completed tasks',
    taskCompleted: 'Completed!',
    complete: 'Complete',
    delete: 'Delete',
    undo: 'Undo',
    confirmDeleteTask: 'Are you sure you want to delete this task?',
    confirmDeleteGoal: 'Are you sure you want to delete this goal?',
    activeTask: 'Active Task',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    work: 'Work',
    personal: 'Personal',
    learning: 'Learning',
    health: 'Health',
    other: 'Other',
    all: 'All',
    searchTasks: 'Search tasks...',
    noGoal: 'No Goal',
    notes: 'Notes',
    hasNotes: 'Has notes',
    addNote: 'Add note',
    saveNote: 'Save Note',
    cancel: 'Cancel',
    history: 'History',
    pomodoroHistory: 'Pomodoro History',
    noHistory: 'No pomodoros completed yet',
    completedOn: 'Completed on:',
    completeAll: 'Complete All',
    deleteCompleted: 'Delete Completed',
    recurringTask: 'Recurring task',
    moveUp: 'Move up',
    moveDown: 'Move down',
    
    // Goals
    addNewGoal: 'Add new goal...',
    goalName: 'Goal name...',
    targetNumber: 'Target number',
    progress: 'Progress',
    noGoalsYet: 'No goals yet. Add one above!',
    goalAchieved: 'Goal Achieved!',
    activeGoal: 'Active Goal',
    
    // Settings
    timeSettings: 'Time Settings',
    pomodoroDuration: 'Pomodoro Duration (minutes)',
    shortBreakDuration: 'Short Break (minutes)',
    longBreakDuration: 'Long Break (minutes)',
    longBreakInterval: 'Long Break Interval',
    theme: 'Theme',
    soundAndNotifications: 'Sound and Notifications',
    soundEffects: 'Sound effects',
    notifications: 'Notifications',
    soundLevel: 'Sound Level',
    autoStartBreaks: 'Auto start breaks',
    autoStartPomodoros: 'Auto start pomodoros',
    language: 'Language',
    selectLanguage: 'Select Language',
    minutes: 'min',
    testSound: 'Test Sound',
    resetSettings: 'Reset Settings',
    resetToDefaults: 'Reset to Defaults',
    
    // Notifications
    pomodoroCompleted: 'Pomodoro Completed!',
    breakCompleted: 'Break Completed!',
    workSessionCompleted: '{duration} minute work session completed. Time for a break!',
    breakFinished: 'Break finished. You can start a new pomodoro.',
    notificationsEnabled: 'Notifications successfully enabled!',
    
    // Themes
    default: 'Default',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    ocean: 'Ocean',
    forest: 'Forest',
    sunset: 'Sunset',
    
    // Info Modal
    whatIsPomodoroTechnique: 'What is Pomodoro Technique?',
    step1: 'STEP 1:',
    step1Desc: 'Pick a task',
    step2: 'STEP 2:',
    step2Desc: 'Set a 25-minute timer',
    step3: 'STEP 3:',
    step3Desc: 'Work on your task with full concentration until the timer is up',
    step4: 'STEP 4:',
    step4Desc: 'Take a 5 minute break',
    step5: 'STEP 5:',
    step5Desc: 'Every 4 pomodoros, take a longer 15-20 minute break',
    features: 'Features',
    featuresDesc: '• Task management and tracking\n• Goal setting and progress\n• Detailed statistics\n• Theme options\n• Sound and notification settings\n• Backup and restore',
    tips: 'Tips',
    tipsDesc: '• Remove distractions\n• Stay away from screens during breaks\n• Break tasks into small parts\n• Take regular breaks\n• Track your progress',
    keyboardShortcuts: 'Keyboard Shortcuts',
    shortcutsDesc: '• Space: Start/Pause\n• R: Reset\n• 1: Pomodoro mode\n• 2: Short break\n• 3: Long break',
    
    // Footer
    madeWith: 'Made with',
    by: 'by',
    
    // Toast Messages
    settingsUpdated: 'Settings updated',
    pomodoroDurationError: 'Pomodoro duration must be between 1-60 minutes',
    shortBreakDurationError: 'Short break duration must be between 1-30 minutes',
    longBreakDurationError: 'Long break duration must be between 1-60 minutes',
    taskTitleRequired: 'Please enter a task title',
    pomodoroCountError: 'Pomodoro count must be between 1-20',
    goalTitleRequired: 'Please enter a goal title',
    goalTargetError: 'Goal pomodoro count must be between 1-50',
    goalAddedSuccessfully: 'Goal added successfully!',
    add: 'Add',
    resetSettingsConfirm: 'Are you sure you want to reset all settings to default values?',
    reloadPageConfirm: 'Would you like to reload the page?',
    goalCompleted: '🎯 Goal completed!',
    taskCompleted: '✅ Task completed!',
    nextTaskQuestion: 'Would you like to move to the next task?'
  }
};

export class I18n {
  private static currentLanguage: string = 'en';

  static init(): void {
    const savedLanguage = localStorage.getItem('pomodoro_language');
    if (savedLanguage) {
      this.currentLanguage = savedLanguage;
    } else {
      // Auto-detect language from browser
      this.currentLanguage = this.detectLanguage();
    }
  }

  private static detectLanguage(): string {
    // Check browser language
    const browserLang = navigator.language || (navigator as any).userLanguage;
    const langCode = browserLang.split('-')[0].toLowerCase();
    
    // Check if Turkish
    if (langCode === 'tr') {
      return 'tr';
    }
    
    // Default to English
    return 'en';
  }

  static setLanguage(language: string): void {
    this.currentLanguage = language;
    localStorage.setItem('pomodoro_language', language);
    this.updateUI();
  }

  static getLanguage(): string {
    return this.currentLanguage;
  }

  static getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  static t(key: keyof Translations): string {
    return translations[this.currentLanguage]?.[key] || key;
  }

  static updateUI(): void {
    // Update all text elements
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n') as keyof Translations;
      if (key) {
        element.textContent = this.t(key);
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder') as keyof Translations;
      if (key && element instanceof HTMLInputElement) {
        element.placeholder = this.t(key);
      }
    });

    // Update titles
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title') as keyof Translations;
      if (key) {
        element.setAttribute('title', this.t(key));
      }
    });
  }
}
