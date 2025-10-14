# 🍅 Pomodoro Timer

<div align="center">

![Pomodoro Timer](demo.png)

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://sinansarikaya.github.io/javascript-pomodoro-timer/)
[![GitHub](https://img.shields.io/badge/github-repository-blue?style=for-the-badge&logo=github)](https://github.com/sinansarikaya/javascript-pomodoro-timer)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

A modern, powerful, and user-friendly Pomodoro timer application built with TypeScript and Vite. Boost your productivity with smart task management, beautiful themes, and detailed statistics.

[🚀 Live Demo](https://sinansarikaya.github.io/javascript-pomodoro-timer/) • [📖 Documentation](#-documentation) • [✨ Features](#-features) • [🛠️ Installation](#️-installation)

</div>

---

## ✨ Features

### ⏱️ Smart Timer System
- **Automatic Cycling**: Seamless Pomodoro → Short Break → Pomodoro cycle
- **Long Breaks**: Automatic long break after every 4 pomodoros
- **Customizable Durations**: Pomodoro (1-60 min), Short Break (1-30 min), Long Break (1-60 min)
- **Visual Countdown**: Elegant circular progress bar with smooth animations
- **Sound Notifications**: Audio alerts for session completion
- **Desktop Notifications**: Browser notifications to keep you informed
- **Auto-start Options**: Configure auto-start for breaks and pomodoros

### 📋 Advanced Task Management
- **Rich Task Creation**: Add tasks with title, category, priority, and pomodoro count
- **5 Categories**: Work, Personal, Learning, Health, Other
- **3 Priority Levels**: High, Medium, Low with color coding
- **Recurring Tasks**: Set daily recurring tasks
- **Task Notes**: Add detailed notes to any task
- **Active Task Tracking**: Mark and track your current working task
- **Progress Monitoring**: Real-time completion percentage for each task
- **Pomodoro History**: Track pomodoros spent on each task
- **Search & Filter**: Find tasks quickly with search and category filters
- **Bulk Operations**: Complete all or delete completed tasks in one click
- **Task Archive**: Keep your task list clean with automatic archiving

### 🎯 Goal System
- **Daily Goals**: Set daily pomodoro targets to stay motivated
- **Real-time Progress**: Live progress tracking with visual indicators
- **Task Linking**: Connect tasks to specific goals
- **Active Goal Display**: See your active goal on the main screen
- **Auto Updates**: Goals update automatically as you complete pomodoros
- **Goal History**: Track your goal achievements over time

### 📊 Comprehensive Statistics
- **Total Pomodoros**: Lifetime pomodoro count
- **Total Time**: Cumulative focused work time
- **Streak Tracking**: Consecutive working days counter
- **Weekly Stats**: This week's pomodoro count
- **7-Day Activity Chart**: Visual weekly activity graph
- **Task Progress**: Overall task completion percentage
- **Category Breakdown**: See which categories you focus on most
- **Time Distribution**: Understand your productivity patterns

### 🎨 Beautiful Theme System
**15+ Pre-built Themes**:
- 🍅 Classic (Softened colors)
- 🌙 Midnight (Dark blue)
- ☀️ Daylight (Clean white)
- 🌊 Ocean (Deep blue)
- 🌲 Forest (Fresh green)
- 🌅 Sunset (Warm pastels)
- 💜 Purple Dream
- 🎯 Focus Mode (Professional dark)
- ☕ Warm Coffee (Cozy brown)
- 🍃 Mint Fresh (Cool mint)
- 💗 Pink Blossom (Soft pastels)
- 🌹 Rose Garden (Elegant rose)
- 💜 Lavender Dream
- ⚡ Neon Night (Futuristic)
- 🌿 Nature (Vibrant green)
- 🤖 Cyberpunk (Tech style)

**Theme Features**:
- Dynamic color system with CSS variables
- Automatic light/dark mode adaptation
- Smart contrast management for accessibility
- Input and button colors adapt to theme
- Smooth theme transitions

### 💾 Backup & Restore System
- **Complete Backup**: All data in a single JSON file
  - Active and archived tasks
  - Goals and progress
  - Statistics and streaks
  - Settings and preferences
  - Theme selections
  - Timer state
  - Custom themes
- **Easy Export/Import**: One-click backup and restore
- **Auto-save**: Last 5 backups automatically saved
- **Validation**: Built-in backup file validation
- **Version Control**: Timestamped backups for tracking

### 🔔 Modern Notification System
- **Toast Notifications**: Animated, non-intrusive messages
  - ✓ Success (green) - Actions completed
  - ✗ Error (red) - Something went wrong
  - ⚠ Warning (orange) - Important notices
  - ℹ Info (blue) - Helpful information
- **Auto-dismiss**: Messages disappear after 3 seconds
- **Manual Close**: Close button for instant dismissal
- **Mobile Friendly**: Responsive design for all devices
- **Smart Positioning**: Optimal placement for readability

### ✅ Input Validation
- **Number-only Fields**: Prevents non-numeric input
- **Range Validation**: Min/Max value enforcement
- **Clear Error Messages**: User-friendly validation feedback
- **Auto-focus**: Automatically focus on error fields
- **Negative Value Protection**: No negative time values anywhere
- **Real-time Validation**: Instant feedback as you type

### 🌍 Multi-language Support
- 🇹🇷 Turkish
- 🇬🇧 English
- Easily extensible for more languages

### 🎮 Excellent User Experience
- **Responsive Design**: Perfect on mobile, tablet, and desktop
- **Keyboard Shortcuts**: ESC to close modals, Space to pause/play
- **Click Outside**: Close panels by clicking outside
- **Panel Persistence**: Panels stay open when selecting tasks/goals
- **Smooth Animations**: Polished transitions and micro-interactions
- **Modern UI**: Clean, minimalist interface with glassmorphism effects
- **Card Layout**: Beautiful card-based timer display
- **Accessibility**: ARIA labels and keyboard navigation

---

## 🚀 Installation

### Prerequisites
- Node.js 18 or higher
- pnpm (recommended) or npm

### Quick Start

```bash
# Clone the repository
git clone https://github.com/sinansarikaya/javascript-pomodoro-timer.git
cd javascript-pomodoro-timer

# Install dependencies
pnpm install
# or
npm install

# Start development server
pnpm dev
# or
npm run dev

# Open in browser
http://localhost:5173
```

### Production Build

```bash
# Create optimized build
pnpm build
# or
npm run build

# Preview production build
pnpm preview
# or
npm run preview
```

### Deploy to GitHub Pages

```bash
# Build and deploy
pnpm build
git add dist -f
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages
```

---

## 📁 Project Structure

```
pomodoro-timer/
├── src/
│   ├── modules/              # Core modules
│   │   ├── timer.ts         # Timer management
│   │   ├── tasks.ts         # Task management
│   │   ├── goals.ts         # Goal management
│   │   ├── statistics.ts    # Statistics tracking
│   │   ├── themes.ts        # Theme management
│   │   └── settings.ts      # Settings management
│   ├── utils/               # Utility functions
│   │   ├── audio.ts         # Audio management
│   │   ├── storage.ts       # LocalStorage wrapper
│   │   ├── backup.ts        # Backup/restore system
│   │   ├── toast.ts         # Toast notifications
│   │   └── i18n.ts          # Internationalization
│   ├── types/               # TypeScript types
│   │   └── index.ts         # Type definitions
│   ├── main.ts              # Application entry point
│   ├── style.css            # Base styles
│   └── modern-styles.css    # Modern UI styles
├── public/                  # Static assets
│   ├── sounds/              # Audio files
│   └── favicon.svg          # App icon
├── index.html               # Main HTML file
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite configuration
└── README.md                # This file
```

---

## 🎯 Usage Guide

### Starting the Timer
1. Select your desired mode (Pomodoro/Short Break/Long Break)
2. Click the Play button in the center
3. Timer will automatically cycle through modes
4. Work during Pomodoro, rest during breaks

### Adding Tasks
1. Click the Tasks icon in the top-right menu
2. Enter task title
3. Select category, priority, and pomodoro count
4. Optionally add notes
5. Click "Add" button
6. Set as active to track pomodoros for this task

### Creating Goals
1. Click the Goals icon in the top-right menu
2. Enter goal title
3. Set daily pomodoro target (1-50)
4. Click "Add" button
5. Set as active to track progress
6. Goals automatically update as you complete pomodoros

### Backing Up Data
1. Click the Settings icon
2. Scroll to "Backup & Restore" section
3. Click "Download Backup" to export data
4. Click "Upload Backup" to restore from file
5. Backups include all tasks, goals, stats, and settings

### Changing Themes
1. Open Settings panel
2. Navigate to Theme section
3. Click any theme to apply instantly
4. Theme preference is automatically saved

### Viewing Statistics
1. Click the Statistics icon
2. View total pomodoros, time, and streak
3. Check weekly activity chart
4. Monitor task completion progress

---

## 🛠️ Technologies

<div align="center">

| Technology | Purpose |
|------------|---------|
| **TypeScript** | Type-safe development |
| **Vite** | Fast build tool and dev server |
| **CSS3** | Modern styling with custom properties |
| **LocalStorage** | Client-side data persistence |
| **Web Audio API** | Sound notifications |
| **Notification API** | Desktop notifications |
| **Font Awesome** | Beautiful icons |
| **Lordicon** | Animated icons |

</div>

---

## 📊 Feature Checklist

| Feature | Status | Description |
|---------|--------|-------------|
| ⏱️ Timer System | ✅ | Pomodoro, short break, long break |
| 🔄 Auto Cycling | ✅ | Automatic mode transitions |
| 📋 Task Management | ✅ | Full CRUD with categories |
| 🎯 Goal System | ✅ | Daily targets and tracking |
| 📊 Statistics | ✅ | Comprehensive analytics |
| 🎨 15+ Themes | ✅ | Beautiful pre-built themes |
| 💾 Backup/Restore | ✅ | Full data export/import |
| 🔔 Toast Notifications | ✅ | Modern alert system |
| ✅ Input Validation | ✅ | Smart form validation |
| 🌍 Multi-language | ✅ | Turkish & English |
| 📱 Responsive Design | ✅ | Mobile, tablet, desktop |
| 🔊 Sound Alerts | ✅ | Audio notifications |
| 🖥️ Desktop Notifications | ✅ | Browser notifications |
| 🔁 Recurring Tasks | ✅ | Daily task repetition |
| 📈 Progress Tracking | ✅ | Real-time progress bars |
| 🔍 Search & Filter | ✅ | Advanced task filtering |
| 📝 Task Notes | ✅ | Detailed note system |
| 🎴 Card UI | ✅ | Modern card-based layout |
| 🍃 Glassmorphism | ✅ | Beautiful glass effects |

---

## 🔒 Privacy & Security

- ✅ **100% Local**: All data stored in browser's LocalStorage
- ✅ **No Server**: No data sent to any external server
- ✅ **Offline First**: Works completely offline
- ✅ **Your Control**: You own and control all your data
- ✅ **No Tracking**: No analytics or tracking scripts
- ✅ **Open Source**: Transparent and auditable code

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain consistent code style
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation if needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Sinan Sarıkaya**

- GitHub: [@sinansarikaya](https://github.com/sinansarikaya)
- Project: [JavaScript Pomodoro Timer](https://github.com/sinansarikaya/javascript-pomodoro-timer)
- Live Demo: [Try it now!](https://sinansarikaya.github.io/javascript-pomodoro-timer/)

---

## 🙏 Acknowledgments

- [Font Awesome](https://fontawesome.com/) - Icon library
- [Lordicon](https://lordicon.com/) - Animated icons
- [Vite](https://vitejs.dev/) - Next generation build tool
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with types
- [Pomodoro Technique](https://francescocirillo.com/pages/pomodoro-technique) - Time management method

---

## 📞 Contact & Support

- 🐛 **Bug Reports**: [Open an issue](https://github.com/sinansarikaya/javascript-pomodoro-timer/issues)
- 💡 **Feature Requests**: [Start a discussion](https://github.com/sinansarikaya/javascript-pomodoro-timer/discussions)
- 📧 **Email**: Contact through GitHub

---

## 🗺️ Roadmap

### Version 2.0 (Planned)
- [ ] Cloud sync support
- [ ] Team collaboration features
- [ ] Custom sound uploads
- [ ] Pomodoro technique tutorials
- [ ] Export statistics as PDF/CSV
- [ ] Browser extension
- [ ] Mobile app (React Native)
- [ ] Dark mode auto-switch based on time
- [ ] Integration with calendar apps
- [ ] AI-powered task suggestions

---

## 📈 Version History

### v2.0.0 (Current)
- 🎨 Complete UI/UX redesign with modern card layout
- 🎨 Glassmorphism effects and smooth animations
- 🎨 Improved header with clean menu design
- 🌅 Refined Sunset theme with softer colors
- 🌹 Refined Rose Garden theme with pastel tones
- 🎯 Enhanced button styles and interactions
- 📱 Better responsive design for all devices
- ⚡ Performance optimizations
- 🐛 Bug fixes and stability improvements

### v1.0.0
- ⏱️ Initial release
- 📋 Task management system
- 🎯 Goal tracking
- 📊 Statistics dashboard
- 🎨 15+ themes
- 💾 Backup/restore functionality

---

## ⭐ Star History

## 📦 Deployment

### GitHub Pages
```bash
# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Manual Deployment
1. Run `npm run build` to create the `dist` folder
2. Push the `dist` folder contents to the `gh-pages` branch
3. Enable GitHub Pages in repository settings

---

If you find this project useful, please consider giving it a star! It helps others discover the project and motivates continued development.

<div align="center">

[![Star History Chart](https://api.star-history.com/svg?repos=sinansarikaya/javascript-pomodoro-timer&type=Date)](https://star-history.com/#sinansarikaya/javascript-pomodoro-timer&Date)

</div>

---

<div align="center">

**Made with ❤️ by Sinan Sarıkaya**

[⬆ Back to Top](#-pomodoro-timer)

</div>
