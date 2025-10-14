import './style.css'
import './modern-styles.css'

// Import modules
import { TimerManager } from './modules/timer';
import { StatisticsManager } from './modules/statistics';
import { TaskManager } from './modules/tasks';
import { GoalManager } from './modules/goals';
import { ThemeManager } from './modules/themes';
import { SettingsManager } from './modules/settings';
import { AudioManager } from './utils/audio';
import { I18n } from './utils/i18n';
import { BackupManager } from './utils/backup';
import { Toast } from './utils/toast';

// Initialize all modules
function initializeApp(): void {
  // Initialize toast notifications
  Toast.init();

  // Initialize modules
  I18n.init();
  StatisticsManager.init();
  TaskManager.init();
  GoalManager.init();
  ThemeManager.loadCustomThemes();
  ThemeManager.init();
  SettingsManager.init();
  AudioManager.init();
  TimerManager.init();

  // Create UI
  createUI();
  
  // Setup event listeners
  setupEventListeners();
  
  // Update UI with saved state
  updateUI();
  
  // Request notification permission after a short delay (user interaction)
  setTimeout(() => {
    TimerManager.requestNotificationPermission();
  }, 1000);
}

// Create the main UI
function createUI(): void {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  
  app.innerHTML = `
    <div class="shadowBg"></div>
    
    <!-- Task History Modal -->
    <div class="notes-modal" id="history-modal">
      <div class="notes-modal-content">
        <div class="notes-modal-header">
          <h3><i class="fa-solid fa-clock-rotate-left"></i> <span data-i18n="pomodoroHistory">Pomodoro Geçmişi</span></h3>
          <button class="close-history-modal">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        <div class="notes-modal-body">
          <div id="history-list"></div>
        </div>
        <div class="notes-modal-footer">
          <button class="modern-btn secondary close-history-modal" data-i18n="cancel">İptal</button>
        </div>
      </div>
    </div>
    
    <!-- Task Notes Modal -->
    <div class="notes-modal" id="notes-modal">
      <div class="notes-modal-content">
        <div class="notes-modal-header">
          <h3><i class="fa-solid fa-note-sticky"></i> <span data-i18n="notes">Notlar</span></h3>
          <button class="close-notes-modal">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        <div class="notes-modal-body">
          <textarea id="task-notes-textarea" placeholder="Not ekle..." data-i18n-placeholder="addNote" rows="8"></textarea>
        </div>
        <div class="notes-modal-footer">
          <button class="modern-btn secondary close-notes-modal" data-i18n="cancel">İptal</button>
          <button class="modern-btn primary" id="save-notes-btn" data-i18n="saveNote">Notu Kaydet</button>
        </div>
      </div>
    </div>
    
    <!-- Info Modal -->
    <div class="infoBox">
      <div class="infoBox-header">
        <h1 data-i18n="whatIsPomodoroTechnique">Pomodoro Tekniği Nedir?</h1>
        <i class="fa-solid fa-xmark"></i>
      </div>
      <div class="infoBox-content">
        <div class="help-section">
          <h3 data-i18n="step1">ADIM 1:</h3>
          <p data-i18n="step1Desc">Bir görev seçin</p>
          <h3 data-i18n="step2">ADIM 2:</h3>
          <p data-i18n="step2Desc">25 dakikalık bir zamanlayıcı kurun</p>
          <h3 data-i18n="step3">ADIM 3:</h3>
          <p data-i18n="step3Desc">Zamanlayıcı bitene kadar görevinizde tam konsantrasyonla çalışın</p>
          <h3 data-i18n="step4">ADIM 4:</h3>
          <p data-i18n="step4Desc">5 dakika mola verin</p>
          <h3 data-i18n="step5">ADIM 5:</h3>
          <p data-i18n="step5Desc">Her 4 pomodorodan sonra 15-20 dakika uzun mola verin</p>
        </div>
        
        <div class="help-section">
          <h3 data-i18n="features">Özellikler</h3>
          <p data-i18n="featuresDesc">• Görev yönetimi ve takibi<br>• Hedef belirleme ve ilerleme<br>• Detaylı istatistikler<br>• Tema seçenekleri<br>• Ses ve bildirim ayarları<br>• Yedekleme ve geri yükleme</p>
        </div>
        
        <div class="help-section">
          <h3 data-i18n="tips">İpuçları</h3>
          <p data-i18n="tipsDesc">• Dikkat dağıtıcıları uzaklaştırın<br>• Mola sırasında ekrandan uzak durun<br>• Görevleri küçük parçalara bölün<br>• Düzenli molalar verin<br>• İlerlemenizi takip edin</p>
        </div>
        
        <div class="help-section">
          <h3 data-i18n="keyboardShortcuts">Klavye Kısayolları</h3>
          <p data-i18n="shortcutsDesc">• Space: Başlat/Duraklat<br>• R: Sıfırla<br>• 1: Pomodoro modu<br>• 2: Kısa mola<br>• 3: Uzun mola</p>
        </div>
      </div>
    </div>

    <!-- Header with Navigation -->
    <header class="app-header">
      <div class="header-left">
        <h1 class="app-title">🍅 Pomodoro Timer</h1>
      </div>
      <div class="header-right">
        <button class="nav-btn" id="stats-btn" data-i18n-title="statistics">
          <i class="fa-solid fa-chart-line"></i>
        </button>
        <button class="nav-btn" id="tasks-btn" data-i18n-title="tasks">
          <i class="fa-solid fa-tasks"></i>
        </button>
        <button class="nav-btn" id="goals-btn" data-i18n-title="goals">
          <i class="fa-solid fa-bullseye"></i>
        </button>
        <button class="nav-btn" id="settings-btn" data-i18n-title="settings">
          <i class="fa-solid fa-cog"></i>
        </button>
        <button class="timer-info" data-i18n-title="help">
          <i class="fa-solid fa-question"></i>
        </button>
      </div>
    </header>

    <!-- Main Timer Section -->
    <main class="timer-section">
      <!-- Mode Buttons -->
      <div class="btn-container" id="mode-btns">
        <button class="btn active" data-mode="pomodoro" data-i18n="pomodoro">Pomodoro</button>
        <button class="btn" data-mode="short" data-i18n="shortBreak">Kısa Mola</button>
        <button class="btn" data-mode="long" data-i18n="longBreak">Uzun Mola</button>
      </div>

      <!-- Timer Display -->
      <div class="timer">
        <div class="time">
          <span id="minute">25</span>:<span id="second">00</span>
        </div>
        <svg width="345" height="345">
          <circle id="circle1" cx="170" cy="170" r="165"></circle>
          <circle id="circle2" cx="170" cy="170" r="165"></circle>
        </svg>
      </div>

      <!-- Timer Info -->
      <div class="info">
        <span id="timer-info-text" data-i18n="youAreInPomodoroTime">Pomodoro zamanındasınız</span>
        <lord-icon
          src="https://cdn.lordicon.com/qtqvorle.json"
          trigger="loop"
          colors="outline:#ffffff,primary:#646e78,secondary:#1e8194,tertiary:#9ce5f4"
          style="width: 50px; height: 50px"
        >
        </lord-icon>
      </div>

      <!-- Action Button -->
      <button class="actionBtn" id="action-btn">
        <i class="fa-solid fa-play"></i>
      </button>

      <!-- Progress Info -->
      <div class="progress-info">
        <div class="cycle-info">
          <span><span data-i18n="cycle">Döngü</span>: <strong id="cycle-count">1</strong></span>
        </div>
        <div class="stats-preview">
          <span><span data-i18n="today">Bugün</span>: <strong id="today-count">0</strong> <span data-i18n="pomodoros">pomodoro</span></span>
        </div>
      </div>
      
      <!-- Active Task Display -->
      <div class="active-goal-display" id="active-task-display" style="display: none;">
        <i class="fa-solid fa-tasks"></i>
        <span id="active-task-text"></span>
      </div>
      
      <!-- Active Goal Display -->
      <div class="active-goal-display" id="active-goal-display" style="display: none;">
        <i class="fa-solid fa-bullseye"></i>
        <span id="active-goal-text"></span>
      </div>
    </main>

    <!-- Statistics Panel -->
    <div class="panel" id="stats-panel">
      <div class="panel-header">
        <h2><i class="fa-solid fa-chart-line"></i> <span data-i18n="statistics">İstatistikler</span></h2>
        <button class="close-panel" data-panel="stats">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
      <div class="panel-content">
        <div class="stats-grid">
          <div class="stat-card">
            <h3 data-i18n="totalPomodoros">Toplam Pomodoro</h3>
            <div class="stat-value" id="total-pomodoros">0</div>
          </div>
          <div class="stat-card">
            <h3 data-i18n="totalTime">Toplam Süre</h3>
            <div class="stat-value" id="total-time">0h 0m</div>
          </div>
          <div class="stat-card">
            <h3 data-i18n="streak">Seri</h3>
            <div class="stat-value" id="streak">0 gün</div>
          </div>
          <div class="stat-card">
            <h3 data-i18n="thisWeek">Bu Hafta</h3>
            <div class="stat-value" id="week-pomodoros">0</div>
          </div>
        </div>
        
        <!-- Weekly Chart -->
        <div class="chart-section">
          <h3 data-i18n="weeklyActivity">Haftalık Aktivite</h3>
          <div class="bar-chart" id="weekly-chart"></div>
        </div>
        
        <!-- Task Progress Chart -->
        <div class="chart-section">
          <h3 data-i18n="taskProgress">Görev İlerlemesi</h3>
          <div id="task-progress-chart"></div>
        </div>
      </div>
    </div>

    <!-- Tasks Panel -->
    <div class="panel" id="tasks-panel">
      <div class="panel-header">
        <h2><i class="fa-solid fa-list-check"></i> <span data-i18n="tasks">Görevler</span></h2>
        <button class="close-panel" data-panel="tasks">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
      <div class="panel-content">
        <div class="task-input-section">
          <div class="task-input-row">
            <input type="text" id="task-input" placeholder="Yeni görev ekle..." class="modern-input" data-i18n-placeholder="addNewTask">
            <button id="add-task-btn" class="modern-btn primary">
              <i class="fa-solid fa-plus"></i>
              <span data-i18n="add">Ekle</span>
            </button>
          </div>
          <div class="task-input-options">
            <select id="task-goal" class="modern-select">
              <option value="" data-i18n="noGoal">Hedef Yok</option>
            </select>
            <select id="task-category" class="modern-select">
              <option value="work" data-i18n="work">İş</option>
              <option value="personal" data-i18n="personal">Kişisel</option>
              <option value="learning" data-i18n="learning">Öğrenme</option>
              <option value="health" data-i18n="health">Sağlık</option>
              <option value="other" data-i18n="other">Diğer</option>
            </select>
            <select id="task-priority" class="modern-select">
              <option value="medium" data-i18n="medium">Orta</option>
              <option value="high" data-i18n="high">Yüksek</option>
              <option value="low" data-i18n="low">Düşük</option>
            </select>
            <input type="number" id="task-pomodoros" min="1" max="20" value="1" class="modern-input-number" placeholder="Pomodoro">
            <label class="checkbox-label" data-i18n-title="recurringTask" title="Tekrarlayan görev">
              <input type="checkbox" id="task-recurring" class="modern-checkbox">
              <span>🔄</span>
            </label>
          </div>
        </div>
        
        <!-- Search Bar -->
        <div class="task-search-bar">
          <div class="search-icon-box">
            <i class="fa-solid fa-search"></i>
          </div>
          <input type="text" id="task-search" placeholder="Görevlerde ara..." class="search-input" data-i18n-placeholder="searchTasks">
        </div>
        
        <!-- Category Filter -->
        <div class="category-filter">
          <button class="category-filter-btn active" data-category="all">
            <i class="fa-solid fa-border-all"></i> <span data-i18n="all">Tümü</span>
          </button>
          <button class="category-filter-btn" data-category="work">
            💼 <span data-i18n="work">İş</span>
          </button>
          <button class="category-filter-btn" data-category="personal">
            👤 <span data-i18n="personal">Kişisel</span>
          </button>
          <button class="category-filter-btn" data-category="learning">
            📚 <span data-i18n="learning">Öğrenme</span>
          </button>
          <button class="category-filter-btn" data-category="health">
            💪 <span data-i18n="health">Sağlık</span>
          </button>
          <button class="category-filter-btn" data-category="other">
            📌 <span data-i18n="other">Diğer</span>
          </button>
        </div>
        
        <div class="task-tabs">
          <button class="task-tab active" data-tab="active">
            <i class="fa-solid fa-circle-dot"></i> <span data-i18n="active">Aktif</span>
          </button>
          <button class="task-tab" data-tab="completed">
            <i class="fa-solid fa-circle-check"></i> <span data-i18n="completed">Tamamlanan</span>
          </button>
        </div>
        
        <!-- Bulk Actions -->
        <div class="bulk-actions">
          <button class="bulk-btn" onclick="completeAllTasks()" title="Tümünü tamamla">
            <i class="fa-solid fa-check-double"></i> <span data-i18n="completeAll">Tümünü Tamamla</span>
          </button>
          <button class="bulk-btn danger" onclick="deleteCompletedTasks()" title="Tamamlananları sil">
            <i class="fa-solid fa-trash-can"></i> <span data-i18n="deleteCompleted">Tamamlananları Sil</span>
          </button>
        </div>
        
        <div class="task-list" id="task-list">
          <!-- Active tasks will be populated here -->
        </div>
        
        <div class="task-list hidden" id="completed-task-list">
          <!-- Completed tasks will be populated here -->
        </div>
      </div>
    </div>

    <!-- Goals Panel -->
    <div class="panel" id="goals-panel">
      <div class="panel-header">
        <h2><i class="fa-solid fa-bullseye"></i> <span data-i18n="goals">Hedefler</span></h2>
        <button class="close-panel" data-panel="goals">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
      <div class="panel-content">
        <div class="task-input-section">
          <div class="task-input-row">
            <input type="text" id="goal-input" placeholder="Hedef adı..." class="modern-input" data-i18n-placeholder="goalName">
            <button id="add-goal-btn" class="modern-btn primary">
              <i class="fa-solid fa-plus"></i>
              <span data-i18n="add">Ekle</span>
            </button>
          </div>
          <div class="task-input-options">
            <input type="number" id="goal-target" placeholder="Hedef sayısı" min="1" max="50" class="modern-input-number" data-i18n-placeholder="targetNumber">
          </div>
        </div>
        <div class="task-tabs">
          <button class="task-tab goal-tab active" data-tab="active-goals">
            <i class="fa-solid fa-circle-dot"></i> <span data-i18n="active">Aktif</span>
          </button>
          <button class="task-tab goal-tab" data-tab="completed-goals">
            <i class="fa-solid fa-circle-check"></i> <span data-i18n="completed">Tamamlanan</span>
          </button>
        </div>
        
        <div class="goal-list" id="goal-list">
          <!-- Active goals will be populated here -->
        </div>
        
        <div class="goal-list hidden" id="completed-goal-list">
          <!-- Completed goals will be populated here -->
        </div>
      </div>
    </div>

    <!-- Settings Panel -->
    <div class="panel" id="settings-panel">
      <div class="panel-header">
        <h2><i class="fa-solid fa-gear"></i> <span data-i18n="settings">Ayarlar</span></h2>
        <button class="close-panel" data-panel="settings">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
      <div class="panel-content">
        <div class="settings-section modern-section">
          <h3><i class="fa-solid fa-clock"></i> <span data-i18n="timeSettings">Zaman Ayarları</span></h3>
          <div class="setting-item modern-setting">
            <label>
              <i class="fa-solid fa-clock"></i>
              <span data-i18n="pomodoroDuration">Pomodoro Süresi</span>
            </label>
            <div class="input-with-unit">
              <input type="number" id="pomodoro-duration" min="1" max="60" value="25" class="modern-input-number">
              <span class="unit" data-i18n="minutes">dk</span>
            </div>
          </div>
          <div class="setting-item modern-setting">
            <label>
              <i class="fa-solid fa-coffee"></i>
              <span data-i18n="shortBreak">Kısa Mola</span>
            </label>
            <div class="input-with-unit">
              <input type="number" id="short-break-duration" min="1" max="30" value="5" class="modern-input-number">
              <span class="unit" data-i18n="minutes">dk</span>
            </div>
          </div>
          <div class="setting-item modern-setting">
            <label>
              <i class="fa-solid fa-mug-hot"></i>
              <span data-i18n="longBreak">Uzun Mola</span>
            </label>
            <div class="input-with-unit">
              <input type="number" id="long-break-duration" min="1" max="60" value="15" class="modern-input-number">
              <span class="unit" data-i18n="minutes">dk</span>
            </div>
          </div>
        </div>
        
        <div class="settings-section modern-section">
          <h3><i class="fa-solid fa-palette"></i> <span data-i18n="theme">Tema</span></h3>
          <div class="theme-selector" id="theme-selector">
            <!-- Themes will be populated here -->
          </div>
        </div>
        
        <div class="settings-section modern-section">
          <h3><i class="fa-solid fa-bell"></i> <span data-i18n="soundAndNotifications">Ses ve Bildirimler</span></h3>
          <div class="setting-item modern-setting toggle-setting">
            <label>
              <i class="fa-solid fa-volume-high"></i>
              <span data-i18n="soundEffects">Ses efektleri</span>
            </label>
            <label class="toggle-switch">
              <input type="checkbox" id="sound-enabled" checked>
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-item modern-setting toggle-setting">
            <label>
              <i class="fa-solid fa-bell"></i>
              <span data-i18n="notifications">Bildirimler</span>
            </label>
            <label class="toggle-switch">
              <input type="checkbox" id="notifications-enabled" checked>
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-item modern-setting">
            <label>
              <i class="fa-solid fa-sliders"></i>
              <span data-i18n="soundLevel">Ses Seviyesi</span>
            </label>
            <input type="range" id="volume-slider" min="0" max="1" step="0.1" value="0.5" class="modern-slider">
          </div>
          <div class="setting-item">
            <button id="test-sound-btn" class="modern-btn secondary full-width">
              <i class="fa-solid fa-volume-high"></i>
              <span data-i18n="testSound">Ses Testi</span>
            </button>
          </div>
        </div>
        
        <div class="settings-section modern-section">
          <h3><i class="fa-solid fa-language"></i> <span data-i18n="language">Dil</span></h3>
          <div class="setting-item modern-setting">
            <label>
              <i class="fa-solid fa-globe"></i>
              <span data-i18n="selectLanguage">Dil Seçin</span>
            </label>
            <select id="language-selector" class="modern-select">
              <option value="tr">🇹🇷 Türkçe</option>
              <option value="en">🇬🇧 English</option>
            </select>
          </div>
        </div>
        
        <div class="settings-section modern-section">
          <h3><i class="fa-solid fa-database"></i> <span data-i18n="backupRestore">Yedekleme ve Geri Yükleme</span></h3>
          <div class="setting-item">
            <p style="color: var(--color-text-secondary); font-size: 0.875rem; margin-bottom: var(--space-4);">
              <span data-i18n="backupDesc">Tüm görevlerinizi, hedeflerinizi, istatistiklerinizi ve ayarlarınızı yedekleyin veya geri yükleyin.</span>
            </p>
            <button id="export-backup-btn" class="modern-btn primary full-width">
              <i class="fa-solid fa-download"></i>
              <span data-i18n="exportBackup">Yedeği İndir</span>
            </button>
          </div>
          <div class="setting-item">
            <input type="file" id="import-backup-input" accept=".json" style="display: none;">
            <button id="import-backup-btn" class="modern-btn secondary full-width">
              <i class="fa-solid fa-upload"></i>
              <span data-i18n="importBackup">Yedeği Yükle</span>
            </button>
          </div>
        </div>

        <div class="settings-section modern-section">
          <h3><i class="fa-solid fa-rotate-left"></i> <span data-i18n="resetSettings">Ayarları Sıfırla</span></h3>
          <div class="setting-item">
            <button id="reset-settings-btn" class="modern-btn danger full-width">
              <i class="fa-solid fa-rotate-left"></i>
              <span data-i18n="resetToDefaults">Varsayılan Ayarlara Dön</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="app-footer">
      <p>Made with <span class="heart">♥</span> by <strong>Sinan Sarıkaya</strong></p>
    </footer>
  `;
}

// Setup event listeners
function setupEventListeners(): void {
  // Timer controls
  const actionBtn = document.getElementById('action-btn')!;
  const modeBtns = document.getElementById('mode-btns')!;
  
  actionBtn.addEventListener('click', toggleTimer);
  modeBtns.addEventListener('click', handleModeButtonClick);

  // Navigation buttons
  document.getElementById('stats-btn')?.addEventListener('click', () => togglePanel('stats'));
  document.getElementById('tasks-btn')?.addEventListener('click', () => togglePanel('tasks'));
  document.getElementById('goals-btn')?.addEventListener('click', () => togglePanel('goals'));
  document.getElementById('settings-btn')?.addEventListener('click', () => togglePanel('settings'));

  // Panel close buttons
  document.querySelectorAll('.close-panel').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const panel = (e.target as HTMLElement).closest('.close-panel')?.getAttribute('data-panel');
      if (panel) togglePanel(panel);
    });
  });

  // Info modal
  document.querySelector('.timer-info')?.addEventListener('click', () => {
    document.querySelector('.shadowBg')?.classList.add('active');
    document.querySelector('.infoBox')?.classList.add('active');
  });

  const closeInfoModal = () => {
    document.querySelector('.shadowBg')?.classList.remove('active');
    document.querySelector('.infoBox')?.classList.remove('active');
  };

  document.querySelector('.fa-xmark')?.addEventListener('click', closeInfoModal);

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Don't trigger shortcuts if user is typing in an input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    switch (e.key) {
      case ' ':
        e.preventDefault();
        toggleTimer();
        break;
      case 'r':
      case 'R':
        e.preventDefault();
        resetTimer();
        break;
      case '1':
        e.preventDefault();
        setMode('pomodoro');
        break;
      case '2':
        e.preventDefault();
        setMode('shortBreak');
        break;
      case '3':
        e.preventDefault();
        setMode('longBreak');
        break;
      case 'Escape':
        const infoBox = document.querySelector('.infoBox');
        if (infoBox?.classList.contains('active')) {
          closeInfoModal();
        }
        break;
    }
  });

  document.querySelector('.shadowBg')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      closeInfoModal();
    }
  });

  // Task management
  document.getElementById('add-task-btn')?.addEventListener('click', addTask);
  document.getElementById('task-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });
  
  // Notes modal
  document.querySelectorAll('.close-notes-modal').forEach(btn => {
    btn.addEventListener('click', closeNotesModal);
  });
  document.getElementById('save-notes-btn')?.addEventListener('click', saveTaskNotes);
  
  // History modal
  document.querySelectorAll('.close-history-modal').forEach(btn => {
    btn.addEventListener('click', closeHistoryModal);
  });
  
  // Search tasks
  const taskSearchInput = document.getElementById('task-search') as HTMLInputElement;
  taskSearchInput?.addEventListener('input', (e) => {
    currentSearchQuery = (e.target as HTMLInputElement).value;
    updateTasksPanel();
  });
  
  // Category filter
  document.querySelectorAll('.category-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const category = target.getAttribute('data-category') || 'all';
      
      // Update active filter
      document.querySelectorAll('.category-filter-btn').forEach(b => b.classList.remove('active'));
      target.classList.add('active');
      
      // Update filter and refresh tasks
      currentCategoryFilter = category;
      updateTasksPanel();
    });
  });
  
  // Task tabs
  document.querySelectorAll('.task-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const tabType = target.getAttribute('data-tab');
      
      // Update active tab
      document.querySelectorAll('.task-tab').forEach(t => t.classList.remove('active'));
      target.classList.add('active');
      
      // Show/hide task lists
      const activeList = document.getElementById('task-list');
      const completedList = document.getElementById('completed-task-list');
      
      if (tabType === 'active') {
        activeList?.classList.remove('hidden');
        completedList?.classList.add('hidden');
      } else {
        activeList?.classList.add('hidden');
        completedList?.classList.remove('hidden');
      }
    });
  });

  // Goal tabs
  document.querySelectorAll('.goal-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const tabType = target.getAttribute('data-tab');
      
      // Update active tab
      document.querySelectorAll('.goal-tab').forEach(t => t.classList.remove('active'));
      target.classList.add('active');
      
      // Show/hide goal lists
      const activeList = document.getElementById('goal-list');
      const completedList = document.getElementById('completed-goal-list');
      
      if (tabType === 'active-goals') {
        activeList?.classList.remove('hidden');
        completedList?.classList.add('hidden');
      } else {
        activeList?.classList.add('hidden');
        completedList?.classList.remove('hidden');
      }
    });
  });

  // Goal management
  document.getElementById('add-goal-btn')?.addEventListener('click', addGoal);

  // Settings
  setupSettingsListeners();

  // Timer callbacks
  TimerManager.setCallbacks({
    onTick: updateTimerDisplay,
    onComplete: handleTimerComplete,
    onStart: () => {
      updateActionButton(true);
    },
    onModeChange: (mode: string) => {
      updateModeButtons(mode);
      updateTimerInfo(mode);
      // Update button state after a short delay to ensure timer state is updated
      setTimeout(() => {
        updateActionButton(TimerManager.isRunning());
      }, 150);
    }
  });

  // Initial UI update
  updateUI();
  
  // Initialize circle
  initializeCircle();
}

// Timer functions
function toggleTimer(): void {
  // Enable audio on first user interaction
  AudioManager.enableAudio();
  
  // Request notification permission on first interaction if not already granted
  if ('Notification' in window && Notification.permission === 'default') {
    TimerManager.requestNotificationPermission();
  }
  
  if (TimerManager.isRunning()) {
    TimerManager.pause();
    updateActionButton(false);
  } else {
    TimerManager.start();
    updateActionButton(true);
  }
}

function resetTimer(): void {
  TimerManager.reset();
  updateTimerDisplay();
  updateActionButton(false);
  updateModeButtons(TimerManager.getMode());
}

function setMode(mode: string): void {
  const modeMap: Record<string, 'pomodoro' | 'short' | 'long'> = {
    'pomodoro': 'pomodoro',
    'shortBreak': 'short',
    'longBreak': 'long'
  };
  
  const timerMode = modeMap[mode];
  if (timerMode) {
    TimerManager.setMode(timerMode);
    updateModeButtons(timerMode);
    updateTimerDisplay();
  }
}

function handleModeChange(mode: string): void {
  TimerManager.setMode(mode as 'pomodoro' | 'short' | 'long');
  updateModeButtons(mode);
  updateTimerInfo(mode);
  updateTimerDisplay();
  
  // Update button state based on timer status
  updateActionButton(TimerManager.isRunning());
}

function handleModeButtonClick(e: Event): void {
  const target = e.target as HTMLButtonElement;
  const mode = target.dataset.mode as 'pomodoro' | 'short' | 'long';
  if (mode) {
    handleModeChange(mode);
  }
}

function updateTimerDisplay(time?: number): void {
  const currentTime = time !== undefined ? time : TimerManager.getCurrentTime();
  // Negatif değerleri engelle
  const safeTime = Math.max(0, currentTime);
  const minutes = Math.floor(safeTime / 60);
  const seconds = Math.floor(safeTime % 60);

  const minuteEl = document.getElementById('minute');
  const secondEl = document.getElementById('second');

  if (minuteEl) minuteEl.textContent = minutes.toString();
  if (secondEl) secondEl.textContent = seconds.toString().padStart(2, '0');

  // Update progress circle
  updateProgressCircle(safeTime);
}

function initializeCircle(): void {
  const circle = document.getElementById('circle2') as unknown as SVGCircleElement;
  if (circle) {
    const circumference = 1036.7; // 2 * π * 165 (radius)
    circle.style.strokeDasharray = circumference.toString();
    circle.style.strokeDashoffset = circumference.toString();
  }
}

function updateProgressCircle(currentTime: number): void {
  const totalTime = TimerManager.getCurrentTime();
  const progress = Math.max(0, (totalTime - currentTime) / totalTime);
  const circle = document.getElementById('circle2') as unknown as SVGCircleElement;
  
  if (circle) {
    const circumference = 1036.7; // 2 * π * 165 (radius)
    const offset = circumference - (progress * circumference);
    circle.style.strokeDashoffset = offset.toString();
  }
}

function handleTimerComplete(_mode: string): void {
  updateActionButton(false);
  updateUI();
}

function updateActionButton(isRunning: boolean): void {
  const actionBtn = document.getElementById('action-btn');
  if (!actionBtn) return;
  
  const icon = actionBtn.querySelector('i');
  if (!icon) return;
  
  if (isRunning) {
    icon.className = 'fa-solid fa-pause';
  } else {
    icon.className = 'fa-solid fa-play';
  }
}

function updateModeButtons(activeMode: string): void {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-mode="${activeMode}"]`)?.classList.add('active');
}

function updateTimerInfo(mode: string): void {
  const infoText = document.getElementById('timer-info-text');
  if (!infoText) return;
  
  const modeTexts = {
    pomodoro: I18n.t('youAreInPomodoroTime'),
    short: I18n.t('youAreInShortBreak'),
    long: I18n.t('youAreInLongBreak')
  };
  infoText.textContent = modeTexts[mode as keyof typeof modeTexts];
}

// Panel management
let currentOpenPanel: string | null = null;

function togglePanel(panelName: string): void {
  const panel = document.getElementById(`${panelName}-panel`);
  if (!panel) return;

  // If clicking the same panel, close it
  if (currentOpenPanel === panelName) {
    closePanel(panelName);
    return;
  }

  // Close any currently open panel
  if (currentOpenPanel) {
    closePanel(currentOpenPanel);
  }

  // Open the new panel
  openPanel(panelName);
}

function openPanel(panelName: string): void {
  const panel = document.getElementById(`${panelName}-panel`);
  if (panel) {
    panel.classList.add('active');
    currentOpenPanel = panelName;
    updatePanelContent(panelName);
    
    // Add click outside listener
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }, 100);
  }
}

function closePanel(panelName: string): void {
  const panel = document.getElementById(`${panelName}-panel`);
  if (panel) {
    panel.classList.remove('active');
    currentOpenPanel = null;
    
    // Remove event listeners
    document.removeEventListener('click', handleClickOutside);
    document.removeEventListener('keydown', handleEscapeKey);
  }
}

function handleClickOutside(e: Event): void {
  const target = e.target as HTMLElement;
  const panel = document.querySelector('.panel.active');
  
  if (panel && !panel.contains(target) && !target.closest('.nav-btn')) {
    if (currentOpenPanel) {
      closePanel(currentOpenPanel);
    }
  }
}

function handleEscapeKey(e: KeyboardEvent): void {
  if (e.key === 'Escape' && currentOpenPanel) {
    closePanel(currentOpenPanel);
  }
}

function updatePanelContent(panelName: string): void {
  switch (panelName) {
    case 'stats':
      updateStatsPanel();
      break;
    case 'tasks':
      updateTasksPanel();
      break;
    case 'goals':
      updateGoalsPanel();
      break;
    case 'settings':
      updateSettingsPanel();
      break;
  }
}

// Panel update functions
function updateStatsPanel(): void {
  const totalPomodoros = StatisticsManager.getTotalPomodoros();
  const totalTime = StatisticsManager.getTotalTime();
  const streak = StatisticsManager.getStreak();
  const weekPomodoros = StatisticsManager.getWeekSessions().length;

  document.getElementById('total-pomodoros')!.textContent = totalPomodoros.toString();
  document.getElementById('total-time')!.textContent = formatTime(totalTime);
  document.getElementById('streak')!.textContent = `${streak} ${I18n.t('days')}`;
  document.getElementById('week-pomodoros')!.textContent = weekPomodoros.toString();
  
  // Update weekly chart
  updateWeeklyChart();
  
  // Update task progress chart
  updateTaskProgressChart();
}

function updateWeeklyChart(): void {
  const weeklyChart = document.getElementById('weekly-chart');
  if (!weeklyChart) return;
  
  const daysEN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const daysTR = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const days = I18n.getCurrentLanguage() === 'tr' ? daysTR : daysEN;
  const sessions = StatisticsManager.getWeekSessions();
  
  // Count pomodoros per day
  const pomodorosPerDay = new Array(7).fill(0);
  const today = new Date();
  
  sessions.forEach(session => {
    if (session.mode === 'pomodoro') {
      const sessionDate = new Date(session.startTime);
      const sessionDay = sessionDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      // Convert Sunday (0) to index 6, Monday (1) to index 0, etc.
      const dayIndex = sessionDay === 0 ? 6 : sessionDay - 1;
      
      // Check if session is within current week
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      
      if (sessionDate >= weekStart && sessionDate < weekEnd) {
        pomodorosPerDay[dayIndex]++;
      }
    }
  });
  
  const maxPomodoros = Math.max(...pomodorosPerDay, 1);
  
  weeklyChart.innerHTML = days.map((day, index) => `
    <div class="bar-item">
      <div class="bar-fill" style="height: ${(pomodorosPerDay[index] / maxPomodoros) * 100}%">
        <span class="bar-value">${pomodorosPerDay[index]}</span>
      </div>
      <div class="bar-label">${day}</div>
    </div>
  `).join('');
}

function updateTaskProgressChart(): void {
  const chartContainer = document.getElementById('task-progress-chart');
  if (!chartContainer) return;
  
  const tasks = TaskManager.getActiveTasks();
  
  if (tasks.length === 0) {
    chartContainer.innerHTML = `<div class="empty-state"><i class="fa-solid fa-tasks"></i><p>${I18n.t('noTasksYet')}</p></div>`;
    return;
  }
  
  chartContainer.innerHTML = tasks.slice(0, 5).map(task => {
    const progress = task.estimatedPomodoros > 0 ? (task.pomodorosUsed / task.estimatedPomodoros) * 100 : 0;
    return `
      <div class="progress-item">
        <div class="progress-label">${task.title}</div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill" style="width: ${Math.min(progress, 100)}%"></div>
          <span class="progress-text">${task.pomodorosUsed}/${task.estimatedPomodoros}</span>
        </div>
      </div>
    `;
  }).join('');
}

function populateGoalSelect(): void {
  const goalSelect = document.getElementById('task-goal') as HTMLSelectElement;
  if (!goalSelect) return;
  
  const goals = GoalManager.getActiveGoals();
  goalSelect.innerHTML = `<option value="" data-i18n="noGoal">${I18n.t('noGoal')}</option>`;
  
  goals.forEach(goal => {
    const option = document.createElement('option');
    option.value = goal.id;
    option.textContent = `🎯 ${goal.title} (${goal.current}/${goal.target})`;
    goalSelect.appendChild(option);
  });
}

function updateTasksPanel(): void {
  const activeTasks = TaskManager.getActiveTasks();
  const completedTasks = TaskManager.getCompletedTasks();
  const activeTaskId = TaskManager.getActiveTaskId();
  const taskList = document.getElementById('task-list')!;
  const completedTaskList = document.getElementById('completed-task-list')!;
  
  // Update goal select
  populateGoalSelect();
  
  // Filter tasks by category and search
  let filteredActiveTasks = currentCategoryFilter === 'all' 
    ? activeTasks 
    : activeTasks.filter(task => task.category === currentCategoryFilter);
  
  let filteredCompletedTasks = currentCategoryFilter === 'all'
    ? completedTasks
    : completedTasks.filter(task => task.category === currentCategoryFilter);
  
  // Apply search filter
  if (currentSearchQuery) {
    const query = currentSearchQuery.toLowerCase();
    filteredActiveTasks = filteredActiveTasks.filter(task => 
      task.title.toLowerCase().includes(query)
    );
    filteredCompletedTasks = filteredCompletedTasks.filter(task => 
      task.title.toLowerCase().includes(query)
    );
  }
  
  // Update active tasks
  if (filteredActiveTasks.length === 0) {
    taskList.innerHTML = `<div class="empty-state"><i class="fa-solid fa-inbox"></i><p>${I18n.t('noTasksYet')}</p></div>`;
  } else {
    taskList.innerHTML = filteredActiveTasks.map(task => {
      const progress = task.estimatedPomodoros > 0 ? (task.pomodorosUsed / task.estimatedPomodoros) * 100 : 0;
      const isActive = task.id === activeTaskId;
      const priorityClass = task.priority || 'medium';
      const priorityLabel = task.priority ? I18n.t(task.priority) : I18n.t('medium');
      const category = task.category || 'work';
      const categoryLabel = I18n.t(category as any);
      const categoryEmoji = {work: '💼', personal: '👤', learning: '📚', health: '💪', other: '📌'}[category] || '📌';
      const hasNotes = task.notes && task.notes.trim().length > 0;
      const isRecurring = task.recurring?.enabled;
      
      return `
        <div class="task-item priority-${priorityClass} ${isActive ? 'active-task' : ''} ${isRecurring ? 'recurring-task' : ''}" data-task-id="${task.id}" onclick="setActiveTask('${task.id}', event)">
          <div class="task-header">
            <div class="task-title-wrapper">
              <div class="task-badges">
                <span class="priority-badge priority-${priorityClass}">${priorityLabel}</span>
                <span class="category-badge">${categoryEmoji} ${categoryLabel}</span>
                ${hasNotes ? '<span class="notes-indicator" title="' + I18n.t('hasNotes') + '">📝</span>' : ''}
                ${isRecurring ? '<span class="recurring-badge" title="' + I18n.t('recurringTask') + '">🔄</span>' : ''}
              </div>
              <h4>${task.title}</h4>
            </div>
            <div class="task-actions">
              <button class="task-btn move" onclick="event.stopPropagation(); moveTaskUp('${task.id}')" title="${I18n.t('moveUp')}">
                <i class="fa-solid fa-arrow-up"></i>
              </button>
              <button class="task-btn move" onclick="event.stopPropagation(); moveTaskDown('${task.id}')" title="${I18n.t('moveDown')}">
                <i class="fa-solid fa-arrow-down"></i>
              </button>
              <button class="task-btn history" onclick="event.stopPropagation(); openTaskHistory('${task.id}')" title="${I18n.t('history')}">
                <i class="fa-solid fa-clock-rotate-left"></i>
              </button>
              <button class="task-btn notes" onclick="event.stopPropagation(); openTaskNotes('${task.id}')" title="${I18n.t('notes')}">
                <i class="fa-solid fa-note-sticky"></i>
              </button>
              <button class="task-btn edit" onclick="event.stopPropagation(); editTask('${task.id}')" title="${I18n.t('edit')}">
                <i class="fa-solid fa-edit"></i>
              </button>
              <button class="task-btn complete" onclick="event.stopPropagation(); completeTask('${task.id}')" title="${I18n.t('complete')}">
                <i class="fa-solid fa-check"></i>
              </button>
              <button class="task-btn delete" onclick="event.stopPropagation(); deleteTask('${task.id}')" title="${I18n.t('delete')}">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
          ${hasNotes ? '<div class="task-notes-preview">' + (task.notes?.substring(0, 100) || '') + (task.notes && task.notes.length > 100 ? '...' : '') + '</div>' : ''}
          <div class="task-progress-bar">
            <div class="task-progress-fill" style="width: ${progress}%"></div>
          </div>
          <div class="task-stats">
            <span>🍅 ${task.pomodorosUsed}/${task.estimatedPomodoros}</span>
          </div>
          ${isActive ? '<div class="active-task-badge"><i class="fa-solid fa-check-circle"></i> ' + I18n.t('activeTask') + '</div>' : ''}
          ${progress >= 100 ? '<div class="completed-badge"><i class="fa-solid fa-trophy"></i> ' + I18n.t('taskCompleted') + '</div>' : ''}
        </div>
      `;
    }).join('');
  }
  
  // Update completed tasks
  if (filteredCompletedTasks.length === 0) {
    completedTaskList.innerHTML = `<div class="empty-state"><i class="fa-solid fa-check-circle"></i><p>${I18n.t('noCompletedTasks')}</p></div>`;
  } else {
    completedTaskList.innerHTML = filteredCompletedTasks.map(task => {
      const hasNotes = task.notes && task.notes.trim().length > 0;
      
      return `
        <div class="task-item completed" data-task-id="${task.id}">
          <div class="task-header">
            <h4><s>${task.title}</s></h4>
            <div class="task-actions">
              <button class="task-btn history" onclick="event.stopPropagation(); openTaskHistory('${task.id}')" title="${I18n.t('history')}">
                <i class="fa-solid fa-clock-rotate-left"></i>
              </button>
              <button class="task-btn notes" onclick="event.stopPropagation(); openTaskNotes('${task.id}')" title="${I18n.t('notes')}">
                <i class="fa-solid fa-note-sticky"></i>
              </button>
              <button class="task-btn edit" onclick="event.stopPropagation(); editTask('${task.id}')" title="${I18n.t('edit')}">
                <i class="fa-solid fa-edit"></i>
              </button>
              <button class="task-btn undo" onclick="uncompleteTask('${task.id}')" title="${I18n.t('undo')}">
                <i class="fa-solid fa-rotate-left"></i>
              </button>
              <button class="task-btn delete" onclick="deleteTask('${task.id}')" title="${I18n.t('delete')}">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
          ${hasNotes ? '<div class="task-notes-preview">' + (task.notes?.substring(0, 100) || '') + (task.notes && task.notes.length > 100 ? '...' : '') + '</div>' : ''}
          <div class="task-stats">
            <span>🍅 ${task.pomodorosUsed}/${task.estimatedPomodoros}</span>
          </div>
          <div class="completed-badge"><i class="fa-solid fa-check"></i> ${I18n.t('completed')}</div>
        </div>
      `;
    }).join('');
  }
}

function updateGoalsPanel(): void {
  const activeGoals = GoalManager.getActiveGoals();
  const completedGoals = GoalManager.getCompletedGoals();
  const activeGoalId = GoalManager.getActiveGoalId();
  const goalList = document.getElementById('goal-list')!;
  const completedGoalList = document.getElementById('completed-goal-list')!;
  
  // Update active goals
  if (activeGoals.length === 0) {
    goalList.innerHTML = `<div class="empty-state"><i class="fa-solid fa-bullseye"></i><p>${I18n.t('noGoalsYet')}</p></div>`;
  } else {
    goalList.innerHTML = activeGoals.map(goal => {
      const progress = GoalManager.getProgressPercentage(goal.id);
      const isActive = goal.id === activeGoalId;
      
      return `
        <div class="goal-item ${isActive ? 'active-goal' : ''}" data-goal-id="${goal.id}" onclick="setActiveGoal('${goal.id}', event)">
          <div class="goal-header">
            <h4>${goal.title}</h4>
            <div class="goal-actions">
              <button class="goal-btn edit" onclick="event.stopPropagation(); editGoal('${goal.id}')" title="${I18n.t('edit')}">
                <i class="fa-solid fa-edit"></i>
              </button>
              <button class="goal-btn delete" onclick="event.stopPropagation(); deleteGoal('${goal.id}')" title="${I18n.t('delete')}">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
          <div class="goal-progress-bar">
            <div class="goal-progress-fill" style="width: ${progress}%"></div>
          </div>
          <div class="goal-stats">
            <span>${goal.current}/${goal.target} ${I18n.t('pomodoros')}</span>
          </div>
          ${isActive ? '<div class="active-goal-badge"><i class="fa-solid fa-check-circle"></i> ' + I18n.t('activeGoal') + '</div>' : ''}
        </div>
      `;
    }).join('');
  }
  
  // Update completed goals
  if (completedGoals.length === 0) {
    completedGoalList.innerHTML = `<div class="empty-state"><i class="fa-solid fa-trophy"></i><p>Henüz tamamlanan hedef yok</p></div>`;
  } else {
    completedGoalList.innerHTML = completedGoals.map(goal => {
      const progress = 100; // Completed goals are always 100%
      const completedDate = goal.achievedAt ? new Date(goal.achievedAt).toLocaleDateString() : '';
      
      return `
        <div class="goal-item completed" data-goal-id="${goal.id}">
          <div class="goal-header">
            <h4><s>${goal.title}</s></h4>
            <div class="goal-actions">
              <button class="goal-btn edit" onclick="event.stopPropagation(); editGoal('${goal.id}')" title="${I18n.t('edit')}">
                <i class="fa-solid fa-edit"></i>
              </button>
              <button class="goal-btn delete" onclick="event.stopPropagation(); deleteGoal('${goal.id}')" title="${I18n.t('delete')}">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
          <div class="goal-progress-bar">
            <div class="goal-progress-fill" style="width: ${progress}%"></div>
          </div>
          <div class="goal-stats">
            <span>${goal.current}/${goal.target} ${I18n.t('pomodoros')}</span>
          </div>
          <div class="completed-badge">
            <i class="fa-solid fa-trophy"></i> ${I18n.t('goalAchieved')} - ${completedDate}
          </div>
        </div>
      `;
    }).join('');
  }
}

function updateSettingsPanel(): void {
  const settings = SettingsManager.getSettings();
  const notificationSettings = SettingsManager.getNotificationSettings();
  
  // Update form values
  (document.getElementById('pomodoro-duration') as HTMLInputElement).value = settings.pomodoroDuration.toString();
  (document.getElementById('short-break-duration') as HTMLInputElement).value = settings.shortBreakDuration.toString();
  (document.getElementById('long-break-duration') as HTMLInputElement).value = settings.longBreakDuration.toString();
  (document.getElementById('sound-enabled') as HTMLInputElement).checked = settings.soundEnabled;
  (document.getElementById('notifications-enabled') as HTMLInputElement).checked = settings.notificationsEnabled;
  (document.getElementById('volume-slider') as HTMLInputElement).value = notificationSettings.volume.toString();
  
  // Update theme selector
  updateThemeSelector();
}

function updateThemeSelector(): void {
  const themes = ThemeManager.getThemes();
  const currentTheme = ThemeManager.getCurrentTheme();
  const themeSelector = document.getElementById('theme-selector')!;
  
  themeSelector.innerHTML = themes.map(theme => `
    <div class="theme-option ${theme.id === currentTheme.id ? 'active' : ''}" 
         data-theme="${theme.id}" 
         style="background: ${theme.colors.primary}; color: ${theme.colors.text}">
      ${theme.name}
  </div>
  `).join('');
  
  // Add theme selection listeners
  themeSelector.querySelectorAll('.theme-option').forEach(option => {
    option.addEventListener('click', () => {
      const themeId = option.getAttribute('data-theme')!;
      ThemeManager.setTheme(themeId);
      SettingsManager.setTheme(themeId);
      updateThemeSelector();
    });
  });
}

function setupSettingsListeners(): void {
  // Duration settings
  document.getElementById('pomodoro-duration')?.addEventListener('change', (e) => {
    const input = e.target as HTMLInputElement;
    const value = parseInt(input.value);
    if (isNaN(value) || value < 1 || value > 60) {
      Toast.error(I18n.t('pomodoroDurationError'));
      input.value = SettingsManager.getPomodoroDuration().toString();
      return;
    }
    SettingsManager.setPomodoroDuration(value);
    TimerManager.updateSettings();
    updateTimerDisplay();
    Toast.success(I18n.t('settingsUpdated'));
  });

  document.getElementById('short-break-duration')?.addEventListener('change', (e) => {
    const input = e.target as HTMLInputElement;
    const value = parseInt(input.value);
    if (isNaN(value) || value < 1 || value > 30) {
      Toast.error(I18n.t('shortBreakDurationError'));
      input.value = SettingsManager.getShortBreakDuration().toString();
      return;
    }
    SettingsManager.setShortBreakDuration(value);
    TimerManager.updateSettings();
    updateTimerDisplay();
    Toast.success(I18n.t('settingsUpdated'));
  });

  document.getElementById('long-break-duration')?.addEventListener('change', (e) => {
    const input = e.target as HTMLInputElement;
    const value = parseInt(input.value);
    if (isNaN(value) || value < 1 || value > 60) {
      Toast.error(I18n.t('longBreakDurationError'));
      input.value = SettingsManager.getLongBreakDuration().toString();
      return;
    }
    SettingsManager.setLongBreakDuration(value);
    TimerManager.updateSettings();
    updateTimerDisplay();
    Toast.success(I18n.t('settingsUpdated'));
  });
  
  // Sound settings
  document.getElementById('sound-enabled')?.addEventListener('change', (e) => {
    const enabled = (e.target as HTMLInputElement).checked;
    SettingsManager.setSoundEnabled(enabled);
  });
  
  document.getElementById('notifications-enabled')?.addEventListener('change', (e) => {
    const enabled = (e.target as HTMLInputElement).checked;
    SettingsManager.setNotificationsEnabled(enabled);
  });
  
  document.getElementById('volume-slider')?.addEventListener('input', (e) => {
    const volume = parseFloat((e.target as HTMLInputElement).value);
    SettingsManager.setVolume(volume);
  });
  
  // Language selector
  document.getElementById('language-selector')?.addEventListener('change', (e) => {
    const language = (e.target as HTMLSelectElement).value;
    I18n.setLanguage(language);
    SettingsManager.setLanguage(language);
  });

  // Backup & Restore
  document.getElementById('export-backup-btn')?.addEventListener('click', () => {
    BackupManager.exportBackup();
    alert(I18n.t('backupExported') || 'Yedek başarıyla indirildi!');
  });

  document.getElementById('import-backup-btn')?.addEventListener('click', () => {
    const input = document.getElementById('import-backup-input') as HTMLInputElement;
    input?.click();
  });

  document.getElementById('import-backup-input')?.addEventListener('change', async (e) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const result = await BackupManager.importBackup(file);

      if (result.success) {
        if (confirm(result.message + '\n\n' + I18n.t('reloadPageConfirm'))) {
          window.location.reload();
        }
      } else {
        alert(result.message);
      }

      // Reset input
      input.value = '';
    }
  });

  // Reset settings button
  document.getElementById('reset-settings-btn')?.addEventListener('click', () => {
    if (confirm(I18n.t('resetSettingsConfirm'))) {
      SettingsManager.resetToDefaults();
      TimerManager.updateSettings();
      updateSettingsPanel();
      updateUI();
    }
  });

  // Test sound button
  document.getElementById('test-sound-btn')?.addEventListener('click', () => {
    // Force enable audio on user interaction
    AudioManager.enableAudio();
    const currentMode = TimerManager.getMode();
    if (currentMode === 'pomodoro') {
      AudioManager.playWorkSound();
    } else {
      AudioManager.playBreakSound();
    }
  });
}

// Task management functions
let currentCategoryFilter = 'all';
let currentSearchQuery = '';
let currentEditingTaskId: string | null = null;

function openTaskNotes(taskId: string): void {
  const task = TaskManager.getTask(taskId);
  if (!task) return;
  
  currentEditingTaskId = taskId;
  const modal = document.getElementById('notes-modal');
  const textarea = document.getElementById('task-notes-textarea') as HTMLTextAreaElement;
  
  if (modal && textarea) {
    textarea.value = task.notes || '';
    modal.classList.add('active');
    document.querySelector('.shadowBg')?.classList.add('active');
    setTimeout(() => textarea.focus(), 100);
  }
}

function closeNotesModal(): void {
  const modal = document.getElementById('notes-modal');
  modal?.classList.remove('active');
  document.querySelector('.shadowBg')?.classList.remove('active');
  currentEditingTaskId = null;
}

function saveTaskNotes(): void {
  if (!currentEditingTaskId) return;
  
  const textarea = document.getElementById('task-notes-textarea') as HTMLTextAreaElement;
  const notes = textarea.value.trim();
  
  TaskManager.updateTask(currentEditingTaskId, { notes });
  closeNotesModal();
  updateTasksPanel();
}

function openTaskHistory(taskId: string): void {
  const task = TaskManager.getTask(taskId);
  if (!task) return;
  
  const modal = document.getElementById('history-modal');
  const historyList = document.getElementById('history-list');
  
  if (modal && historyList) {
    const history = task.pomodoroHistory || [];
    
    if (history.length === 0) {
      historyList.innerHTML = `<div class="empty-state"><i class="fa-solid fa-clock"></i><p>${I18n.t('noHistory')}</p></div>`;
    } else {
      historyList.innerHTML = history.map((entry, index) => {
        const date = new Date(entry.completedAt);
        const dateStr = date.toLocaleDateString();
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        return `
          <div class="history-item">
            <div class="history-icon">🍅</div>
            <div class="history-details">
              <div class="history-number">Pomodoro #${index + 1}</div>
              <div class="history-time">${dateStr} - ${timeStr}</div>
              <div class="history-duration">${entry.duration} ${I18n.t('minutes')}</div>
            </div>
          </div>
        `;
      }).reverse().join('');
    }
    
    modal.classList.add('active');
    document.querySelector('.shadowBg')?.classList.add('active');
  }
}

function closeHistoryModal(): void {
  const modal = document.getElementById('history-modal');
  modal?.classList.remove('active');
  document.querySelector('.shadowBg')?.classList.remove('active');
}

function moveTaskUp(taskId: string): void {
  const tasks = TaskManager.getActiveTasks();
  const index = tasks.findIndex(t => t.id === taskId);
  if (index > 0) {
    // Swap with previous task
    const allTasks = TaskManager.getTasks();
    const taskIndex = allTasks.findIndex(t => t.id === taskId);
    const prevTaskId = tasks[index - 1].id;
    const prevTaskIndex = allTasks.findIndex(t => t.id === prevTaskId);
    
    [allTasks[taskIndex], allTasks[prevTaskIndex]] = [allTasks[prevTaskIndex], allTasks[taskIndex]];
    
    // Force update storage
    (TaskManager as any).tasks = allTasks;
    (TaskManager as any).save();
    updateTasksPanel();
  }
}

function moveTaskDown(taskId: string): void {
  const tasks = TaskManager.getActiveTasks();
  const index = tasks.findIndex(t => t.id === taskId);
  if (index < tasks.length - 1 && index !== -1) {
    // Swap with next task
    const allTasks = TaskManager.getTasks();
    const taskIndex = allTasks.findIndex(t => t.id === taskId);
    const nextTaskId = tasks[index + 1].id;
    const nextTaskIndex = allTasks.findIndex(t => t.id === nextTaskId);
    
    [allTasks[taskIndex], allTasks[nextTaskIndex]] = [allTasks[nextTaskIndex], allTasks[taskIndex]];
    
    // Force update storage
    (TaskManager as any).tasks = allTasks;
    (TaskManager as any).save();
    updateTasksPanel();
  }
}

function completeAllTasks(): void {
  const activeTasks = TaskManager.getActiveTasks();
  if (activeTasks.length === 0) return;
  
  if (confirm(`${activeTasks.length} görevi tamamlamak istediğinizden emin misiniz?`)) {
    activeTasks.forEach(task => {
      TaskManager.completeTask(task.id);
    });
    updateTasksPanel();
    updateUI();
  }
}

function deleteCompletedTasks(): void {
  const completedTasks = TaskManager.getCompletedTasks();
  if (completedTasks.length === 0) return;
  
  if (confirm(`${completedTasks.length} tamamlanan görevi silmek istediğinizden emin misiniz?`)) {
    completedTasks.forEach(task => {
      TaskManager.deleteTask(task.id);
    });
    updateTasksPanel();
    updateUI();
  }
}

// Make functions global
(window as any).openTaskNotes = openTaskNotes;
(window as any).openTaskHistory = openTaskHistory;
(window as any).moveTaskUp = moveTaskUp;
(window as any).moveTaskDown = moveTaskDown;
(window as any).completeAllTasks = completeAllTasks;
(window as any).deleteCompletedTasks = deleteCompletedTasks;

function addTask(): void {
  const titleInput = document.getElementById('task-input') as HTMLInputElement;
  const pomodorosInput = document.getElementById('task-pomodoros') as HTMLInputElement;
  const priorityInput = document.getElementById('task-priority') as HTMLSelectElement;
  const categoryInput = document.getElementById('task-category') as HTMLSelectElement;
  const goalInput = document.getElementById('task-goal') as HTMLSelectElement;
  const recurringInput = document.getElementById('task-recurring') as HTMLInputElement;
  const title = titleInput.value.trim();
  const pomodoros = parseInt(pomodorosInput.value);
  const priority = priorityInput.value as 'high' | 'medium' | 'low';
  const category = categoryInput.value;
  const goalId = goalInput.value || undefined;
  const recurring = recurringInput.checked;

  if (!title) {
    Toast.warning(I18n.t('taskTitleRequired'));
    titleInput.focus();
    return;
  }

  if (isNaN(pomodoros) || pomodoros < 1 || pomodoros > 20) {
    Toast.error(I18n.t('pomodoroCountError'));
    pomodorosInput.focus();
    return;
  }

  if (title) {
    const task = TaskManager.addTask(title, undefined, pomodoros);
    if (task) {
      const recurringData = recurring ? { enabled: true, frequency: 'daily' as const } : undefined;
      TaskManager.updateTask(task.id, { priority, category, recurring: recurringData });
      
      // Link task to goal if selected
      if (goalId) {
        const goal = GoalManager.getGoal(goalId);
        if (goal) {
          const linkedTasks = goal.linkedTaskIds || [];
          linkedTasks.push(task.id);
          GoalManager.updateGoal(goalId, { linkedTaskIds: linkedTasks });
        }
      }
    }
    titleInput.value = '';
    pomodorosInput.value = '1';
    priorityInput.value = 'medium';
    categoryInput.value = 'work';
    goalInput.value = '';
    recurringInput.checked = false;
    updateTasksPanel();
    updateGoalsPanel();
    updateUI();
  }
}

// Global functions for task management (called from HTML)
(window as any).completeTask = (taskId: string): void => {
  TaskManager.completeTask(taskId);
  updateTasksPanel();
  updateUI();
};

(window as any).deleteTask = (taskId: string): void => {
  TaskManager.deleteTask(taskId);
  updateTasksPanel();
  updateUI();
};

// Goal management functions
function addGoal(): void {
  const titleInput = document.getElementById('goal-input') as HTMLInputElement;
  const targetInput = document.getElementById('goal-target') as HTMLInputElement;

  const title = titleInput.value.trim();
  const target = parseInt(targetInput.value);

  if (!title) {
    Toast.warning(I18n.t('goalTitleRequired'));
    titleInput.focus();
    return;
  }

  if (isNaN(target) || target < 1 || target > 50) {
    Toast.error(I18n.t('goalTargetError'));
    targetInput.focus();
    return;
  }

  GoalManager.createGoal(title, target, 'daily');
  titleInput.value = '';
  targetInput.value = '5';
  updateGoalsPanel();
  updateUI();
  Toast.success(I18n.t('goalAddedSuccessfully'));
}

// Task management functions (exposed to window for onclick handlers)
(window as any).setActiveTask = function(taskId: string, event?: Event): void {
  if (event) {
    event.stopPropagation();
  }
  const currentActive = TaskManager.getActiveTaskId();
  if (currentActive === taskId) {
    // Deselect if clicking the same task
    TaskManager.setActiveTask(null);
  } else {
    TaskManager.setActiveTask(taskId);
  }
  updateTasksPanel();
  updateUI(); // Update active task display
};

(window as any).completeTask = function(taskId: string): void {
  TaskManager.completeTask(taskId);
  updateTasksPanel();
  updateGoalsPanel(); // Goals might be affected
  
  // Ask if user wants to move to next task
  const activeTasks = TaskManager.getActiveTasks();
  if (activeTasks.length > 0) {
    setTimeout(() => {
      if (confirm(I18n.t('nextTaskQuestion'))) {
        // Set the first active task as new active task
        TaskManager.setActiveTask(activeTasks[0].id);
        updateTasksPanel();
        updateUI();
      }
    }, 1000);
  }
};

(window as any).uncompleteTask = function(taskId: string): void {
  TaskManager.uncompleteTask(taskId);
  updateTasksPanel();
};

(window as any).deleteTask = function(taskId: string): void {
  if (confirm(I18n.t('confirmDeleteTask'))) {
    TaskManager.deleteTask(taskId);
    updateTasksPanel();
  }
};

(window as any).editTask = function(taskId: string): void {
  const task = TaskManager.getTask(taskId);
  if (!task) return;

  const title = prompt(I18n.t('taskTitle'), task.title);
  if (!title || title.trim() === '') return;

  const pomodorosStr = prompt(I18n.t('estimatedPomodoros'), task.estimatedPomodoros.toString());
  if (!pomodorosStr) return;
  
  const pomodoros = parseInt(pomodorosStr);
  if (isNaN(pomodoros) || pomodoros < 1 || pomodoros > 20) {
    Toast.error(I18n.t('pomodoroCountError'));
    return;
  }

  const notes = prompt(I18n.t('notes') + ' (Optional)', task.notes || '');
  if (notes === null) return;

  const success = TaskManager.editTask(taskId, title, pomodoros, notes, task.goalId || undefined);
  if (success) {
    updateTasksPanel();
    updateUI();
    Toast.success('Task updated successfully!');
  }
};

(window as any).editGoal = function(goalId: string): void {
  const goal = GoalManager.getGoal(goalId);
  if (!goal) return;

  const title = prompt(I18n.t('goalTitle'), goal.title);
  if (!title || title.trim() === '') return;

  const targetStr = prompt(I18n.t('targetPomodoros'), goal.target.toString());
  if (!targetStr) return;
  
  const target = parseInt(targetStr);
  if (isNaN(target) || target < 1 || target > 50) {
    Toast.error(I18n.t('goalTargetError'));
    return;
  }

  const period = confirm('Is this a daily goal? (OK for daily, Cancel for weekly)') ? 'daily' : 'weekly';

  const success = GoalManager.editGoal(goalId, title, target, period);
  if (success) {
    updateGoalsPanel();
    updateUI();
    Toast.success('Goal updated successfully!');
  }
};

// Goal management functions (exposed to window for onclick handlers)
(window as any).setActiveGoal = function(goalId: string, event?: Event): void {
  if (event) {
    event.stopPropagation();
  }
  const currentActive = GoalManager.getActiveGoalId();
  if (currentActive === goalId) {
    // Deselect if clicking the same goal
    GoalManager.setActiveGoal(null);
  } else {
    GoalManager.setActiveGoal(goalId);
  }
  updateGoalsPanel();
  updateUI(); // Update main screen to show active goal
};

(window as any).deleteGoal = function(goalId: string): void {
  if (confirm(I18n.t('confirmDeleteGoal'))) {
    GoalManager.deleteGoal(goalId);
    updateGoalsPanel();
  }
};

// Utility functions
function formatTime(minutes: number): string {
  // Negatif değerleri 0'a çevir
  const safeMins = Math.max(0, minutes);
  const hours = Math.floor(safeMins / 60);
  const mins = Math.floor(safeMins % 60);
  return `${hours}h ${mins}m`;
}

function updateUI(): void {
  // Update cycle count
  const cycleCount = document.getElementById('cycle-count');
  if (cycleCount) {
    cycleCount.textContent = TimerManager.getCycle().toString();
  }
  
  // Update today's pomodoro count
  const todaySessions = StatisticsManager.getTodaySessions();
  const todayCount = document.getElementById('today-count');
  if (todayCount) {
    todayCount.textContent = todaySessions.length.toString();
  }
  
  // Update active task display
  const activeTask = TaskManager.getActiveTask();
  const activeTaskDisplay = document.getElementById('active-task-display');
  const activeTaskText = document.getElementById('active-task-text');
  
  if (activeTask && activeTaskDisplay && activeTaskText) {
    activeTaskText.textContent = `${I18n.t('activeTask')}: ${activeTask.title} (${activeTask.pomodorosUsed}/${activeTask.estimatedPomodoros})`;
    activeTaskDisplay.style.display = 'flex';
  } else if (activeTaskDisplay) {
    activeTaskDisplay.style.display = 'none';
  }
  
  // Update active goal display
  const activeGoal = GoalManager.getActiveGoal();
  const activeGoalDisplay = document.getElementById('active-goal-display');
  const activeGoalText = document.getElementById('active-goal-text');
  
  if (activeGoal && activeGoalDisplay && activeGoalText) {
    activeGoalText.textContent = `${I18n.t('activeGoal')}: ${activeGoal.title} (${activeGoal.current}/${activeGoal.target})`;
    activeGoalDisplay.style.display = 'flex';
  } else if (activeGoalDisplay) {
    activeGoalDisplay.style.display = 'none';
  }
  
  // Update timer display with current settings
  updateTimerDisplay();
  
  // Update mode buttons
  updateModeButtons(TimerManager.getMode());
  
  // Update timer info
  updateTimerInfo(TimerManager.getMode());
  
  // Update language selector
  const languageSelector = document.getElementById('language-selector') as HTMLSelectElement;
  if (languageSelector) {
    languageSelector.value = I18n.getLanguage();
  }
  
  // Update i18n
  I18n.updateUI();
}

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Initialize the app when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}