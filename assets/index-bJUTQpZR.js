(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const d of i.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&a(d)}).observe(document,{childList:!0,subtree:!0});function e(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(o){if(o.ep)return;o.ep=!0;const i=e(o);fetch(o.href,i)}})();class b{static workSound;static breakSound;static volume=.5;static initialized=!1;static userInteracted=!1;static init(){if(!this.initialized)try{this.workSound=new Audio,this.breakSound=new Audio,this.workSound.src="/work.mp3",this.breakSound.src="/break.mp3",this.workSound.volume=this.volume,this.breakSound.volume=this.volume,this.workSound.preload="auto",this.breakSound.preload="auto",this.workSound.autoplay=!1,this.breakSound.autoplay=!1,this.workSound.load(),this.breakSound.load(),this.addUserInteractionListener(),this.initialized=!0,console.log("Audio manager initialized successfully")}catch(t){console.error("Failed to initialize audio:",t)}}static addUserInteractionListener(){const t=()=>{this.userInteracted=!0,console.log("User interaction detected, audio enabled"),document.removeEventListener("click",t),document.removeEventListener("keydown",t),document.removeEventListener("touchstart",t)};document.addEventListener("click",t),document.addEventListener("keydown",t),document.addEventListener("touchstart",t)}static playWorkSound(){if(this.initialized||this.init(),!this.userInteracted){console.log("Audio not enabled yet, user interaction required");return}this.workSound&&(this.workSound.currentTime=0,this.workSound.play().catch(t=>{console.log("Work sound play failed:",t),this.enableAudioContext(),this.playSystemBeep()}))}static playBreakSound(){if(this.initialized||this.init(),!this.userInteracted){console.log("Audio not enabled yet, user interaction required");return}this.breakSound&&(this.breakSound.currentTime=0,this.breakSound.play().catch(t=>{console.log("Break sound play failed:",t),this.enableAudioContext(),this.playSystemBeep()}))}static enableAudioContext(){if(typeof AudioContext<"u"){const t=new AudioContext;t.state==="suspended"&&t.resume().then(()=>{console.log("Audio context resumed")})}}static playSystemBeep(){try{const t=new(window.AudioContext||window.webkitAudioContext),e=t.createOscillator(),a=t.createGain();e.connect(a),a.connect(t.destination),e.frequency.setValueAtTime(800,t.currentTime),a.gain.setValueAtTime(this.volume*.3,t.currentTime),a.gain.exponentialRampToValueAtTime(.01,t.currentTime+.5),e.start(t.currentTime),e.stop(t.currentTime+.5),console.log("System beep played as fallback")}catch(t){console.log("System beep failed:",t)}}static setVolume(t){this.volume=Math.max(0,Math.min(1,t)),this.workSound&&(this.workSound.volume=this.volume),this.breakSound&&(this.breakSound.volume=this.volume)}static getVolume(){return this.volume}static enableAudio(){this.userInteracted=!0,console.log("Audio manually enabled")}}class l{static prefix="pomodoro_";static set(t,e){try{localStorage.setItem(this.prefix+t,JSON.stringify(e))}catch(a){console.error("Error saving to localStorage:",a)}}static get(t,e){try{const a=localStorage.getItem(this.prefix+t);return a?JSON.parse(a):e}catch(a){return console.error("Error reading from localStorage:",a),e}}static remove(t){try{localStorage.removeItem(this.prefix+t)}catch(e){console.error("Error removing from localStorage:",e)}}static clear(){try{Object.keys(localStorage).forEach(e=>{e.startsWith(this.prefix)&&localStorage.removeItem(e)})}catch(t){console.error("Error clearing localStorage:",t)}}}class S{static formatDate(t){return(typeof t=="string"?new Date(t):t).toISOString().split("T")[0]}static formatTime(t){return t.toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"})}static getWeekStart(t){const e=new Date(t),a=e.getDay(),o=e.getDate()-a+(a===0?-6:1);return new Date(e.setDate(o))}static getWeekEnd(t){const e=this.getWeekStart(t),a=new Date(e);return a.setDate(e.getDate()+6),a}static getWeekString(t){const e=this.getWeekStart(t),a=this.getWeekEnd(t);return`${this.formatDate(e)} - ${this.formatDate(a)}`}static isToday(t){const e=new Date;return this.formatDate(t)===this.formatDate(e)}static isThisWeek(t){const e=new Date,a=this.getWeekStart(e),o=this.getWeekEnd(e);return t>=a&&t<=o}static addDays(t,e){const a=new Date(t);return a.setDate(a.getDate()+e),a}}class B{static sessions=[];static dailyStats=[];static init(){const t=l.get("statistics",{});t.sessions&&t.dailyStats?(this.sessions=t.sessions,this.dailyStats=t.dailyStats):(this.sessions=l.get("sessions",[]),this.dailyStats=l.get("dailyStats",[]))}static addSession(t){this.sessions.push(t),this.updateDailyStats(t),this.save()}static getSessions(){return this.sessions}static getTodaySessions(){return this.sessions.filter(t=>S.isToday(new Date(t.startTime)))}static getWeekSessions(){return this.sessions.filter(t=>S.isThisWeek(new Date(t.startTime)))}static getDailyStats(){return this.dailyStats}static getTodayStats(){const t=S.formatDate(new Date);return this.dailyStats.find(e=>e.date===t)||null}static getWeeklyStats(){const t=new Map;return this.dailyStats.forEach(e=>{const a=new Date(e.date),o=S.getWeekString(a);t.has(o)||t.set(o,{week:o,pomodorosCompleted:0,totalTime:0,tasksCompleted:0,averagePerDay:0});const i=t.get(o);i.pomodorosCompleted+=e.pomodorosCompleted,i.totalTime+=e.totalTime,i.tasksCompleted+=e.tasksCompleted}),t.forEach(e=>{e.averagePerDay=Math.round(e.pomodorosCompleted/7*10)/10}),Array.from(t.values()).sort((e,a)=>new Date(e.week.split(" - ")[0]).getTime()-new Date(a.week.split(" - ")[0]).getTime())}static getTotalPomodoros(){return this.sessions.filter(t=>t.mode==="pomodoro"&&t.completed).length}static getTotalTime(){return this.sessions.filter(t=>t.completed).reduce((t,e)=>t+e.duration,0)}static getStreak(){const t=this.dailyStats.sort((o,i)=>new Date(i.date).getTime()-new Date(o.date).getTime());let e=0,a=new Date;for(const o of t){const i=new Date(o.date),d=Math.floor((a.getTime()-i.getTime())/(1e3*60*60*24));if(d===e&&o.pomodorosCompleted>0)e++;else if(d>e+1)break}return e}static updateDailyStats(t){const e=S.formatDate(new Date(t.startTime));let a=this.dailyStats.find(o=>o.date===e);a||(a={date:e,pomodorosCompleted:0,totalTime:0,tasksCompleted:0,goal:8},this.dailyStats.push(a)),t.completed&&(t.mode==="pomodoro"&&a.pomodorosCompleted++,a.totalTime+=t.duration)}static save(){l.set("statistics",{sessions:this.sessions,dailyStats:this.dailyStats}),l.set("sessions",this.sessions),l.set("dailyStats",this.dailyStats)}static clearData(){this.sessions=[],this.dailyStats=[],this.save()}}class k{static container=null;static init(){this.container||(this.container=document.createElement("div"),this.container.className="toast-container",document.body.appendChild(this.container))}static show(t,e="info",a=3e3){this.init();const o=document.createElement("div");o.className=`toast toast-${e}`;const i=this.getIcon(e);o.innerHTML=`
      <div class="toast-icon">${i}</div>
      <div class="toast-message">${t}</div>
      <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `,this.container.appendChild(o),setTimeout(()=>o.classList.add("toast-show"),10),setTimeout(()=>{o.classList.remove("toast-show"),setTimeout(()=>o.remove(),300)},a)}static success(t,e){this.show(t,"success",e)}static error(t,e){this.show(t,"error",e)}static warning(t,e){this.show(t,"warning",e)}static info(t,e){this.show(t,"info",e)}static getIcon(t){switch(t){case"success":return"✓";case"error":return"✕";case"warning":return"⚠";case"info":return"ℹ"}}}const V={tr:{pomodoro:"Pomodoro",shortBreak:"Kısa Mola",longBreak:"Uzun Mola",start:"Başlat",pause:"Duraklat",stop:"Durdur",reset:"Sıfırla",statistics:"İstatistikler",tasks:"Görevler",goals:"Hedefler",settings:"Ayarlar",help:"Yardım",youAreInPomodoroTime:"Pomodoro zamanındasınız",youAreInShortBreak:"Kısa moladasınız",youAreInLongBreak:"Uzun moladasınız",cycle:"Döngü",today:"Bugün",pomodoros:"pomodoro",totalPomodoros:"Toplam Pomodoro",totalTime:"Toplam Süre",streak:"Seri",thisWeek:"Bu Hafta",weeklyActivity:"Haftalık Aktivite",taskProgress:"Görev İlerlemesi",days:"gün",addNewTask:"Yeni görev ekle...",newTask:"Yeni Görev",estimatedPomodoros:"Tahmini Pomodoro",usedPomodoros:"Kullanılan Pomodoro",completed:"Tamamlandı",active:"Aktif",noTasksYet:"Henüz görev yok. Yukarıdan ekleyin!",noCompletedTasks:"Tamamlanan görev yok",complete:"Tamamla",delete:"Sil",undo:"Geri Al",confirmDeleteTask:"Bu görevi silmek istediğinizden emin misiniz?",confirmDeleteGoal:"Bu hedefi silmek istediğinizden emin misiniz?",activeTask:"Aktif Görev",high:"Yüksek",medium:"Orta",low:"Düşük",work:"İş",personal:"Kişisel",learning:"Öğrenme",health:"Sağlık",other:"Diğer",all:"Tümü",searchTasks:"Görevlerde ara...",noGoal:"Hedef Yok",notes:"Notlar",hasNotes:"Not var",addNote:"Not ekle",saveNote:"Notu Kaydet",cancel:"İptal",history:"Geçmiş",pomodoroHistory:"Pomodoro Geçmişi",noHistory:"Henüz pomodoro tamamlanmamış",completedOn:"Tamamlanma:",completeAll:"Tümünü Tamamla",deleteCompleted:"Tamamlananları Sil",recurringTask:"Tekrarlayan görev",moveUp:"Yukarı taşı",moveDown:"Aşağı taşı",addNewGoal:"Yeni hedef ekle...",goalName:"Hedef adı...",targetNumber:"Hedef sayısı",progress:"İlerleme",noGoalsYet:"Henüz hedef yok. Yukarıdan ekleyin!",goalAchieved:"Hedef Ulaşıldı!",activeGoal:"Aktif Hedef",timeSettings:"Zaman Ayarları",pomodoroDuration:"Pomodoro Süresi (dakika)",shortBreakDuration:"Kısa Mola (dakika)",longBreakDuration:"Uzun Mola (dakika)",longBreakInterval:"Uzun Mola Aralığı",theme:"Tema",soundAndNotifications:"Ses ve Bildirimler",soundEffects:"Ses efektleri",notifications:"Bildirimler",soundLevel:"Ses Seviyesi",autoStartBreaks:"Molaları otomatik başlat",autoStartPomodoros:"Pomodoroları otomatik başlat",language:"Dil",selectLanguage:"Dil Seçin",minutes:"dk",testSound:"Ses Testi",resetSettings:"Ayarları Sıfırla",resetToDefaults:"Varsayılan Ayarlara Dön",pomodoroCompleted:"Pomodoro Tamamlandı!",breakCompleted:"Mola Tamamlandı!",workSessionCompleted:"{duration} dakikalık çalışma tamamlandı. Mola zamanı!",breakFinished:"Mola bitti. Yeni pomodoro başlayabilirsiniz.",notificationsEnabled:"Bildirimler başarıyla etkinleştirildi!",default:"Varsayılan",darkMode:"Karanlık Mod",lightMode:"Aydınlık Mod",ocean:"Okyanus",forest:"Orman",sunset:"Gün Batımı",whatIsPomodoroTechnique:"Pomodoro Tekniği Nedir?",step1:"ADIM 1:",step1Desc:"Bir görev seçin",step2:"ADIM 2:",step2Desc:"25 dakikalık bir zamanlayıcı kurun",step3:"ADIM 3:",step3Desc:"Zamanlayıcı bitene kadar görevinizde tam konsantrasyonla çalışın",step4:"ADIM 4:",step4Desc:"5 dakika mola verin",step5:"ADIM 5:",step5Desc:"Her 4 pomodorodan sonra 15-20 dakika uzun mola verin",features:"Özellikler",featuresDesc:`• Görev yönetimi ve takibi
• Hedef belirleme ve ilerleme
• Detaylı istatistikler
• Tema seçenekleri
• Ses ve bildirim ayarları
• Yedekleme ve geri yükleme`,tips:"İpuçları",tipsDesc:`• Dikkat dağıtıcıları uzaklaştırın
• Mola sırasında ekrandan uzak durun
• Görevleri küçük parçalara bölün
• Düzenli molalar verin
• İlerlemenizi takip edin`,keyboardShortcuts:"Klavye Kısayolları",shortcutsDesc:`• Space: Başlat/Duraklat
• R: Sıfırla
• 1: Pomodoro modu
• 2: Kısa mola
• 3: Uzun mola`,madeWith:"Made with",by:"by",settingsUpdated:"Ayarlar güncellendi",pomodoroDurationError:"Pomodoro süresi 1-60 dakika arasında olmalıdır",shortBreakDurationError:"Kısa mola süresi 1-30 dakika arasında olmalıdır",longBreakDurationError:"Uzun mola süresi 1-60 dakika arasında olmalıdır",taskTitleRequired:"Lütfen bir görev başlığı girin",pomodoroCountError:"Pomodoro sayısı 1-20 arasında olmalıdır",goalTitleRequired:"Lütfen bir hedef başlığı girin",goalTargetError:"Hedef pomodoro sayısı 1-50 arasında olmalıdır",goalAddedSuccessfully:"Hedef başarıyla eklendi!",add:"Ekle",resetSettingsConfirm:"Tüm ayarları varsayılan değerlere sıfırlamak istediğinizden emin misiniz?",reloadPageConfirm:"Sayfayı yenilemek ister misiniz?",goalCompleted:"🎯 Hedef tamamlandı!",taskCompleted:"✅ Görev tamamlandı!",nextTaskQuestion:"Bir sonraki göreve geçmek ister misiniz?",backupExported:"Yedek başarıyla indirildi!"},en:{pomodoro:"Pomodoro",shortBreak:"Short Break",longBreak:"Long Break",start:"Start",pause:"Pause",stop:"Stop",reset:"Reset",statistics:"Statistics",tasks:"Tasks",goals:"Goals",settings:"Settings",help:"Help",youAreInPomodoroTime:"You are in pomodoro time",youAreInShortBreak:"You are in short break",youAreInLongBreak:"You are in long break",cycle:"Cycle",today:"Today",pomodoros:"pomodoros",totalPomodoros:"Total Pomodoros",totalTime:"Total Time",streak:"Streak",thisWeek:"This Week",weeklyActivity:"Weekly Activity",taskProgress:"Task Progress",days:"days",addNewTask:"Add new task...",newTask:"New Task",estimatedPomodoros:"Estimated Pomodoros",usedPomodoros:"Used Pomodoros",completed:"Completed",active:"Active",noTasksYet:"No tasks yet. Add one above!",noCompletedTasks:"No completed tasks",complete:"Complete",delete:"Delete",undo:"Undo",confirmDeleteTask:"Are you sure you want to delete this task?",confirmDeleteGoal:"Are you sure you want to delete this goal?",activeTask:"Active Task",high:"High",medium:"Medium",low:"Low",work:"Work",personal:"Personal",learning:"Learning",health:"Health",other:"Other",all:"All",searchTasks:"Search tasks...",noGoal:"No Goal",notes:"Notes",hasNotes:"Has notes",addNote:"Add note",saveNote:"Save Note",cancel:"Cancel",history:"History",pomodoroHistory:"Pomodoro History",noHistory:"No pomodoros completed yet",completedOn:"Completed on:",completeAll:"Complete All",deleteCompleted:"Delete Completed",recurringTask:"Recurring task",moveUp:"Move up",moveDown:"Move down",addNewGoal:"Add new goal...",goalName:"Goal name...",targetNumber:"Target number",progress:"Progress",noGoalsYet:"No goals yet. Add one above!",goalAchieved:"Goal Achieved!",activeGoal:"Active Goal",timeSettings:"Time Settings",pomodoroDuration:"Pomodoro Duration (minutes)",shortBreakDuration:"Short Break (minutes)",longBreakDuration:"Long Break (minutes)",longBreakInterval:"Long Break Interval",theme:"Theme",soundAndNotifications:"Sound and Notifications",soundEffects:"Sound effects",notifications:"Notifications",soundLevel:"Sound Level",autoStartBreaks:"Auto start breaks",autoStartPomodoros:"Auto start pomodoros",language:"Language",selectLanguage:"Select Language",minutes:"min",testSound:"Test Sound",resetSettings:"Reset Settings",resetToDefaults:"Reset to Defaults",pomodoroCompleted:"Pomodoro Completed!",breakCompleted:"Break Completed!",workSessionCompleted:"{duration} minute work session completed. Time for a break!",breakFinished:"Break finished. You can start a new pomodoro.",notificationsEnabled:"Notifications successfully enabled!",default:"Default",darkMode:"Dark Mode",lightMode:"Light Mode",ocean:"Ocean",forest:"Forest",sunset:"Sunset",whatIsPomodoroTechnique:"What is Pomodoro Technique?",step1:"STEP 1:",step1Desc:"Pick a task",step2:"STEP 2:",step2Desc:"Set a 25-minute timer",step3:"STEP 3:",step3Desc:"Work on your task with full concentration until the timer is up",step4:"STEP 4:",step4Desc:"Take a 5 minute break",step5:"STEP 5:",step5Desc:"Every 4 pomodoros, take a longer 15-20 minute break",features:"Features",featuresDesc:`• Task management and tracking
• Goal setting and progress
• Detailed statistics
• Theme options
• Sound and notification settings
• Backup and restore`,tips:"Tips",tipsDesc:`• Remove distractions
• Stay away from screens during breaks
• Break tasks into small parts
• Take regular breaks
• Track your progress`,keyboardShortcuts:"Keyboard Shortcuts",shortcutsDesc:`• Space: Start/Pause
• R: Reset
• 1: Pomodoro mode
• 2: Short break
• 3: Long break`,madeWith:"Made with",by:"by",settingsUpdated:"Settings updated",pomodoroDurationError:"Pomodoro duration must be between 1-60 minutes",shortBreakDurationError:"Short break duration must be between 1-30 minutes",longBreakDurationError:"Long break duration must be between 1-60 minutes",taskTitleRequired:"Please enter a task title",pomodoroCountError:"Pomodoro count must be between 1-20",goalTitleRequired:"Please enter a goal title",goalTargetError:"Goal pomodoro count must be between 1-50",goalAddedSuccessfully:"Goal added successfully!",add:"Add",resetSettingsConfirm:"Are you sure you want to reset all settings to default values?",reloadPageConfirm:"Would you like to reload the page?",goalCompleted:"🎯 Goal completed!",taskCompleted:"✅ Task completed!",nextTaskQuestion:"Would you like to move to the next task?",backupExported:"Backup exported successfully!"}};class r{static currentLanguage="en";static init(){const t=localStorage.getItem("pomodoro_language");t?this.currentLanguage=t:this.currentLanguage=this.detectLanguage()}static detectLanguage(){return(navigator.language||navigator.userLanguage).split("-")[0].toLowerCase()==="tr"?"tr":"en"}static setLanguage(t){this.currentLanguage=t,localStorage.setItem("pomodoro_language",t),this.updateUI()}static getLanguage(){return this.currentLanguage}static getCurrentLanguage(){return this.currentLanguage}static t(t){return V[this.currentLanguage]?.[t]||t}static updateUI(){document.querySelectorAll("[data-i18n]").forEach(t=>{const e=t.getAttribute("data-i18n");e&&(t.textContent=this.t(e))}),document.querySelectorAll("[data-i18n-placeholder]").forEach(t=>{const e=t.getAttribute("data-i18n-placeholder");e&&t instanceof HTMLInputElement&&(t.placeholder=this.t(e))}),document.querySelectorAll("[data-i18n-title]").forEach(t=>{const e=t.getAttribute("data-i18n-title");e&&t.setAttribute("title",this.t(e))})}}class v{static goals=[];static activeGoalId=null;static init(){this.goals=l.get("goals",[]),this.activeGoalId=l.get("activeGoalId",null)}static createGoal(t,e,a){const o={id:this.generateId(),title:t,target:e,current:0,period:a,createdAt:new Date};return this.goals.push(o),this.save(),o}static getGoals(){return this.goals}static getActiveGoals(){return this.goals.filter(t=>!t.achievedAt)}static getCompletedGoals(){return this.goals.filter(t=>t.achievedAt)}static getGoal(t){return this.goals.find(e=>e.id===t)}static updateGoal(t,e){const a=this.goals.findIndex(o=>o.id===t);return a===-1?!1:(this.goals[a]={...this.goals[a],...e},this.save(),!0)}static setActiveGoal(t){this.activeGoalId=t,l.set("activeGoalId",t)}static getActiveGoal(){return this.activeGoalId&&this.getGoal(this.activeGoalId)||null}static getActiveGoalId(){return this.activeGoalId}static deleteGoal(t){const e=this.goals.findIndex(a=>a.id===t);return e===-1?!1:(this.goals.splice(e,1),this.save(),!0)}static updateProgress(t,e){const a=this.getGoal(t);if(!a)return!1;const o=Math.min(a.current+e,a.target),i=o>=a.target&&!a.achievedAt;return this.updateGoal(t,{current:o,achievedAt:i?new Date:a.achievedAt})}static getTodayGoal(){return this.goals.find(t=>t.period==="daily"&&S.isToday(t.createdAt)&&!t.achievedAt)||null}static getWeekGoal(){return this.goals.find(t=>t.period==="weekly"&&S.isThisWeek(t.createdAt)&&!t.achievedAt)||null}static getProgressPercentage(t){const e=this.getGoal(t);return e?Math.round(e.current/e.target*100):0}static getOverallProgress(){const t=this.goals.length,e=this.goals.filter(o=>o.achievedAt).length,a=t>0?Math.round(e/t*100):0;return{completed:e,total:t,percentage:a}}static resetDailyGoals(){this.goals.forEach(t=>{t.period==="daily"&&!S.isToday(t.createdAt)&&this.updateGoal(t.id,{current:0,achievedAt:void 0})})}static resetWeeklyGoals(){this.goals.forEach(t=>{t.period==="weekly"&&!S.isThisWeek(t.createdAt)&&this.updateGoal(t.id,{current:0,achievedAt:void 0})})}static completePomodoro(){const t=new Date;this.goals.forEach(e=>{if(e.period==="daily"&&S.isToday(e.createdAt)&&!e.achievedAt){const a=e.current+1;this.updateGoal(e.id,{current:a}),a>=e.target&&(this.updateGoal(e.id,{achievedAt:t,current:e.target}),k.success(`${r.t("goalCompleted")} ${e.title}`))}}),this.goals.forEach(e=>{if(e.period==="weekly"&&S.isThisWeek(e.createdAt)&&!e.achievedAt){const a=e.current+1;this.updateGoal(e.id,{current:a}),a>=e.target&&(this.updateGoal(e.id,{achievedAt:t,current:e.target}),k.success(`${r.t("goalCompleted")} ${e.title}`))}}),this.save()}static generateId(){return Date.now().toString(36)+Math.random().toString(36).substr(2)}static save(){l.set("goals",this.goals)}static clearData(){this.goals=[],this.save()}}class m{static settings={pomodoroDuration:25,shortBreakDuration:5,longBreakDuration:15,longBreakInterval:4,autoStartBreaks:!0,autoStartPomodoros:!0,soundEnabled:!0,notificationsEnabled:!0,theme:"default",language:"en"};static notificationSettings={workSound:"/work.mp3",breakSound:"/break.mp3",volume:.5,desktopNotifications:!0};static init(){this.settings=l.get("settings",this.settings),this.notificationSettings=l.get("notificationSettings",this.notificationSettings),b.setVolume(this.notificationSettings.volume)}static getSettings(){return{...this.settings}}static getNotificationSettings(){return{...this.notificationSettings}}static updateSettings(t){this.settings={...this.settings,...t},this.save()}static updateNotificationSettings(t){this.notificationSettings={...this.notificationSettings,...t},t.volume!==void 0&&b.setVolume(t.volume),this.save()}static getPomodoroDuration(){return this.settings.pomodoroDuration}static getShortBreakDuration(){return this.settings.shortBreakDuration}static getLongBreakDuration(){return this.settings.longBreakDuration}static getLongBreakInterval(){return this.settings.longBreakInterval}static isAutoStartBreaks(){return this.settings.autoStartBreaks}static isAutoStartPomodoros(){return this.settings.autoStartPomodoros}static isSoundEnabled(){return this.settings.soundEnabled}static isNotificationsEnabled(){return this.settings.notificationsEnabled}static getTheme(){return this.settings.theme}static getLanguage(){return this.settings.language}static setPomodoroDuration(t){this.updateSettings({pomodoroDuration:Math.max(1,Math.min(60,t))})}static setShortBreakDuration(t){this.updateSettings({shortBreakDuration:Math.max(1,Math.min(30,t))})}static setLongBreakDuration(t){this.updateSettings({longBreakDuration:Math.max(1,Math.min(60,t))})}static setLongBreakInterval(t){this.updateSettings({longBreakInterval:Math.max(1,Math.min(10,t))})}static setAutoStartBreaks(t){this.updateSettings({autoStartBreaks:t})}static setAutoStartPomodoros(t){this.updateSettings({autoStartPomodoros:t})}static setSoundEnabled(t){this.updateSettings({soundEnabled:t})}static setNotificationsEnabled(t){this.updateSettings({notificationsEnabled:t})}static setTheme(t){this.updateSettings({theme:t})}static setLanguage(t){this.updateSettings({language:t})}static setVolume(t){this.updateNotificationSettings({volume:Math.max(0,Math.min(1,t))})}static setDesktopNotifications(t){this.updateNotificationSettings({desktopNotifications:t})}static resetToDefaults(){this.settings={pomodoroDuration:25,shortBreakDuration:5,longBreakDuration:15,longBreakInterval:4,autoStartBreaks:!1,autoStartPomodoros:!1,soundEnabled:!0,notificationsEnabled:!0,theme:"default",language:"tr"},this.notificationSettings={workSound:"/work.mp3",breakSound:"/break.mp3",volume:.5,desktopNotifications:!0},this.save(),b.setVolume(this.notificationSettings.volume)}static exportSettings(){return JSON.stringify({settings:this.settings,notificationSettings:this.notificationSettings},null,2)}static importSettings(t){try{const e=JSON.parse(t);return e.settings&&(this.settings={...this.settings,...e.settings}),e.notificationSettings&&(this.notificationSettings={...this.notificationSettings,...e.notificationSettings}),this.save(),!0}catch(e){return console.error("Error importing settings:",e),!1}}static save(){l.set("settings",this.settings),l.set("notificationSettings",this.notificationSettings)}}class c{static tasks=[];static activeTaskId=null;static init(){this.tasks=l.get("tasks",[]),this.activeTaskId=l.get("activeTaskId",null)}static addTask(t,e,a=1){const o={id:this.generateId(),title:t,description:e,completed:!1,pomodorosUsed:0,estimatedPomodoros:a,createdAt:new Date};return this.tasks.push(o),this.save(),o}static getTasks(){return this.tasks}static getActiveTasks(){return this.tasks.filter(t=>!t.completed)}static getCompletedTasks(){return this.tasks.filter(t=>t.completed)}static getTask(t){return this.tasks.find(e=>e.id===t)}static updateTask(t,e){const a=this.tasks.findIndex(o=>o.id===t);return a===-1?!1:(this.tasks[a]={...this.tasks[a],...e},this.save(),!0)}static completeTask(t){const e=this.getTask(t);if(!e)return!1;const a=this.updateTask(t,{completed:!0,completedAt:new Date});return a&&k.success(`${r.t("taskCompleted")} ${e.title}`),a}static deleteTask(t){const e=this.tasks.findIndex(d=>d.id===t);if(e===-1)return!1;const a=this.tasks[e],o=this.getArchivedTasks(),i={...a,archivedAt:new Date().toISOString(),deletedAt:new Date().toISOString()};return o.push(i),l.set("archived_tasks",o),this.tasks.splice(e,1),this.save(),!0}static getArchivedTasks(){return l.get("archived_tasks",[])}static restoreTask(t){const e=this.getArchivedTasks(),a=e.findIndex(d=>d.id===t);if(a===-1)return!1;const o=e[a],{...i}=o;return this.tasks.push(i),this.save(),e.splice(a,1),l.set("archived_tasks",e),!0}static permanentlyDeleteTask(t){const e=this.getArchivedTasks(),a=e.findIndex(o=>o.id===t);return a===-1?!1:(e.splice(a,1),l.set("archived_tasks",e),!0)}static addPomodoroToTask(t){const e=this.getTask(t);if(!e)return!1;const a=e.pomodoroHistory||[];return a.push({completedAt:new Date,duration:m.getPomodoroDuration()}),this.updateTask(t,{pomodorosUsed:e.pomodorosUsed+1,pomodoroHistory:a})}static setActiveTask(t){this.activeTaskId=t,l.set("activeTaskId",t)}static getActiveTask(){return this.activeTaskId&&this.getTask(this.activeTaskId)||null}static getActiveTaskId(){return this.activeTaskId}static addPomodoroToActiveTask(){return this.activeTaskId?this.addPomodoroToTask(this.activeTaskId):!1}static uncompleteTask(t){return this.updateTask(t,{completed:!1,completedAt:void 0})}static getTasksByProgress(){const t=this.tasks.length;return{completed:this.tasks.filter(a=>a.completed).length,total:t}}static getTotalEstimatedPomodoros(){return this.getActiveTasks().reduce((t,e)=>t+e.estimatedPomodoros,0)}static getTotalUsedPomodoros(){return this.tasks.reduce((t,e)=>t+e.pomodorosUsed,0)}static generateId(){return Date.now().toString(36)+Math.random().toString(36).substr(2)}static save(){l.set("tasks",this.tasks)}static clearData(){this.tasks=[],this.activeTaskId=null,this.save(),l.set("activeTaskId",null)}}class g{static timeData;static interval=null;static currentSession=null;static callbacks={};static init(){this.timeData={pomodoro:m.getPomodoroDuration(),shortBreak:m.getShortBreakDuration(),longBreak:m.getLongBreakDuration(),cycle:0,mode:"pomodoro",status:!1};const t=l.get("timerState",null);t&&typeof t=="object"&&(this.timeData={...this.timeData,...t})}static getTimeData(){return{...this.timeData}}static getCurrentTime(){return this.timeData.mode==="pomodoro"?this.timeData.pomodoro*60:this.timeData.mode==="short"?this.timeData.shortBreak*60:this.timeData.longBreak*60}static start(){this.timeData.status||(this.timeData.status=!0,this.currentSession={id:this.generateId(),startTime:new Date,duration:this.getCurrentTime(),mode:this.timeData.mode,completed:!1},this.interval=setInterval(()=>{this.tick()},1e3),this.callbacks.onStart?.())}static pause(){this.timeData.status=!1,this.interval&&(clearInterval(this.interval),this.interval=null)}static stop(){this.pause(),this.timeData.cycle=0,this.timeData.mode="pomodoro",this.currentSession=null}static reset(){this.stop(),this.timeData.mode="pomodoro",this.timeData.cycle=0}static setMode(t){const e=this.timeData.status;this.pause(),this.timeData.mode=t,this.currentSession=null,this.saveState(),this.callbacks.onModeChange?.(t),m.isSoundEnabled()&&(t==="pomodoro"?b.playWorkSound():b.playBreakSound()),this.callbacks.onTick?.(this.getCurrentTime()),e&&setTimeout(()=>{this.start()},100)}static setCallbacks(t){this.callbacks={...this.callbacks,...t}}static tick(){this.currentSession&&this.timeData.status&&(this.currentSession.duration--,this.callbacks.onTick?.(this.currentSession.duration),this.currentSession.duration<=0&&this.completeSession())}static completeSession(){const t=this.timeData.mode;this.pause(),this.currentSession&&(this.currentSession.completed=!0,this.currentSession.endTime=new Date,this.currentSession.mode==="pomodoro"&&(B.addSession(this.currentSession),v.completePomodoro(),c.addPomodoroToActiveTask())),this.switchToNextMode(),m.isSoundEnabled()&&(t==="pomodoro"?b.playBreakSound():b.playWorkSound()),m.isNotificationsEnabled()&&this.showNotification(t),this.callbacks.onComplete?.(t),this.shouldAutoStart()&&setTimeout(()=>{this.start()},1e3)}static switchToNextMode(){switch(this.timeData.mode){case"pomodoro":this.timeData.cycle++,this.timeData.cycle%m.getLongBreakInterval()===0?this.timeData.mode="long":this.timeData.mode="short";break;case"short":case"long":this.timeData.mode="pomodoro";break}this.saveState(),this.callbacks.onModeChange?.(this.timeData.mode)}static shouldAutoStart(){return this.timeData.mode==="pomodoro"?m.isAutoStartPomodoros():m.isAutoStartBreaks()}static showNotification(t){if("Notification"in window)if(Notification.permission==="granted"){const e=t||this.timeData.mode,a=e==="pomodoro"?r.t("pomodoroCompleted"):r.t("breakCompleted"),o=e==="pomodoro"?r.t("workSessionCompleted").replace("{duration}",m.getPomodoroDuration().toString()):r.t("breakFinished");try{const i=new Notification(a,{body:o,icon:"/favicon.svg",badge:"/favicon.svg",requireInteraction:!1,silent:!1,tag:"pomodoro-timer"});setTimeout(()=>{i.close()},1e4)}catch{}}else Notification.permission==="default"&&Notification.requestPermission().then(e=>{e==="granted"&&setTimeout(()=>{this.showNotification(t)},100)}).catch(()=>{})}static requestNotificationPermission(){"Notification"in window&&Notification.permission==="default"&&Notification.requestPermission().then(t=>{t==="granted"&&new Notification("Pomodoro Timer",{body:r.t("notificationsEnabled"),icon:"/favicon.svg"})}).catch(()=>{})}static updateSettings(){this.timeData.pomodoro=m.getPomodoroDuration(),this.timeData.shortBreak=m.getShortBreakDuration(),this.timeData.longBreak=m.getLongBreakDuration(),this.saveState()}static saveState(){l.set("timerState",{mode:this.timeData.mode,cycle:this.timeData.cycle,pomodoro:this.timeData.pomodoro,shortBreak:this.timeData.shortBreak,longBreak:this.timeData.longBreak})}static generateId(){return Date.now().toString(36)+Math.random().toString(36).substr(2)}static getCurrentSession(){return this.currentSession}static isRunning(){return this.timeData.status}static getCycle(){return this.timeData.cycle}static getMode(){return this.timeData.mode}}class M{static themes=[{id:"default",name:"🍅 Classic",colors:{primary:"#3d5a80",secondary:"#5089b0",accent:"#ee6c4d",background:"#293241",surface:"#3d5a80",text:"#e0fbfc",textSecondary:"#c8d5e0"}},{id:"dark",name:"🌙 Midnight",colors:{primary:"#0d1117",secondary:"#161b22",accent:"#58a6ff",background:"#0d1117",surface:"#161b22",text:"#c9d1d9",textSecondary:"#8b949e"}},{id:"light",name:"☀️ Daylight",colors:{primary:"#ffffff",secondary:"#f6f8fa",accent:"#0969da",background:"#ffffff",surface:"#f6f8fa",text:"#24292f",textSecondary:"#57606a"}},{id:"ocean",name:"🌊 Ocean",colors:{primary:"#0a4d68",secondary:"#088395",accent:"#05bfdb",background:"#0a4d68",surface:"#088395",text:"#ffffff",textSecondary:"#00ffca"}},{id:"forest",name:"🌲 Forest",colors:{primary:"#1a4d2e",secondary:"#2d6a4f",accent:"#52b788",background:"#1a4d2e",surface:"#2d6a4f",text:"#ffffff",textSecondary:"#95d5b2"}},{id:"sunset",name:"🌅 Sunset",colors:{primary:"#8b4049",secondary:"#9d5c63",accent:"#e8998d",background:"#7a3544",surface:"#9d5c63",text:"#fef3f0",textSecondary:"#f4d8d3"}},{id:"purple",name:"💜 Purple Dream",colors:{primary:"#5a189a",secondary:"#7209b7",accent:"#b5179e",background:"#5a189a",surface:"#7209b7",text:"#ffffff",textSecondary:"#e0aaff"}},{id:"focus",name:"🎯 Focus Mode",colors:{primary:"#1e293b",secondary:"#334155",accent:"#3b82f6",background:"#1e293b",surface:"#334155",text:"#f1f5f9",textSecondary:"#cbd5e1"}},{id:"warm",name:"☕ Warm Coffee",colors:{primary:"#3e2723",secondary:"#5d4037",accent:"#ff6f00",background:"#3e2723",surface:"#5d4037",text:"#fafafa",textSecondary:"#ffccbc"}},{id:"mint",name:"🍃 Mint Fresh",colors:{primary:"#06a77d",secondary:"#00d9b1",accent:"#00f5d4",background:"#06a77d",surface:"#00d9b1",text:"#ffffff",textSecondary:"#b8f2e6"}},{id:"pink",name:"💗 Pink Blossom",colors:{primary:"#ffd6e8",secondary:"#ffe5f1",accent:"#ff6b9d",background:"#FFCDE1",surface:"#ffe5f1",text:"#4a1e3a",textSecondary:"#8b4f7d"}},{id:"rose",name:"🌹 Rose Garden",colors:{primary:"#9e5770",secondary:"#b8738e",accent:"#dda5a5",background:"#8b4a5e",surface:"#a96782",text:"#fef5f7",textSecondary:"#f5dde2"}},{id:"lavender",name:"💜 Lavender Dream",colors:{primary:"#9d84b7",secondary:"#c8b6e2",accent:"#f4a9d8",background:"#9d84b7",surface:"#c8b6e2",text:"#ffffff",textSecondary:"#f8f0ff"}},{id:"neon",name:"⚡ Neon Night",colors:{primary:"#0f0e17",secondary:"#1a1a2e",accent:"#ff006e",background:"#0f0e17",surface:"#1a1a2e",text:"#fffffe",textSecondary:"#a7a9be"}},{id:"nature",name:"🌿 Nature",colors:{primary:"#2d6a4f",secondary:"#40916c",accent:"#95d5b2",background:"#2d6a4f",surface:"#40916c",text:"#ffffff",textSecondary:"#d8f3dc"}},{id:"cyberpunk",name:"🤖 Cyberpunk",colors:{primary:"#0a0e27",secondary:"#1a1f3a",accent:"#00fff5",background:"#0a0e27",surface:"#1a1f3a",text:"#ffffff",textSecondary:"#b8b8ff"}}];static currentTheme="default";static init(){this.currentTheme=l.get("currentTheme","default"),this.applyTheme(this.currentTheme)}static getThemes(){return this.themes}static getCurrentTheme(){return this.themes.find(t=>t.id===this.currentTheme)||this.themes[0]}static setTheme(t){return this.themes.find(a=>a.id===t)?(this.currentTheme=t,this.applyTheme(t),l.set("currentTheme",t),!0):!1}static applyTheme(t){const e=this.themes.find(d=>d.id===t);if(!e)return;const a=document.documentElement,o=this.isColorDark(e.colors.background);a.style.setProperty("--bg-primary",e.colors.background),a.style.setProperty("--bg-secondary",e.colors.surface),a.style.setProperty("--bg-tertiary",e.colors.secondary),a.style.setProperty("--text-primary",e.colors.text),a.style.setProperty("--text-secondary",e.colors.textSecondary),a.style.setProperty("--text-tertiary",e.colors.textSecondary),a.style.setProperty("--color-primary",e.colors.accent),a.style.setProperty("--color-primary-hover",this.adjustBrightness(e.colors.accent,-10)),a.style.setProperty("--color-primary-light",this.adjustBrightness(e.colors.accent,40)),a.style.setProperty("--color-secondary",e.colors.primary),a.style.setProperty("--circle-stroke",e.colors.accent),a.style.setProperty("--color-border",o?"rgba(255, 255, 255, 0.1)":"rgba(0, 0, 0, 0.1)"),a.style.setProperty("--color-border-light",o?"rgba(255, 255, 255, 0.05)":"rgba(0, 0, 0, 0.05)");const i=o?this.adjustBrightness(e.colors.surface,10):this.adjustBrightness(e.colors.surface,-5);a.style.setProperty("--color-input-bg",i),document.body.style.background=e.colors.background}static isColorDark(t){const e=t.replace("#",""),a=parseInt(e.substring(0,2),16),o=parseInt(e.substring(2,4),16),i=parseInt(e.substring(4,6),16);return(a*299+o*587+i*114)/1e3<128}static adjustBrightness(t,e){const a=t.replace("#",""),o=parseInt(a.substring(0,2),16),i=parseInt(a.substring(2,4),16),d=parseInt(a.substring(4,6),16),n=w=>{const y=w+w*e/100;return Math.max(0,Math.min(255,Math.round(y)))},u=n(o).toString(16).padStart(2,"0"),p=n(i).toString(16).padStart(2,"0"),f=n(d).toString(16).padStart(2,"0");return`#${u}${p}${f}`}static createCustomTheme(t,e){const a={id:this.generateId(),name:t,colors:e};return this.themes.push(a),l.set("customThemes",this.themes.filter(o=>!this.isDefaultTheme(o.id))),a}static deleteCustomTheme(t){if(this.isDefaultTheme(t))return!1;const e=this.themes.findIndex(a=>a.id===t);return e===-1?!1:(this.themes.splice(e,1),l.set("customThemes",this.themes.filter(a=>!this.isDefaultTheme(a.id))),this.currentTheme===t&&this.setTheme("default"),!0)}static isDefaultTheme(t){return["default","dark","light","ocean","forest","sunset","purple","mint","pink","rose","lavender","neon","nature","cyberpunk","focus","warm"].includes(t)}static generateId(){return"custom_"+Date.now().toString(36)+Math.random().toString(36).substr(2)}static loadCustomThemes(){const t=l.get("customThemes",[]);this.themes=[...this.themes.filter(e=>this.isDefaultTheme(e.id)),...t]}}class U{static BACKUP_VERSION="1.0.0";static createBackup(){return{version:this.BACKUP_VERSION,timestamp:new Date,data:{tasks:l.get("tasks",[]),goals:l.get("goals",[]),statistics:l.get("statistics",{}),settings:l.get("settings",{}),theme:l.get("currentTheme","default"),timerState:l.get("timerState",{}),archived_tasks:l.get("archived_tasks",[]),customThemes:l.get("customThemes",[])}}}static exportBackup(){const t=this.createBackup(),e=JSON.stringify(t,null,2),a=new Blob([e],{type:"application/json"}),o=URL.createObjectURL(a),i=document.createElement("a");i.href=o;const d=new Date().toISOString().split("T")[0];i.download=`pomodoro-backup-${d}.json`,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(o)}static async importBackup(t){try{const e=await t.text(),a=JSON.parse(e);return this.validateBackup(a)?(this.restoreBackup(a),{success:!0,message:"Backup restored successfully! Please refresh the page."}):{success:!1,message:"Invalid backup file format"}}catch(e){return console.error("Backup import error:",e),{success:!1,message:"Failed to import backup file"}}}static validateBackup(t){return t&&typeof t=="object"&&t.version&&t.timestamp&&t.data&&typeof t.data=="object"}static restoreBackup(t){const{data:e}=t;e.tasks&&l.set("tasks",e.tasks),e.goals&&l.set("goals",e.goals),e.statistics&&l.set("statistics",e.statistics),e.settings&&l.set("settings",e.settings),e.theme&&l.set("currentTheme",e.theme),e.timerState&&l.set("timerState",e.timerState),e.archived_tasks&&l.set("archived_tasks",e.archived_tasks),e.customThemes&&l.set("customThemes",e.customThemes)}static async getBackupInfo(t){try{const e=await t.text(),a=JSON.parse(e);return this.validateBackup(a)?{valid:!0,info:{version:a.version,timestamp:a.timestamp,tasksCount:a.data.tasks?.length||0,goalsCount:a.data.goals?.length||0,theme:a.data.theme}}:{valid:!1}}catch{return{valid:!1}}}static createAutoBackup(){const t=this.createBackup(),e=`auto-backup-${Date.now()}`;l.set(e,t),this.cleanupOldAutoBackups()}static cleanupOldAutoBackups(){const t=Object.keys(localStorage).filter(e=>e.startsWith("auto-backup-"));t.length>5&&t.sort().slice(0,t.length-5).forEach(e=>{localStorage.removeItem(e)})}static getAutoBackups(){return Object.keys(localStorage).filter(e=>e.startsWith("auto-backup-")).map(e=>({key:e,timestamp:new Date(parseInt(e.replace("auto-backup-","")))})).sort((e,a)=>a.timestamp.getTime()-e.timestamp.getTime())}static restoreAutoBackup(t){const e=l.get(t,null);return e&&this.validateBackup(e)?(this.restoreBackup(e),!0):!1}}function O(){k.init(),r.init(),B.init(),c.init(),v.init(),M.loadCustomThemes(),M.init(),m.init(),b.init(),g.init(),J(),Q(),T(),setTimeout(()=>{g.requestNotificationPermission()},1e3)}function J(){const s=document.querySelector("#app");s.innerHTML=`
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
  `}function Q(){const s=document.getElementById("action-btn"),t=document.getElementById("mode-btns");s.addEventListener("click",Z),t.addEventListener("click",tt),document.getElementById("stats-btn")?.addEventListener("click",()=>P("stats")),document.getElementById("tasks-btn")?.addEventListener("click",()=>P("tasks")),document.getElementById("goals-btn")?.addEventListener("click",()=>P("goals")),document.getElementById("settings-btn")?.addEventListener("click",()=>P("settings")),document.querySelectorAll(".close-panel").forEach(o=>{o.addEventListener("click",i=>{const d=i.target.closest(".close-panel")?.getAttribute("data-panel");d&&P(d)})}),document.querySelector(".timer-info")?.addEventListener("click",()=>{document.querySelector(".shadowBg")?.classList.add("active"),document.querySelector(".infoBox")?.classList.add("active")});const e=()=>{document.querySelector(".shadowBg")?.classList.remove("active"),document.querySelector(".infoBox")?.classList.remove("active")};document.querySelector(".fa-xmark")?.addEventListener("click",e),document.addEventListener("keydown",o=>{o.key==="Escape"&&document.querySelector(".infoBox")?.classList.contains("active")&&e()}),document.querySelector(".shadowBg")?.addEventListener("click",o=>{o.target===o.currentTarget&&e()}),document.getElementById("add-task-btn")?.addEventListener("click",R),document.getElementById("task-input")?.addEventListener("keypress",o=>{o.key==="Enter"&&R()}),document.querySelectorAll(".close-notes-modal").forEach(o=>{o.addEventListener("click",_)}),document.getElementById("save-notes-btn")?.addEventListener("click",mt),document.querySelectorAll(".close-history-modal").forEach(o=>{o.addEventListener("click",gt)}),document.getElementById("task-search")?.addEventListener("input",o=>{H=o.target.value,h()}),document.querySelectorAll(".category-filter-btn").forEach(o=>{o.addEventListener("click",i=>{const d=i.currentTarget,n=d.getAttribute("data-category")||"all";document.querySelectorAll(".category-filter-btn").forEach(u=>u.classList.remove("active")),d.classList.add("active"),C=n,h()})}),document.querySelectorAll(".task-tab").forEach(o=>{o.addEventListener("click",i=>{const d=i.currentTarget,n=d.getAttribute("data-tab");document.querySelectorAll(".task-tab").forEach(f=>f.classList.remove("active")),d.classList.add("active");const u=document.getElementById("task-list"),p=document.getElementById("completed-task-list");n==="active"?(u?.classList.remove("hidden"),p?.classList.add("hidden")):(u?.classList.add("hidden"),p?.classList.remove("hidden"))})}),document.querySelectorAll(".goal-tab").forEach(o=>{o.addEventListener("click",i=>{const d=i.currentTarget,n=d.getAttribute("data-tab");document.querySelectorAll(".goal-tab").forEach(f=>f.classList.remove("active")),d.classList.add("active");const u=document.getElementById("goal-list"),p=document.getElementById("completed-goal-list");n==="active-goals"?(u?.classList.remove("hidden"),p?.classList.add("hidden")):(u?.classList.add("hidden"),p?.classList.remove("hidden"))})}),document.getElementById("add-goal-btn")?.addEventListener("click",yt),ct(),g.setCallbacks({onTick:I,onComplete:st,onStart:()=>{A(!0)},onModeChange:o=>{z(o),q(o),setTimeout(()=>{A(g.isRunning())},150)}}),T(),et()}function Z(){b.enableAudio(),"Notification"in window&&Notification.permission==="default"&&g.requestNotificationPermission(),g.isRunning()?(g.pause(),A(!1)):(g.start(),A(!0))}function X(s){g.setMode(s),z(s),q(s),I(),A(g.isRunning())}function tt(s){const e=s.target.dataset.mode;e&&X(e)}function I(s){const t=s!==void 0?s:g.getCurrentTime(),e=Math.max(0,t),a=Math.floor(e/60),o=Math.floor(e%60),i=document.getElementById("minute"),d=document.getElementById("second");i&&(i.textContent=a.toString()),d&&(d.textContent=o.toString().padStart(2,"0")),at(e)}function et(){const s=document.getElementById("circle2");s&&(s.style.strokeDasharray=1036.7.toString(),s.style.strokeDashoffset=1036.7.toString())}function at(s){const t=g.getCurrentTime(),e=Math.max(0,(t-s)/t),a=document.getElementById("circle2");if(a){const i=1036.7-e*1036.7;a.style.strokeDashoffset=i.toString()}}function st(s){A(!1),T()}function A(s){const t=document.getElementById("action-btn");if(!t)return;const e=t.querySelector("i");e&&(s?e.className="fa-solid fa-pause":e.className="fa-solid fa-play")}function z(s){document.querySelectorAll(".btn").forEach(t=>{t.classList.remove("active")}),document.querySelector(`[data-mode="${s}"]`)?.classList.add("active")}function q(s){const t=document.getElementById("timer-info-text");if(!t)return;const e={pomodoro:r.t("youAreInPomodoroTime"),short:r.t("youAreInShortBreak"),long:r.t("youAreInLongBreak")};t.textContent=e[s]}let D=null;function P(s){if(document.getElementById(`${s}-panel`)){if(D===s){N(s);return}D&&N(D),ot(s)}}function ot(s){const t=document.getElementById(`${s}-panel`);t&&(t.classList.add("active"),D=s,it(s),setTimeout(()=>{document.addEventListener("click",Y),document.addEventListener("keydown",j)},100))}function N(s){const t=document.getElementById(`${s}-panel`);t&&(t.classList.remove("active"),D=null,document.removeEventListener("click",Y),document.removeEventListener("keydown",j))}function Y(s){const t=s.target,e=document.querySelector(".panel.active");e&&!e.contains(t)&&!t.closest(".nav-btn")&&D&&N(D)}function j(s){s.key==="Escape"&&D&&N(D)}function it(s){switch(s){case"stats":nt();break;case"tasks":h();break;case"goals":L();break;case"settings":K();break}}function nt(){const s=B.getTotalPomodoros(),t=B.getTotalTime(),e=B.getStreak(),a=B.getWeekSessions().length;document.getElementById("total-pomodoros").textContent=s.toString(),document.getElementById("total-time").textContent=bt(t),document.getElementById("streak").textContent=`${e} ${r.t("days")}`,document.getElementById("week-pomodoros").textContent=a.toString(),rt(),dt()}function rt(){const s=document.getElementById("weekly-chart");if(!s)return;const t=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],e=["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"],a=r.getCurrentLanguage()==="tr"?e:t,o=B.getWeekSessions(),i=new Array(7).fill(0),d=new Date;o.forEach(u=>{if(u.mode==="pomodoro"){const p=new Date(u.startTime),f=p.getDay(),w=f===0?6:f-1,y=new Date(d);y.setDate(d.getDate()-(d.getDay()+6)%7),y.setHours(0,0,0,0);const E=new Date(y);E.setDate(y.getDate()+7),p>=y&&p<E&&i[w]++}});const n=Math.max(...i,1);s.innerHTML=a.map((u,p)=>`
    <div class="bar-item">
      <div class="bar-fill" style="height: ${i[p]/n*100}%">
        <span class="bar-value">${i[p]}</span>
      </div>
      <div class="bar-label">${u}</div>
    </div>
  `).join("")}function dt(){const s=document.getElementById("task-progress-chart");if(!s)return;const t=c.getActiveTasks();if(t.length===0){s.innerHTML=`<div class="empty-state"><i class="fa-solid fa-tasks"></i><p>${r.t("noTasksYet")}</p></div>`;return}s.innerHTML=t.slice(0,5).map(e=>{const a=e.estimatedPomodoros>0?e.pomodorosUsed/e.estimatedPomodoros*100:0;return`
      <div class="progress-item">
        <div class="progress-label">${e.title}</div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill" style="width: ${Math.min(a,100)}%"></div>
          <span class="progress-text">${e.pomodorosUsed}/${e.estimatedPomodoros}</span>
        </div>
      </div>
    `}).join("")}function lt(){const s=document.getElementById("task-goal");if(!s)return;const t=v.getActiveGoals();s.innerHTML=`<option value="" data-i18n="noGoal">${r.t("noGoal")}</option>`,t.forEach(e=>{const a=document.createElement("option");a.value=e.id,a.textContent=`🎯 ${e.title} (${e.current}/${e.target})`,s.appendChild(a)})}function h(){const s=c.getActiveTasks(),t=c.getCompletedTasks(),e=c.getActiveTaskId(),a=document.getElementById("task-list"),o=document.getElementById("completed-task-list");lt();let i=C==="all"?s:s.filter(n=>n.category===C),d=C==="all"?t:t.filter(n=>n.category===C);if(H){const n=H.toLowerCase();i=i.filter(u=>u.title.toLowerCase().includes(n)),d=d.filter(u=>u.title.toLowerCase().includes(n))}i.length===0?a.innerHTML=`<div class="empty-state"><i class="fa-solid fa-inbox"></i><p>${r.t("noTasksYet")}</p></div>`:a.innerHTML=i.map(n=>{const u=n.estimatedPomodoros>0?n.pomodorosUsed/n.estimatedPomodoros*100:0,p=n.id===e,f=n.priority||"medium",w=n.priority?r.t(n.priority):r.t("medium"),y=n.category||"work",E=r.t(y),$={work:"💼",personal:"👤",learning:"📚",health:"💪",other:"📌"}[y]||"📌",x=n.notes&&n.notes.trim().length>0,W=n.recurring?.enabled;return`
        <div class="task-item priority-${f} ${p?"active-task":""} ${W?"recurring-task":""}" data-task-id="${n.id}" onclick="setActiveTask('${n.id}', event)">
          <div class="task-header">
            <div class="task-title-wrapper">
              <div class="task-badges">
                <span class="priority-badge priority-${f}">${w}</span>
                <span class="category-badge">${$} ${E}</span>
                ${x?'<span class="notes-indicator" title="'+r.t("hasNotes")+'">📝</span>':""}
                ${W?'<span class="recurring-badge" title="'+r.t("recurringTask")+'">🔄</span>':""}
              </div>
              <h4>${n.title}</h4>
            </div>
            <div class="task-actions">
              <button class="task-btn move" onclick="event.stopPropagation(); moveTaskUp('${n.id}')" title="${r.t("moveUp")}">
                <i class="fa-solid fa-arrow-up"></i>
              </button>
              <button class="task-btn move" onclick="event.stopPropagation(); moveTaskDown('${n.id}')" title="${r.t("moveDown")}">
                <i class="fa-solid fa-arrow-down"></i>
              </button>
              <button class="task-btn history" onclick="event.stopPropagation(); openTaskHistory('${n.id}')" title="${r.t("history")}">
                <i class="fa-solid fa-clock-rotate-left"></i>
              </button>
              <button class="task-btn notes" onclick="event.stopPropagation(); openTaskNotes('${n.id}')" title="${r.t("notes")}">
                <i class="fa-solid fa-note-sticky"></i>
              </button>
              <button class="task-btn complete" onclick="event.stopPropagation(); completeTask('${n.id}')" title="${r.t("complete")}">
                <i class="fa-solid fa-check"></i>
              </button>
              <button class="task-btn delete" onclick="event.stopPropagation(); deleteTask('${n.id}')" title="${r.t("delete")}">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
          ${x?'<div class="task-notes-preview">'+(n.notes?.substring(0,100)||"")+(n.notes&&n.notes.length>100?"...":"")+"</div>":""}
          <div class="task-progress-bar">
            <div class="task-progress-fill" style="width: ${u}%"></div>
          </div>
          <div class="task-stats">
            <span>🍅 ${n.pomodorosUsed}/${n.estimatedPomodoros}</span>
          </div>
          ${p?'<div class="active-task-badge"><i class="fa-solid fa-check-circle"></i> '+r.t("activeTask")+"</div>":""}
          ${u>=100?'<div class="completed-badge"><i class="fa-solid fa-trophy"></i> '+r.t("taskCompleted")+"</div>":""}
        </div>
      `}).join(""),d.length===0?o.innerHTML=`<div class="empty-state"><i class="fa-solid fa-check-circle"></i><p>${r.t("noCompletedTasks")}</p></div>`:o.innerHTML=d.map(n=>{const u=n.notes&&n.notes.trim().length>0;return`
        <div class="task-item completed" data-task-id="${n.id}">
          <div class="task-header">
            <h4><s>${n.title}</s></h4>
            <div class="task-actions">
              <button class="task-btn history" onclick="event.stopPropagation(); openTaskHistory('${n.id}')" title="${r.t("history")}">
                <i class="fa-solid fa-clock-rotate-left"></i>
              </button>
              <button class="task-btn notes" onclick="event.stopPropagation(); openTaskNotes('${n.id}')" title="${r.t("notes")}">
                <i class="fa-solid fa-note-sticky"></i>
              </button>
              <button class="task-btn undo" onclick="uncompleteTask('${n.id}')" title="${r.t("undo")}">
                <i class="fa-solid fa-rotate-left"></i>
              </button>
              <button class="task-btn delete" onclick="deleteTask('${n.id}')" title="${r.t("delete")}">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
          ${u?'<div class="task-notes-preview">'+(n.notes?.substring(0,100)||"")+(n.notes&&n.notes.length>100?"...":"")+"</div>":""}
          <div class="task-stats">
            <span>🍅 ${n.pomodorosUsed}/${n.estimatedPomodoros}</span>
          </div>
          <div class="completed-badge"><i class="fa-solid fa-check"></i> ${r.t("completed")}</div>
        </div>
      `}).join("")}function L(){const s=v.getActiveGoals(),t=v.getCompletedGoals(),e=v.getActiveGoalId(),a=document.getElementById("goal-list"),o=document.getElementById("completed-goal-list");s.length===0?a.innerHTML=`<div class="empty-state"><i class="fa-solid fa-bullseye"></i><p>${r.t("noGoalsYet")}</p></div>`:a.innerHTML=s.map(i=>{const d=v.getProgressPercentage(i.id),n=i.id===e;return`
        <div class="goal-item ${n?"active-goal":""}" data-goal-id="${i.id}" onclick="setActiveGoal('${i.id}', event)">
          <div class="goal-header">
            <h4>${i.title}</h4>
            <button class="goal-delete-btn" onclick="event.stopPropagation(); deleteGoal('${i.id}')" title="${r.t("delete")}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
          <div class="goal-progress-bar">
            <div class="goal-progress-fill" style="width: ${d}%"></div>
          </div>
          <div class="goal-stats">
            <span>${i.current}/${i.target} ${r.t("pomodoros")}</span>
          </div>
          ${n?'<div class="active-goal-badge"><i class="fa-solid fa-check-circle"></i> '+r.t("activeGoal")+"</div>":""}
        </div>
      `}).join(""),t.length===0?o.innerHTML='<div class="empty-state"><i class="fa-solid fa-trophy"></i><p>Henüz tamamlanan hedef yok</p></div>':o.innerHTML=t.map(i=>{const n=i.achievedAt?new Date(i.achievedAt).toLocaleDateString():"";return`
        <div class="goal-item completed" data-goal-id="${i.id}">
          <div class="goal-header">
            <h4><s>${i.title}</s></h4>
            <button class="goal-delete-btn" onclick="event.stopPropagation(); deleteGoal('${i.id}')" title="${r.t("delete")}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
          <div class="goal-progress-bar">
            <div class="goal-progress-fill" style="width: 100%"></div>
          </div>
          <div class="goal-stats">
            <span>${i.current}/${i.target} ${r.t("pomodoros")}</span>
          </div>
          <div class="completed-badge">
            <i class="fa-solid fa-trophy"></i> ${r.t("goalAchieved")} - ${n}
          </div>
        </div>
      `}).join("")}function K(){const s=m.getSettings(),t=m.getNotificationSettings();document.getElementById("pomodoro-duration").value=s.pomodoroDuration.toString(),document.getElementById("short-break-duration").value=s.shortBreakDuration.toString(),document.getElementById("long-break-duration").value=s.longBreakDuration.toString(),document.getElementById("sound-enabled").checked=s.soundEnabled,document.getElementById("notifications-enabled").checked=s.notificationsEnabled,document.getElementById("volume-slider").value=t.volume.toString(),F()}function F(){const s=M.getThemes(),t=M.getCurrentTheme(),e=document.getElementById("theme-selector");e.innerHTML=s.map(a=>`
    <div class="theme-option ${a.id===t.id?"active":""}" 
         data-theme="${a.id}" 
         style="background: ${a.colors.primary}; color: ${a.colors.text}">
      ${a.name}
  </div>
  `).join(""),e.querySelectorAll(".theme-option").forEach(a=>{a.addEventListener("click",()=>{const o=a.getAttribute("data-theme");M.setTheme(o),m.setTheme(o),F()})})}function ct(){document.getElementById("pomodoro-duration")?.addEventListener("change",s=>{const t=s.target,e=parseInt(t.value);if(isNaN(e)||e<1||e>60){k.error(r.t("pomodoroDurationError")),t.value=m.getPomodoroDuration().toString();return}m.setPomodoroDuration(e),g.updateSettings(),I(),k.success(r.t("settingsUpdated"))}),document.getElementById("short-break-duration")?.addEventListener("change",s=>{const t=s.target,e=parseInt(t.value);if(isNaN(e)||e<1||e>30){k.error(r.t("shortBreakDurationError")),t.value=m.getShortBreakDuration().toString();return}m.setShortBreakDuration(e),g.updateSettings(),I(),k.success(r.t("settingsUpdated"))}),document.getElementById("long-break-duration")?.addEventListener("change",s=>{const t=s.target,e=parseInt(t.value);if(isNaN(e)||e<1||e>60){k.error(r.t("longBreakDurationError")),t.value=m.getLongBreakDuration().toString();return}m.setLongBreakDuration(e),g.updateSettings(),I(),k.success(r.t("settingsUpdated"))}),document.getElementById("sound-enabled")?.addEventListener("change",s=>{const t=s.target.checked;m.setSoundEnabled(t)}),document.getElementById("notifications-enabled")?.addEventListener("change",s=>{const t=s.target.checked;m.setNotificationsEnabled(t)}),document.getElementById("volume-slider")?.addEventListener("input",s=>{const t=parseFloat(s.target.value);m.setVolume(t)}),document.getElementById("language-selector")?.addEventListener("change",s=>{const t=s.target.value;r.setLanguage(t),m.setLanguage(t)}),document.getElementById("export-backup-btn")?.addEventListener("click",()=>{U.exportBackup(),alert(r.t("backupExported")||"Yedek başarıyla indirildi!")}),document.getElementById("import-backup-btn")?.addEventListener("click",()=>{document.getElementById("import-backup-input")?.click()}),document.getElementById("import-backup-input")?.addEventListener("change",async s=>{const t=s.target,e=t.files?.[0];if(e){const a=await U.importBackup(e);a.success?confirm(a.message+`

`+r.t("reloadPageConfirm"))&&window.location.reload():alert(a.message),t.value=""}}),document.getElementById("reset-settings-btn")?.addEventListener("click",()=>{confirm(r.t("resetSettingsConfirm"))&&(m.resetToDefaults(),g.updateSettings(),K(),T())}),document.getElementById("test-sound-btn")?.addEventListener("click",()=>{b.enableAudio(),g.getMode()==="pomodoro"?b.playWorkSound():b.playBreakSound()})}let C="all",H="",G=null;function ut(s){const t=c.getTask(s);if(!t)return;G=s;const e=document.getElementById("notes-modal"),a=document.getElementById("task-notes-textarea");e&&a&&(a.value=t.notes||"",e.classList.add("active"),document.querySelector(".shadowBg")?.classList.add("active"),setTimeout(()=>a.focus(),100))}function _(){document.getElementById("notes-modal")?.classList.remove("active"),document.querySelector(".shadowBg")?.classList.remove("active"),G=null}function mt(){if(!G)return;const t=document.getElementById("task-notes-textarea").value.trim();c.updateTask(G,{notes:t}),_(),h()}function pt(s){const t=c.getTask(s);if(!t)return;const e=document.getElementById("history-modal"),a=document.getElementById("history-list");if(e&&a){const o=t.pomodoroHistory||[];o.length===0?a.innerHTML=`<div class="empty-state"><i class="fa-solid fa-clock"></i><p>${r.t("noHistory")}</p></div>`:a.innerHTML=o.map((i,d)=>{const n=new Date(i.completedAt),u=n.toLocaleDateString(),p=n.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return`
          <div class="history-item">
            <div class="history-icon">🍅</div>
            <div class="history-details">
              <div class="history-number">Pomodoro #${d+1}</div>
              <div class="history-time">${u} - ${p}</div>
              <div class="history-duration">${i.duration} ${r.t("minutes")}</div>
            </div>
          </div>
        `}).reverse().join(""),e.classList.add("active"),document.querySelector(".shadowBg")?.classList.add("active")}}function gt(){document.getElementById("history-modal")?.classList.remove("active"),document.querySelector(".shadowBg")?.classList.remove("active")}function ht(s){const t=c.getActiveTasks(),e=t.findIndex(a=>a.id===s);if(e>0){const a=c.getTasks(),o=a.findIndex(n=>n.id===s),i=t[e-1].id,d=a.findIndex(n=>n.id===i);[a[o],a[d]]=[a[d],a[o]],c.tasks=a,c.save(),h()}}function ft(s){const t=c.getActiveTasks(),e=t.findIndex(a=>a.id===s);if(e<t.length-1&&e!==-1){const a=c.getTasks(),o=a.findIndex(n=>n.id===s),i=t[e+1].id,d=a.findIndex(n=>n.id===i);[a[o],a[d]]=[a[d],a[o]],c.tasks=a,c.save(),h()}}function kt(){const s=c.getActiveTasks();s.length!==0&&confirm(`${s.length} görevi tamamlamak istediğinizden emin misiniz?`)&&(s.forEach(t=>{c.completeTask(t.id)}),h(),T())}function vt(){const s=c.getCompletedTasks();s.length!==0&&confirm(`${s.length} tamamlanan görevi silmek istediğinizden emin misiniz?`)&&(s.forEach(t=>{c.deleteTask(t.id)}),h(),T())}window.openTaskNotes=ut;window.openTaskHistory=pt;window.moveTaskUp=ht;window.moveTaskDown=ft;window.completeAllTasks=kt;window.deleteCompletedTasks=vt;function R(){const s=document.getElementById("task-input"),t=document.getElementById("task-pomodoros"),e=document.getElementById("task-priority"),a=document.getElementById("task-category"),o=document.getElementById("task-goal"),i=document.getElementById("task-recurring"),d=s.value.trim(),n=parseInt(t.value),u=e.value,p=a.value,f=o.value||void 0,w=i.checked;if(!d){k.warning(r.t("taskTitleRequired")),s.focus();return}if(isNaN(n)||n<1||n>20){k.error(r.t("pomodoroCountError")),t.focus();return}if(d){const y=c.addTask(d,void 0,n);if(y){const E=w?{enabled:!0,frequency:"daily"}:void 0;if(c.updateTask(y.id,{priority:u,category:p,recurring:E}),f){const $=v.getGoal(f);if($){const x=$.linkedTaskIds||[];x.push(y.id),v.updateGoal(f,{linkedTaskIds:x})}}}s.value="",t.value="1",e.value="medium",a.value="work",o.value="",i.checked=!1,h(),L(),T()}}window.completeTask=s=>{c.completeTask(s),h(),T()};window.deleteTask=s=>{c.deleteTask(s),h(),T()};function yt(){const s=document.getElementById("goal-input"),t=document.getElementById("goal-target"),e=s.value.trim(),a=parseInt(t.value);if(!e){k.warning(r.t("goalTitleRequired")),s.focus();return}if(isNaN(a)||a<1||a>50){k.error(r.t("goalTargetError")),t.focus();return}v.createGoal(e,a,"daily"),s.value="",t.value="5",L(),T(),k.success(r.t("goalAddedSuccessfully"))}window.setActiveTask=function(s,t){t&&t.stopPropagation(),c.getActiveTaskId()===s?c.setActiveTask(null):c.setActiveTask(s),h()};window.completeTask=function(s){c.completeTask(s),h(),L();const t=c.getActiveTasks();t.length>0&&setTimeout(()=>{confirm(r.t("nextTaskQuestion"))&&(c.setActiveTask(t[0].id),h(),T())},1e3)};window.uncompleteTask=function(s){c.uncompleteTask(s),h()};window.deleteTask=function(s){confirm(r.t("confirmDeleteTask"))&&(c.deleteTask(s),h())};window.setActiveGoal=function(s,t){t&&t.stopPropagation(),v.getActiveGoalId()===s?v.setActiveGoal(null):v.setActiveGoal(s),L(),T()};window.deleteGoal=function(s){confirm(r.t("confirmDeleteGoal"))&&(v.deleteGoal(s),L())};function bt(s){const t=Math.max(0,s),e=Math.floor(t/60),a=Math.floor(t%60);return`${e}h ${a}m`}function T(){const s=document.getElementById("cycle-count");s&&(s.textContent=g.getCycle().toString());const t=B.getTodaySessions(),e=document.getElementById("today-count");e&&(e.textContent=t.length.toString());const a=c.getActiveTask(),o=document.getElementById("active-task-display"),i=document.getElementById("active-task-text");a&&o&&i?(i.textContent=`${r.t("activeTask")}: ${a.title} (${a.pomodorosUsed}/${a.estimatedPomodoros})`,o.style.display="flex"):o&&(o.style.display="none");const d=v.getActiveGoal(),n=document.getElementById("active-goal-display"),u=document.getElementById("active-goal-text");d&&n&&u?(u.textContent=`${r.t("activeGoal")}: ${d.title} (${d.current}/${d.target})`,n.style.display="flex"):n&&(n.style.display="none"),I(),z(g.getMode()),q(g.getMode());const p=document.getElementById("language-selector");p&&(p.value=r.getLanguage()),r.updateUI()}"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").then(s=>{console.log("SW registered: ",s)}).catch(s=>{console.log("SW registration failed: ",s)})});document.readyState==="loading"?document.addEventListener("DOMContentLoaded",O):O();
