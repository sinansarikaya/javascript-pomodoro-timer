(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function e(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(o){if(o.ep)return;o.ep=!0;const i=e(o);fetch(o.href,i)}})();class B{static workSound;static breakSound;static volume=.5;static initialized=!1;static userInteracted=!1;static init(){if(!this.initialized)try{this.workSound=new Audio,this.breakSound=new Audio,this.workSound.src="/work.mp3",this.breakSound.src="/break.mp3",this.workSound.volume=this.volume,this.breakSound.volume=this.volume,this.workSound.preload="auto",this.breakSound.preload="auto",this.workSound.autoplay=!1,this.breakSound.autoplay=!1,this.workSound.load(),this.breakSound.load(),this.addUserInteractionListener(),this.initialized=!0,console.log("Audio manager initialized successfully")}catch(t){console.error("Failed to initialize audio:",t)}}static addUserInteractionListener(){const t=()=>{this.userInteracted=!0,console.log("User interaction detected, audio enabled"),document.removeEventListener("click",t),document.removeEventListener("keydown",t),document.removeEventListener("touchstart",t)};document.addEventListener("click",t),document.addEventListener("keydown",t),document.addEventListener("touchstart",t)}static playWorkSound(){if(this.initialized||this.init(),!this.userInteracted){console.log("Audio not enabled yet, user interaction required");return}this.workSound&&(this.workSound.currentTime=0,this.workSound.play().catch(t=>{console.log("Work sound play failed:",t),this.enableAudioContext(),this.playSystemBeep()}))}static playBreakSound(){if(this.initialized||this.init(),!this.userInteracted){console.log("Audio not enabled yet, user interaction required");return}this.breakSound&&(this.breakSound.currentTime=0,this.breakSound.play().catch(t=>{console.log("Break sound play failed:",t),this.enableAudioContext(),this.playSystemBeep()}))}static enableAudioContext(){if(typeof AudioContext<"u"){const t=new AudioContext;t.state==="suspended"&&t.resume().then(()=>{console.log("Audio context resumed")})}}static playSystemBeep(){try{const t=new(window.AudioContext||window.webkitAudioContext),e=t.createOscillator(),a=t.createGain();e.connect(a),a.connect(t.destination),e.frequency.setValueAtTime(800,t.currentTime),a.gain.setValueAtTime(this.volume*.3,t.currentTime),a.gain.exponentialRampToValueAtTime(.01,t.currentTime+.5),e.start(t.currentTime),e.stop(t.currentTime+.5),console.log("System beep played as fallback")}catch(t){console.log("System beep failed:",t)}}static setVolume(t){this.volume=Math.max(0,Math.min(1,t)),this.workSound&&(this.workSound.volume=this.volume),this.breakSound&&(this.breakSound.volume=this.volume)}static getVolume(){return this.volume}static enableAudio(){this.userInteracted=!0,console.log("Audio manually enabled")}}class c{static prefix="pomodoro_";static set(t,e){try{localStorage.setItem(this.prefix+t,JSON.stringify(e))}catch(a){console.error("Error saving to localStorage:",a)}}static get(t,e){try{const a=localStorage.getItem(this.prefix+t);return a?JSON.parse(a):e}catch(a){return console.error("Error reading from localStorage:",a),e}}static remove(t){try{localStorage.removeItem(this.prefix+t)}catch(e){console.error("Error removing from localStorage:",e)}}static clear(){try{Object.keys(localStorage).forEach(e=>{e.startsWith(this.prefix)&&localStorage.removeItem(e)})}catch(t){console.error("Error clearing localStorage:",t)}}}class E{static formatDate(t){return(typeof t=="string"?new Date(t):t).toISOString().split("T")[0]}static formatTime(t){return t.toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"})}static getWeekStart(t){const e=new Date(t),a=e.getDay(),o=e.getDate()-a+(a===0?-6:1);return new Date(e.setDate(o))}static getWeekEnd(t){const e=this.getWeekStart(t),a=new Date(e);return a.setDate(e.getDate()+6),a}static getWeekString(t){const e=this.getWeekStart(t),a=this.getWeekEnd(t);return`${this.formatDate(e)} - ${this.formatDate(a)}`}static isToday(t){const e=new Date;return this.formatDate(t)===this.formatDate(e)}static isThisWeek(t){const e=new Date,a=this.getWeekStart(e),o=this.getWeekEnd(e);return t>=a&&t<=o}static addDays(t,e){const a=new Date(t);return a.setDate(a.getDate()+e),a}}class P{static sessions=[];static dailyStats=[];static init(){const t=c.get("statistics",{});t.sessions&&t.dailyStats?(this.sessions=t.sessions,this.dailyStats=t.dailyStats):(this.sessions=c.get("sessions",[]),this.dailyStats=c.get("dailyStats",[]))}static addSession(t){this.sessions.push(t),this.updateDailyStats(t),this.save()}static getSessions(){return this.sessions}static getTodaySessions(){return this.sessions.filter(t=>E.isToday(new Date(t.startTime)))}static getWeekSessions(){return this.sessions.filter(t=>E.isThisWeek(new Date(t.startTime)))}static getDailyStats(){return this.dailyStats}static getTodayStats(){const t=E.formatDate(new Date);return this.dailyStats.find(e=>e.date===t)||null}static getWeeklyStats(){const t=new Map;return this.dailyStats.forEach(e=>{const a=new Date(e.date),o=E.getWeekString(a);t.has(o)||t.set(o,{week:o,pomodorosCompleted:0,totalTime:0,tasksCompleted:0,averagePerDay:0});const i=t.get(o);i.pomodorosCompleted+=e.pomodorosCompleted,i.totalTime+=e.totalTime,i.tasksCompleted+=e.tasksCompleted}),t.forEach(e=>{e.averagePerDay=Math.round(e.pomodorosCompleted/7*10)/10}),Array.from(t.values()).sort((e,a)=>new Date(e.week.split(" - ")[0]).getTime()-new Date(a.week.split(" - ")[0]).getTime())}static getTotalPomodoros(){return this.sessions.filter(t=>t.mode==="pomodoro"&&t.completed).length}static getTotalTime(){return this.sessions.filter(t=>t.completed).reduce((t,e)=>t+e.duration,0)}static getStreak(){const t=this.dailyStats.sort((o,i)=>new Date(i.date).getTime()-new Date(o.date).getTime());let e=0,a=new Date;for(const o of t){const i=new Date(o.date),l=Math.floor((a.getTime()-i.getTime())/(1e3*60*60*24));if(l===e&&o.pomodorosCompleted>0)e++;else if(l>e+1)break}return e}static updateDailyStats(t){const e=E.formatDate(new Date(t.startTime));let a=this.dailyStats.find(o=>o.date===e);a||(a={date:e,pomodorosCompleted:0,totalTime:0,tasksCompleted:0,goal:8},this.dailyStats.push(a)),t.completed&&(t.mode==="pomodoro"&&a.pomodorosCompleted++,a.totalTime+=t.duration)}static save(){c.set("statistics",{sessions:this.sessions,dailyStats:this.dailyStats}),c.set("sessions",this.sessions),c.set("dailyStats",this.dailyStats)}static clearData(){this.sessions=[],this.dailyStats=[],this.save()}}class v{static container=null;static init(){this.container||(this.container=document.createElement("div"),this.container.className="toast-container",document.body.appendChild(this.container))}static show(t,e="info",a=3e3){this.init();const o=document.createElement("div");o.className=`toast toast-${e}`;const i=this.getIcon(e);o.innerHTML=`
      <div class="toast-icon">${i}</div>
      <div class="toast-message">${t}</div>
      <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `,this.container.appendChild(o),setTimeout(()=>o.classList.add("toast-show"),10),setTimeout(()=>{o.classList.remove("toast-show"),setTimeout(()=>o.remove(),300)},a)}static success(t,e){this.show(t,"success",e)}static error(t,e){this.show(t,"error",e)}static warning(t,e){this.show(t,"warning",e)}static info(t,e){this.show(t,"info",e)}static getIcon(t){switch(t){case"success":return"✓";case"error":return"✕";case"warning":return"⚠";case"info":return"ℹ"}}}const at={tr:{pomodoro:"Pomodoro",shortBreak:"Kısa Mola",longBreak:"Uzun Mola",start:"Başlat",pause:"Duraklat",stop:"Durdur",reset:"Sıfırla",statistics:"İstatistikler (S)",tasks:"Görevler (T)",goals:"Hedefler (G)",settings:"Ayarlar (A)",help:"Yardım (H)",youAreInPomodoroTime:"Pomodoro zamanındasınız",youAreInShortBreak:"Kısa moladasınız",youAreInLongBreak:"Uzun moladasınız",cycle:"Döngü",today:"Bugün",pomodoros:"pomodoro",totalPomodoros:"Toplam Pomodoro",totalTime:"Toplam Süre",streak:"Seri",thisWeek:"Bu Hafta",weeklyActivity:"Haftalık Aktivite",taskProgress:"Görev İlerlemesi",days:"gün",addNewTask:"Yeni görev ekle...",newTask:"Yeni Görev",estimatedPomodoros:"Tahmini Pomodoro",usedPomodoros:"Kullanılan Pomodoro",completed:"Tamamlandı",active:"Aktif",noTasksYet:"Henüz görev yok. Yukarıdan ekleyin!",noCompletedTasks:"Tamamlanan görev yok",complete:"Tamamla",delete:"Sil",undo:"Geri Al",confirmDeleteTask:"Bu görevi silmek istediğinizden emin misiniz?",confirmDeleteGoal:"Bu hedefi silmek istediğinizden emin misiniz?",activeTask:"Aktif Görev",high:"Yüksek",medium:"Orta",low:"Düşük",work:"İş",personal:"Kişisel",learning:"Öğrenme",health:"Sağlık",other:"Diğer",all:"Tümü",searchTasks:"Görevlerde ara...",noGoalFilter:"Hedef Yok",notes:"Notlar",hasNotes:"Not var",addNote:"Not ekle",saveNote:"Notu Kaydet",cancel:"İptal",history:"Geçmiş",pomodoroHistory:"Pomodoro Geçmişi",noHistory:"Henüz pomodoro tamamlanmamış",completedOn:"Tamamlanma:",completeAll:"Tümünü Tamamla",deleteCompleted:"Tamamlananları Sil",recurringTask:"Tekrarlayan görev",moveUp:"Yukarı taşı",moveDown:"Aşağı taşı",addNewGoal:"Yeni hedef ekle...",goalName:"Hedef adı...",targetNumber:"Hedef sayısı",progress:"İlerleme",noGoalsYet:"Henüz hedef yok. Yukarıdan ekleyin!",goalAchieved:"Hedef Ulaşıldı!",activeGoal:"Aktif Hedef",timeSettings:"Zaman Ayarları",pomodoroDuration:"Pomodoro Süresi (dakika)",shortBreakDuration:"Kısa Mola (dakika)",longBreakDuration:"Uzun Mola (dakika)",longBreakInterval:"Uzun Mola Aralığı",theme:"Tema",soundAndNotifications:"Ses ve Bildirimler",soundEffects:"Ses efektleri",notifications:"Bildirimler",soundLevel:"Ses Seviyesi",autoStartBreaks:"Molaları otomatik başlat",autoStartPomodoros:"Pomodoroları otomatik başlat",language:"Dil",selectLanguage:"Dil Seçin",minutes:"dk",testSound:"Ses Testi",resetSettings:"Ayarları Sıfırla",resetToDefaults:"Varsayılan Ayarlara Dön",pomodoroCompleted:"Pomodoro Tamamlandı!",breakCompleted:"Mola Tamamlandı!",workSessionCompleted:"{duration} dakikalık çalışma tamamlandı. Mola zamanı!",breakFinished:"Mola bitti. Yeni pomodoro başlayabilirsiniz.",notificationsEnabled:"Bildirimler başarıyla etkinleştirildi!",default:"Varsayılan",darkMode:"Karanlık Mod",lightMode:"Aydınlık Mod",ocean:"Okyanus",forest:"Orman",sunset:"Gün Batımı",whatIsPomodoroTechnique:"Pomodoro Tekniği Nedir?",step1:"ADIM 1:",step1Desc:"Bir görev seçin",step2:"ADIM 2:",step2Desc:"25 dakikalık bir zamanlayıcı kurun",step3:"ADIM 3:",step3Desc:"Zamanlayıcı bitene kadar görevinizde tam konsantrasyonla çalışın",step4:"ADIM 4:",step4Desc:"5 dakika mola verin",step5:"ADIM 5:",step5Desc:"Her 4 pomodorodan sonra 15-20 dakika uzun mola verin",features:"Özellikler",featuresDesc:`• Görev yönetimi ve takibi
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
• 3: Uzun mola`,madeWith:"Made with",by:"by",settingsUpdated:"Ayarlar güncellendi",pomodoroDurationError:"Pomodoro süresi 1-60 dakika arasında olmalıdır",shortBreakDurationError:"Kısa mola süresi 1-30 dakika arasında olmalıdır",longBreakDurationError:"Uzun mola süresi 1-60 dakika arasında olmalıdır",taskTitleRequired:"Lütfen bir görev başlığı girin",pomodoroCountError:"Pomodoro sayısı 1-20 arasında olmalıdır",goalTitleRequired:"Lütfen bir hedef başlığı girin",goalTargetError:"Hedef pomodoro sayısı 1-50 arasında olmalıdır",goalAddedSuccessfully:"Hedef başarıyla eklendi!",add:"Ekle",resetSettingsConfirm:"Tüm ayarları varsayılan değerlere sıfırlamak istediğinizden emin misiniz?",reloadPageConfirm:"Sayfayı yenilemek ister misiniz?",goalCompleted:"🎯 Hedef tamamlandı!",taskCompleted:"✅ Görev tamamlandı!",nextTaskQuestion:"Bir sonraki göreve geçmek ister misiniz?",backupExported:"Yedek başarıyla indirildi!",edit:"Düzenle",editTask:"Görev Düzenle",editGoal:"Hedef Düzenle",save:"Kaydet",update:"Güncelle",taskTitle:"Görev Başlığı",goalTitle:"Hedef Başlığı",targetPomodoros:"Hedef Pomodoro Sayısı",title:"Başlık",goal:"Hedef",noGoal:"Hedef yok",period:"Dönem",daily:"Günlük",weekly:"Haftalık",duplicateTaskName:"Bu isimde bir görev zaten mevcut!",duplicateGoalName:"Bu isimde bir hedef zaten mevcut!",taskUpdatedSuccess:"Görev başarıyla güncellendi!",goalUpdatedSuccess:"Hedef başarıyla güncellendi!",updateFailed:"Güncelleme başarısız oldu!"},en:{pomodoro:"Pomodoro",shortBreak:"Short Break",longBreak:"Long Break",start:"Start",pause:"Pause",stop:"Stop",reset:"Reset",statistics:"Statistics (S)",tasks:"Tasks (T)",goals:"Goals (G)",settings:"Settings (A)",help:"Help (H)",youAreInPomodoroTime:"You are in pomodoro time",youAreInShortBreak:"You are in short break",youAreInLongBreak:"You are in long break",cycle:"Cycle",today:"Today",pomodoros:"pomodoros",totalPomodoros:"Total Pomodoros",totalTime:"Total Time",streak:"Streak",thisWeek:"This Week",weeklyActivity:"Weekly Activity",taskProgress:"Task Progress",days:"days",addNewTask:"Add new task...",newTask:"New Task",estimatedPomodoros:"Estimated Pomodoros",usedPomodoros:"Used Pomodoros",completed:"Completed",active:"Active",noTasksYet:"No tasks yet. Add one above!",noCompletedTasks:"No completed tasks",complete:"Complete",delete:"Delete",undo:"Undo",confirmDeleteTask:"Are you sure you want to delete this task?",confirmDeleteGoal:"Are you sure you want to delete this goal?",activeTask:"Active Task",high:"High",medium:"Medium",low:"Low",work:"Work",personal:"Personal",learning:"Learning",health:"Health",other:"Other",all:"All",searchTasks:"Search tasks...",noGoalFilter:"No Goal",notes:"Notes",hasNotes:"Has notes",addNote:"Add note",saveNote:"Save Note",cancel:"Cancel",history:"History",pomodoroHistory:"Pomodoro History",noHistory:"No pomodoros completed yet",completedOn:"Completed on:",completeAll:"Complete All",deleteCompleted:"Delete Completed",recurringTask:"Recurring task",moveUp:"Move up",moveDown:"Move down",addNewGoal:"Add new goal...",goalName:"Goal name...",targetNumber:"Target number",progress:"Progress",noGoalsYet:"No goals yet. Add one above!",goalAchieved:"Goal Achieved!",activeGoal:"Active Goal",timeSettings:"Time Settings",pomodoroDuration:"Pomodoro Duration (minutes)",shortBreakDuration:"Short Break (minutes)",longBreakDuration:"Long Break (minutes)",longBreakInterval:"Long Break Interval",theme:"Theme",soundAndNotifications:"Sound and Notifications",soundEffects:"Sound effects",notifications:"Notifications",soundLevel:"Sound Level",autoStartBreaks:"Auto start breaks",autoStartPomodoros:"Auto start pomodoros",language:"Language",selectLanguage:"Select Language",minutes:"min",testSound:"Test Sound",resetSettings:"Reset Settings",resetToDefaults:"Reset to Defaults",pomodoroCompleted:"Pomodoro Completed!",breakCompleted:"Break Completed!",workSessionCompleted:"{duration} minute work session completed. Time for a break!",breakFinished:"Break finished. You can start a new pomodoro.",notificationsEnabled:"Notifications successfully enabled!",default:"Default",darkMode:"Dark Mode",lightMode:"Light Mode",ocean:"Ocean",forest:"Forest",sunset:"Sunset",whatIsPomodoroTechnique:"What is Pomodoro Technique?",step1:"STEP 1:",step1Desc:"Pick a task",step2:"STEP 2:",step2Desc:"Set a 25-minute timer",step3:"STEP 3:",step3Desc:"Work on your task with full concentration until the timer is up",step4:"STEP 4:",step4Desc:"Take a 5 minute break",step5:"STEP 5:",step5Desc:"Every 4 pomodoros, take a longer 15-20 minute break",features:"Features",featuresDesc:`• Task management and tracking
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
• 3: Long break`,madeWith:"Made with",by:"by",settingsUpdated:"Settings updated",pomodoroDurationError:"Pomodoro duration must be between 1-60 minutes",shortBreakDurationError:"Short break duration must be between 1-30 minutes",longBreakDurationError:"Long break duration must be between 1-60 minutes",taskTitleRequired:"Please enter a task title",pomodoroCountError:"Pomodoro count must be between 1-20",goalTitleRequired:"Please enter a goal title",goalTargetError:"Goal pomodoro count must be between 1-50",goalAddedSuccessfully:"Goal added successfully!",add:"Add",resetSettingsConfirm:"Are you sure you want to reset all settings to default values?",reloadPageConfirm:"Would you like to reload the page?",goalCompleted:"🎯 Goal completed!",taskCompleted:"✅ Task completed!",nextTaskQuestion:"Would you like to move to the next task?",backupExported:"Backup exported successfully!",edit:"Edit",editTask:"Edit Task",editGoal:"Edit Goal",save:"Save",update:"Update",taskTitle:"Task Title",goalTitle:"Goal Title",targetPomodoros:"Target Pomodoros",title:"Title",goal:"Goal",noGoal:"No goal",period:"Period",daily:"Daily",weekly:"Weekly",duplicateTaskName:"A task with this name already exists!",duplicateGoalName:"A goal with this name already exists!",taskUpdatedSuccess:"Task updated successfully!",goalUpdatedSuccess:"Goal updated successfully!",updateFailed:"Update failed!"}};class n{static currentLanguage="en";static init(){const t=localStorage.getItem("pomodoro_language");t?this.currentLanguage=t:this.currentLanguage=this.detectLanguage()}static detectLanguage(){return(navigator.language||navigator.userLanguage).split("-")[0].toLowerCase()==="tr"?"tr":"en"}static setLanguage(t){this.currentLanguage=t,localStorage.setItem("pomodoro_language",t),this.updateUI()}static getLanguage(){return this.currentLanguage}static getCurrentLanguage(){return this.currentLanguage}static t(t){return at[this.currentLanguage]?.[t]||t}static updateUI(){document.querySelectorAll("[data-i18n]").forEach(t=>{const e=t.getAttribute("data-i18n");e&&(t.textContent=this.t(e))}),document.querySelectorAll("[data-i18n-placeholder]").forEach(t=>{const e=t.getAttribute("data-i18n-placeholder");e&&t instanceof HTMLInputElement&&(t.placeholder=this.t(e))}),document.querySelectorAll("[data-i18n-title]").forEach(t=>{const e=t.getAttribute("data-i18n-title");e&&t.setAttribute("title",this.t(e))})}}class T{static goals=[];static activeGoalId=null;static init(){this.goals=c.get("goals",[]),this.activeGoalId=c.get("activeGoalId",null)}static createGoal(t,e,a){const o={id:this.generateId(),title:t,target:e,current:0,period:a,createdAt:new Date};return this.goals.push(o),this.save(),o}static getGoals(){return this.goals}static getActiveGoals(){return this.goals.filter(t=>!t.achievedAt)}static getCompletedGoals(){return this.goals.filter(t=>t.achievedAt)}static getGoal(t){return this.goals.find(e=>e.id===t)}static updateGoal(t,e){const a=this.goals.findIndex(o=>o.id===t);return a===-1?!1:(this.goals[a]={...this.goals[a],...e},this.save(),!0)}static editGoal(t,e,a,o){return this.getGoal(t)?this.updateGoal(t,{title:e.trim(),target:a,period:o}):!1}static setActiveGoal(t){this.activeGoalId=t,c.set("activeGoalId",t)}static getActiveGoal(){return this.activeGoalId&&this.getGoal(this.activeGoalId)||null}static getActiveGoalId(){return this.activeGoalId}static deleteGoal(t){const e=this.goals.findIndex(a=>a.id===t);return e===-1?!1:(this.goals.splice(e,1),this.save(),!0)}static updateProgress(t,e){const a=this.getGoal(t);if(!a)return!1;const o=Math.min(a.current+e,a.target),i=o>=a.target&&!a.achievedAt;return this.updateGoal(t,{current:o,achievedAt:i?new Date:a.achievedAt})}static getTodayGoal(){return this.goals.find(t=>t.period==="daily"&&E.isToday(t.createdAt)&&!t.achievedAt)||null}static getWeekGoal(){return this.goals.find(t=>t.period==="weekly"&&E.isThisWeek(t.createdAt)&&!t.achievedAt)||null}static getProgressPercentage(t){const e=this.getGoal(t);return e?Math.round(e.current/e.target*100):0}static getOverallProgress(){const t=this.goals.length,e=this.goals.filter(o=>o.achievedAt).length,a=t>0?Math.round(e/t*100):0;return{completed:e,total:t,percentage:a}}static resetDailyGoals(){this.goals.forEach(t=>{t.period==="daily"&&!E.isToday(t.createdAt)&&this.updateGoal(t.id,{current:0,achievedAt:void 0})})}static resetWeeklyGoals(){this.goals.forEach(t=>{t.period==="weekly"&&!E.isThisWeek(t.createdAt)&&this.updateGoal(t.id,{current:0,achievedAt:void 0})})}static completePomodoro(){const t=new Date;this.goals.forEach(e=>{if(e.period==="daily"&&E.isToday(e.createdAt)&&!e.achievedAt){const a=e.current+1;this.updateGoal(e.id,{current:a}),a>=e.target&&(this.updateGoal(e.id,{achievedAt:t,current:e.target}),v.success(`${n.t("goalCompleted")} ${e.title}`))}}),this.goals.forEach(e=>{if(e.period==="weekly"&&E.isThisWeek(e.createdAt)&&!e.achievedAt){const a=e.current+1;this.updateGoal(e.id,{current:a}),a>=e.target&&(this.updateGoal(e.id,{achievedAt:t,current:e.target}),v.success(`${n.t("goalCompleted")} ${e.title}`))}}),this.save()}static generateId(){return Date.now().toString(36)+Math.random().toString(36).substr(2)}static save(){c.set("goals",this.goals)}static clearData(){this.goals=[],this.save()}}class f{static settings={pomodoroDuration:25,shortBreakDuration:5,longBreakDuration:15,longBreakInterval:4,autoStartBreaks:!0,autoStartPomodoros:!0,soundEnabled:!0,notificationsEnabled:!0,theme:"default",language:"en"};static notificationSettings={workSound:"/work.mp3",breakSound:"/break.mp3",volume:.5,desktopNotifications:!0};static init(){this.settings=c.get("settings",this.settings),this.notificationSettings=c.get("notificationSettings",this.notificationSettings),B.setVolume(this.notificationSettings.volume)}static getSettings(){return{...this.settings}}static getNotificationSettings(){return{...this.notificationSettings}}static updateSettings(t){this.settings={...this.settings,...t},this.save()}static updateNotificationSettings(t){this.notificationSettings={...this.notificationSettings,...t},t.volume!==void 0&&B.setVolume(t.volume),this.save()}static getPomodoroDuration(){return this.settings.pomodoroDuration}static getShortBreakDuration(){return this.settings.shortBreakDuration}static getLongBreakDuration(){return this.settings.longBreakDuration}static getLongBreakInterval(){return this.settings.longBreakInterval}static isAutoStartBreaks(){return this.settings.autoStartBreaks}static isAutoStartPomodoros(){return this.settings.autoStartPomodoros}static isSoundEnabled(){return this.settings.soundEnabled}static isNotificationsEnabled(){return this.settings.notificationsEnabled}static getTheme(){return this.settings.theme}static getLanguage(){return this.settings.language}static setPomodoroDuration(t){this.updateSettings({pomodoroDuration:Math.max(1,Math.min(60,t))})}static setShortBreakDuration(t){this.updateSettings({shortBreakDuration:Math.max(1,Math.min(30,t))})}static setLongBreakDuration(t){this.updateSettings({longBreakDuration:Math.max(1,Math.min(60,t))})}static setLongBreakInterval(t){this.updateSettings({longBreakInterval:Math.max(1,Math.min(10,t))})}static setAutoStartBreaks(t){this.updateSettings({autoStartBreaks:t})}static setAutoStartPomodoros(t){this.updateSettings({autoStartPomodoros:t})}static setSoundEnabled(t){this.updateSettings({soundEnabled:t})}static setNotificationsEnabled(t){this.updateSettings({notificationsEnabled:t})}static setTheme(t){this.updateSettings({theme:t})}static setLanguage(t){this.updateSettings({language:t})}static setVolume(t){this.updateNotificationSettings({volume:Math.max(0,Math.min(1,t))})}static setDesktopNotifications(t){this.updateNotificationSettings({desktopNotifications:t})}static resetToDefaults(){this.settings={pomodoroDuration:25,shortBreakDuration:5,longBreakDuration:15,longBreakInterval:4,autoStartBreaks:!1,autoStartPomodoros:!1,soundEnabled:!0,notificationsEnabled:!0,theme:"default",language:"tr"},this.notificationSettings={workSound:"/work.mp3",breakSound:"/break.mp3",volume:.5,desktopNotifications:!0},this.save(),B.setVolume(this.notificationSettings.volume)}static exportSettings(){return JSON.stringify({settings:this.settings,notificationSettings:this.notificationSettings},null,2)}static importSettings(t){try{const e=JSON.parse(t);return e.settings&&(this.settings={...this.settings,...e.settings}),e.notificationSettings&&(this.notificationSettings={...this.notificationSettings,...e.notificationSettings}),this.save(),!0}catch(e){return console.error("Error importing settings:",e),!1}}static save(){c.set("settings",this.settings),c.set("notificationSettings",this.notificationSettings)}}class m{static tasks=[];static activeTaskId=null;static init(){this.tasks=c.get("tasks",[]),this.activeTaskId=c.get("activeTaskId",null)}static addTask(t,e,a=1){const o={id:this.generateId(),title:t,description:e,completed:!1,pomodorosUsed:0,estimatedPomodoros:a,createdAt:new Date};return this.tasks.push(o),this.save(),o}static getTasks(){return this.tasks}static getActiveTasks(){return this.tasks.filter(t=>!t.completed)}static getCompletedTasks(){return this.tasks.filter(t=>t.completed)}static getTask(t){return this.tasks.find(e=>e.id===t)}static updateTask(t,e){const a=this.tasks.findIndex(o=>o.id===t);return a===-1?!1:(this.tasks[a]={...this.tasks[a],...e},this.save(),!0)}static editTask(t,e,a,o,i,l,r){return this.getTask(t)?this.updateTask(t,{title:e.trim(),estimatedPomodoros:a,notes:o?.trim()||"",goalId:i||void 0,category:l||"work",recurring:r?{enabled:!0,frequency:"daily"}:void 0}):!1}static completeTask(t){const e=this.getTask(t);if(!e)return!1;const a=this.updateTask(t,{completed:!0,completedAt:new Date});return a&&v.success(`${n.t("taskCompleted")} ${e.title}`),a}static deleteTask(t){const e=this.tasks.findIndex(l=>l.id===t);if(e===-1)return!1;const a=this.tasks[e],o=this.getArchivedTasks(),i={...a,archivedAt:new Date().toISOString(),deletedAt:new Date().toISOString()};return o.push(i),c.set("archived_tasks",o),this.tasks.splice(e,1),this.save(),!0}static getArchivedTasks(){return c.get("archived_tasks",[])}static restoreTask(t){const e=this.getArchivedTasks(),a=e.findIndex(l=>l.id===t);if(a===-1)return!1;const o=e[a],{...i}=o;return this.tasks.push(i),this.save(),e.splice(a,1),c.set("archived_tasks",e),!0}static permanentlyDeleteTask(t){const e=this.getArchivedTasks(),a=e.findIndex(o=>o.id===t);return a===-1?!1:(e.splice(a,1),c.set("archived_tasks",e),!0)}static addPomodoroToTask(t){const e=this.getTask(t);if(!e)return!1;const a=e.pomodoroHistory||[];return a.push({completedAt:new Date,duration:f.getPomodoroDuration()}),this.updateTask(t,{pomodorosUsed:e.pomodorosUsed+1,pomodoroHistory:a})}static setActiveTask(t){this.activeTaskId=t,c.set("activeTaskId",t)}static getActiveTask(){return this.activeTaskId&&this.getTask(this.activeTaskId)||null}static getActiveTaskId(){return this.activeTaskId}static addPomodoroToActiveTask(){return this.activeTaskId?this.addPomodoroToTask(this.activeTaskId):!1}static uncompleteTask(t){return this.updateTask(t,{completed:!1,completedAt:void 0})}static getTasksByProgress(){const t=this.tasks.length;return{completed:this.tasks.filter(a=>a.completed).length,total:t}}static getTotalEstimatedPomodoros(){return this.getActiveTasks().reduce((t,e)=>t+e.estimatedPomodoros,0)}static getTotalUsedPomodoros(){return this.tasks.reduce((t,e)=>t+e.pomodorosUsed,0)}static generateId(){return Date.now().toString(36)+Math.random().toString(36).substr(2)}static save(){c.set("tasks",this.tasks)}static clearData(){this.tasks=[],this.activeTaskId=null,this.save(),c.set("activeTaskId",null)}}class y{static timeData;static interval=null;static currentSession=null;static callbacks={};static init(){this.timeData={pomodoro:f.getPomodoroDuration(),shortBreak:f.getShortBreakDuration(),longBreak:f.getLongBreakDuration(),cycle:0,mode:"pomodoro",status:!1};const t=c.get("timerState",null);t&&typeof t=="object"&&(this.timeData={...this.timeData,...t})}static getTimeData(){return{...this.timeData}}static getCurrentTime(){return this.timeData.mode==="pomodoro"?this.timeData.pomodoro*60:this.timeData.mode==="short"?this.timeData.shortBreak*60:this.timeData.longBreak*60}static start(){this.timeData.status||(this.timeData.status=!0,this.currentSession={id:this.generateId(),startTime:new Date,duration:this.getCurrentTime(),mode:this.timeData.mode,completed:!1},this.interval=setInterval(()=>{this.tick()},1e3),this.callbacks.onStart?.())}static pause(){this.timeData.status=!1,this.interval&&(clearInterval(this.interval),this.interval=null)}static stop(){this.pause(),this.timeData.cycle=0,this.timeData.mode="pomodoro",this.currentSession=null}static reset(){this.stop(),this.timeData.mode="pomodoro",this.timeData.cycle=0}static setMode(t){const e=this.timeData.status;this.pause(),this.timeData.mode=t,this.currentSession=null,this.saveState(),this.callbacks.onModeChange?.(t),f.isSoundEnabled()&&(t==="pomodoro"?B.playWorkSound():B.playBreakSound()),this.callbacks.onTick?.(this.getCurrentTime()),e&&setTimeout(()=>{this.start()},100)}static setCallbacks(t){this.callbacks={...this.callbacks,...t}}static tick(){this.currentSession&&this.timeData.status&&(this.currentSession.duration--,this.callbacks.onTick?.(this.currentSession.duration),this.currentSession.duration<=0&&this.completeSession())}static completeSession(){const t=this.timeData.mode;this.pause(),this.currentSession&&(this.currentSession.completed=!0,this.currentSession.endTime=new Date,this.currentSession.mode==="pomodoro"&&(P.addSession(this.currentSession),T.completePomodoro(),m.addPomodoroToActiveTask())),this.switchToNextMode(),f.isSoundEnabled()&&(t==="pomodoro"?B.playBreakSound():B.playWorkSound()),f.isNotificationsEnabled()&&this.showNotification(t),this.callbacks.onComplete?.(t),this.shouldAutoStart()&&setTimeout(()=>{this.start()},1e3)}static switchToNextMode(){switch(this.timeData.mode){case"pomodoro":this.timeData.cycle++,this.timeData.cycle%f.getLongBreakInterval()===0?this.timeData.mode="long":this.timeData.mode="short";break;case"short":case"long":this.timeData.mode="pomodoro";break}this.saveState(),this.callbacks.onModeChange?.(this.timeData.mode)}static shouldAutoStart(){return this.timeData.mode==="pomodoro"?f.isAutoStartPomodoros():f.isAutoStartBreaks()}static showNotification(t){if("Notification"in window)if(Notification.permission==="granted"){const e=t||this.timeData.mode,a=e==="pomodoro"?n.t("pomodoroCompleted"):n.t("breakCompleted"),o=e==="pomodoro"?n.t("workSessionCompleted").replace("{duration}",f.getPomodoroDuration().toString()):n.t("breakFinished");try{const i=new Notification(a,{body:o,icon:"/favicon.svg",badge:"/favicon.svg",requireInteraction:!1,silent:!1,tag:"pomodoro-timer"});setTimeout(()=>{i.close()},1e4)}catch{}}else Notification.permission==="default"&&Notification.requestPermission().then(e=>{e==="granted"&&setTimeout(()=>{this.showNotification(t)},100)}).catch(()=>{})}static requestNotificationPermission(){"Notification"in window&&Notification.permission==="default"&&Notification.requestPermission().then(t=>{t==="granted"&&new Notification("Pomodoro Timer",{body:n.t("notificationsEnabled"),icon:"/favicon.svg"})}).catch(()=>{})}static updateSettings(){this.timeData.pomodoro=f.getPomodoroDuration(),this.timeData.shortBreak=f.getShortBreakDuration(),this.timeData.longBreak=f.getLongBreakDuration(),this.saveState()}static saveState(){c.set("timerState",{mode:this.timeData.mode,cycle:this.timeData.cycle,pomodoro:this.timeData.pomodoro,shortBreak:this.timeData.shortBreak,longBreak:this.timeData.longBreak})}static generateId(){return Date.now().toString(36)+Math.random().toString(36).substr(2)}static getCurrentSession(){return this.currentSession}static isRunning(){return this.timeData.status}static getCycle(){return this.timeData.cycle}static getMode(){return this.timeData.mode}}class H{static themes=[{id:"default",name:"🍅 Classic",colors:{primary:"#3d5a80",secondary:"#5089b0",accent:"#ee6c4d",background:"#293241",surface:"#3d5a80",text:"#e0fbfc",textSecondary:"#c8d5e0"}},{id:"dark",name:"🌙 Midnight",colors:{primary:"#0d1117",secondary:"#161b22",accent:"#58a6ff",background:"#0d1117",surface:"#161b22",text:"#c9d1d9",textSecondary:"#8b949e"}},{id:"light",name:"☀️ Daylight",colors:{primary:"#ffffff",secondary:"#f6f8fa",accent:"#0969da",background:"#ffffff",surface:"#f6f8fa",text:"#24292f",textSecondary:"#57606a"}},{id:"ocean",name:"🌊 Ocean",colors:{primary:"#0a4d68",secondary:"#088395",accent:"#05bfdb",background:"#0a4d68",surface:"#088395",text:"#ffffff",textSecondary:"#00ffca"}},{id:"forest",name:"🌲 Forest",colors:{primary:"#1a4d2e",secondary:"#2d6a4f",accent:"#52b788",background:"#1a4d2e",surface:"#2d6a4f",text:"#ffffff",textSecondary:"#95d5b2"}},{id:"sunset",name:"🌅 Sunset",colors:{primary:"#8b4049",secondary:"#9d5c63",accent:"#e8998d",background:"#7a3544",surface:"#9d5c63",text:"#fef3f0",textSecondary:"#f4d8d3"}},{id:"purple",name:"💜 Purple Dream",colors:{primary:"#5a189a",secondary:"#7209b7",accent:"#b5179e",background:"#5a189a",surface:"#7209b7",text:"#ffffff",textSecondary:"#e0aaff"}},{id:"focus",name:"🎯 Focus Mode",colors:{primary:"#1e293b",secondary:"#334155",accent:"#3b82f6",background:"#1e293b",surface:"#334155",text:"#f1f5f9",textSecondary:"#cbd5e1"}},{id:"warm",name:"☕ Warm Coffee",colors:{primary:"#3e2723",secondary:"#5d4037",accent:"#ff6f00",background:"#3e2723",surface:"#5d4037",text:"#fafafa",textSecondary:"#ffccbc"}},{id:"mint",name:"🍃 Mint Fresh",colors:{primary:"#06a77d",secondary:"#00d9b1",accent:"#00f5d4",background:"#06a77d",surface:"#00d9b1",text:"#ffffff",textSecondary:"#b8f2e6"}},{id:"pink",name:"💗 Pink Blossom",colors:{primary:"#ffd6e8",secondary:"#ffe5f1",accent:"#ff6b9d",background:"#FFCDE1",surface:"#ffe5f1",text:"#4a1e3a",textSecondary:"#8b4f7d"}},{id:"rose",name:"🌹 Rose Garden",colors:{primary:"#9e5770",secondary:"#b8738e",accent:"#dda5a5",background:"#8b4a5e",surface:"#a96782",text:"#fef5f7",textSecondary:"#f5dde2"}},{id:"lavender",name:"💜 Lavender Dream",colors:{primary:"#9d84b7",secondary:"#c8b6e2",accent:"#f4a9d8",background:"#9d84b7",surface:"#c8b6e2",text:"#ffffff",textSecondary:"#f8f0ff"}},{id:"neon",name:"⚡ Neon Night",colors:{primary:"#0f0e17",secondary:"#1a1a2e",accent:"#ff006e",background:"#0f0e17",surface:"#1a1a2e",text:"#fffffe",textSecondary:"#a7a9be"}},{id:"nature",name:"🌿 Nature",colors:{primary:"#2d6a4f",secondary:"#40916c",accent:"#95d5b2",background:"#2d6a4f",surface:"#40916c",text:"#ffffff",textSecondary:"#d8f3dc"}},{id:"cyberpunk",name:"🤖 Cyberpunk",colors:{primary:"#0a0e27",secondary:"#1a1f3a",accent:"#00fff5",background:"#0a0e27",surface:"#1a1f3a",text:"#ffffff",textSecondary:"#b8b8ff"}}];static currentTheme="default";static init(){this.currentTheme=c.get("currentTheme","default"),this.applyTheme(this.currentTheme)}static getThemes(){return this.themes}static getCurrentTheme(){return this.themes.find(t=>t.id===this.currentTheme)||this.themes[0]}static setTheme(t){return this.themes.find(a=>a.id===t)?(this.currentTheme=t,this.applyTheme(t),c.set("currentTheme",t),!0):!1}static applyTheme(t){const e=this.themes.find(l=>l.id===t);if(!e)return;const a=document.documentElement,o=this.isColorDark(e.colors.background);a.style.setProperty("--bg-primary",e.colors.background),a.style.setProperty("--bg-secondary",e.colors.surface),a.style.setProperty("--bg-tertiary",e.colors.secondary),a.style.setProperty("--text-primary",e.colors.text),a.style.setProperty("--text-secondary",e.colors.textSecondary),a.style.setProperty("--text-tertiary",e.colors.textSecondary),a.style.setProperty("--color-primary",e.colors.accent),a.style.setProperty("--color-primary-hover",this.adjustBrightness(e.colors.accent,-10)),a.style.setProperty("--color-primary-light",this.adjustBrightness(e.colors.accent,40)),a.style.setProperty("--color-secondary",e.colors.primary),a.style.setProperty("--circle-stroke",e.colors.accent),a.style.setProperty("--color-border",o?"rgba(255, 255, 255, 0.1)":"rgba(0, 0, 0, 0.1)"),a.style.setProperty("--color-border-light",o?"rgba(255, 255, 255, 0.05)":"rgba(0, 0, 0, 0.05)");const i=o?this.adjustBrightness(e.colors.surface,10):this.adjustBrightness(e.colors.surface,-5);a.style.setProperty("--color-input-bg",i),document.body.style.background=e.colors.background}static isColorDark(t){const e=t.replace("#",""),a=parseInt(e.substring(0,2),16),o=parseInt(e.substring(2,4),16),i=parseInt(e.substring(4,6),16);return(a*299+o*587+i*114)/1e3<128}static adjustBrightness(t,e){const a=t.replace("#",""),o=parseInt(a.substring(0,2),16),i=parseInt(a.substring(2,4),16),l=parseInt(a.substring(4,6),16),r=g=>{const p=g+g*e/100;return Math.max(0,Math.min(255,Math.round(p)))},k=r(o).toString(16).padStart(2,"0"),d=r(i).toString(16).padStart(2,"0"),u=r(l).toString(16).padStart(2,"0");return`#${k}${d}${u}`}static createCustomTheme(t,e){const a={id:this.generateId(),name:t,colors:e};return this.themes.push(a),c.set("customThemes",this.themes.filter(o=>!this.isDefaultTheme(o.id))),a}static deleteCustomTheme(t){if(this.isDefaultTheme(t))return!1;const e=this.themes.findIndex(a=>a.id===t);return e===-1?!1:(this.themes.splice(e,1),c.set("customThemes",this.themes.filter(a=>!this.isDefaultTheme(a.id))),this.currentTheme===t&&this.setTheme("default"),!0)}static isDefaultTheme(t){return["default","dark","light","ocean","forest","sunset","purple","mint","pink","rose","lavender","neon","nature","cyberpunk","focus","warm"].includes(t)}static generateId(){return"custom_"+Date.now().toString(36)+Math.random().toString(36).substr(2)}static loadCustomThemes(){const t=c.get("customThemes",[]);this.themes=[...this.themes.filter(e=>this.isDefaultTheme(e.id)),...t]}}class F{static BACKUP_VERSION="1.0.0";static createBackup(){return{version:this.BACKUP_VERSION,timestamp:new Date,data:{tasks:c.get("tasks",[]),goals:c.get("goals",[]),statistics:c.get("statistics",{}),settings:c.get("settings",{}),theme:c.get("currentTheme","default"),timerState:c.get("timerState",{}),archived_tasks:c.get("archived_tasks",[]),customThemes:c.get("customThemes",[])}}}static exportBackup(){const t=this.createBackup(),e=JSON.stringify(t,null,2),a=new Blob([e],{type:"application/json"}),o=URL.createObjectURL(a),i=document.createElement("a");i.href=o;const l=new Date().toISOString().split("T")[0];i.download=`pomodoro-backup-${l}.json`,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(o)}static async importBackup(t){try{const e=await t.text(),a=JSON.parse(e);return this.validateBackup(a)?(this.restoreBackup(a),{success:!0,message:"Backup restored successfully! Please refresh the page."}):{success:!1,message:"Invalid backup file format"}}catch(e){return console.error("Backup import error:",e),{success:!1,message:"Failed to import backup file"}}}static validateBackup(t){return t&&typeof t=="object"&&t.version&&t.timestamp&&t.data&&typeof t.data=="object"}static restoreBackup(t){const{data:e}=t;e.tasks&&c.set("tasks",e.tasks),e.goals&&c.set("goals",e.goals),e.statistics&&c.set("statistics",e.statistics),e.settings&&c.set("settings",e.settings),e.theme&&c.set("currentTheme",e.theme),e.timerState&&c.set("timerState",e.timerState),e.archived_tasks&&c.set("archived_tasks",e.archived_tasks),e.customThemes&&c.set("customThemes",e.customThemes)}static async getBackupInfo(t){try{const e=await t.text(),a=JSON.parse(e);return this.validateBackup(a)?{valid:!0,info:{version:a.version,timestamp:a.timestamp,tasksCount:a.data.tasks?.length||0,goalsCount:a.data.goals?.length||0,theme:a.data.theme}}:{valid:!1}}catch{return{valid:!1}}}static createAutoBackup(){const t=this.createBackup(),e=`auto-backup-${Date.now()}`;c.set(e,t),this.cleanupOldAutoBackups()}static cleanupOldAutoBackups(){const t=Object.keys(localStorage).filter(e=>e.startsWith("auto-backup-"));t.length>5&&t.sort().slice(0,t.length-5).forEach(e=>{localStorage.removeItem(e)})}static getAutoBackups(){return Object.keys(localStorage).filter(e=>e.startsWith("auto-backup-")).map(e=>({key:e,timestamp:new Date(parseInt(e.replace("auto-backup-","")))})).sort((e,a)=>a.timestamp.getTime()-e.timestamp.getTime())}static restoreAutoBackup(t){const e=c.get(t,null);return e&&this.validateBackup(e)?(this.restoreBackup(e),!0):!1}}function _(){v.init(),n.init(),P.init(),m.init(),T.init(),H.loadCustomThemes(),H.init(),f.init(),B.init(),y.init(),st(),ot(),D(),setTimeout(()=>{y.requestNotificationPermission()},1e3)}function st(){const s=document.querySelector("#app");s.innerHTML=`
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
          <p data-i18n="shortcutsDesc">
            <strong>Timer Kontrolü:</strong><br>
            • Space: Başlat/Duraklat<br>
            • R: Sıfırla<br>
            • 1: Pomodoro modu<br>
            • 2: Kısa mola<br>
            • 3: Uzun mola<br><br>
            <strong>Menü Navigasyonu (Aç/Kapat):</strong><br>
            • T: Görevler menüsü<br>
            • G: Hedefler menüsü<br>
            • S: İstatistikler menüsü<br>
            • A: Ayarlar menüsü<br>
            • H: Yardım menüsü<br><br>
            <strong>Genel:</strong><br>
            • Escape: Modal'ları kapat<br>
            • Aynı tuşa tekrar basarak menüleri kapatabilirsiniz
          </p>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div class="shadowBg" id="edit-modal">
      <div class="edit-modal">
        <div class="edit-modal-header">
          <h2 id="edit-modal-title">Edit Task</h2>
          <button class="close-edit-modal">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        <div class="edit-modal-content">
          <form id="edit-form">
            <div class="form-group">
              <label for="edit-title" data-i18n="title">Başlık</label>
              <input type="text" id="edit-title" required>
            </div>
            
            <div class="form-group" id="edit-pomodoros-group">
              <label for="edit-pomodoros" data-i18n="estimatedPomodoros">Tahmini Pomodoro</label>
              <input type="number" id="edit-pomodoros" min="1" max="20" required>
            </div>
            
            <div class="form-group" id="edit-category-group">
              <label for="edit-category" data-i18n="category">Kategori</label>
              <select id="edit-category">
                <option value="work" data-i18n="work">İş</option>
                <option value="personal" data-i18n="personal">Kişisel</option>
                <option value="learning" data-i18n="learning">Öğrenme</option>
                <option value="health" data-i18n="health">Sağlık</option>
                <option value="other" data-i18n="other">Diğer</option>
              </select>
            </div>
            
            <div class="form-group" id="edit-recurring-group">
              <label class="checkbox-label recurring-checkbox">
                <input type="checkbox" id="edit-recurring">
                <span class="checkmark"></span>
                <span class="checkbox-text" data-i18n="recurringTask">Tekrarlayan Görev</span>
              </label>
            </div>
            
            <div class="form-group" id="edit-goal-group" style="display: none;">
              <label for="edit-goal" data-i18n="goal">Hedef</label>
              <select id="edit-goal">
                <option value="" data-i18n="noGoal">Hedef yok</option>
              </select>
            </div>
            
            <div class="form-group" id="edit-target-group" style="display: none;">
              <label for="edit-target" data-i18n="targetPomodoros">Hedef Pomodoro</label>
              <input type="number" id="edit-target" min="1" max="50">
            </div>
            
            <div class="form-group" id="edit-period-group" style="display: none;">
              <label for="edit-period" data-i18n="period">Dönem</label>
              <select id="edit-period">
                <option value="daily" data-i18n="daily">Günlük</option>
                <option value="weekly" data-i18n="weekly">Haftalık</option>
              </select>
            </div>
            
            <div class="form-group" id="edit-notes-group">
              <label for="edit-notes" data-i18n="notes">Notlar</label>
              <textarea id="edit-notes" rows="3" placeholder="Notlarınızı buraya yazın..."></textarea>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" id="edit-cancel" data-i18n="cancel">İptal</button>
              <button type="submit" class="btn btn-primary" data-i18n="update">Güncelle</button>
            </div>
          </form>
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
        <i id="timer-mode-icon" class="fa-solid fa-clock"></i>
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
            <label class="checkbox-label recurring-checkbox" data-i18n-title="recurringTask" title="Tekrarlayan görev">
              <input type="checkbox" id="task-recurring" class="modern-checkbox">
              <span class="checkmark"></span>
              <span class="checkbox-text" data-i18n="recurringTask">Tekrarlayan Görev</span>
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
            <select id="goal-period" class="modern-input">
              <option value="daily" data-i18n="daily">Günlük</option>
              <option value="weekly" data-i18n="weekly">Haftalık</option>
            </select>
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
  `}function ot(){const s=document.getElementById("action-btn"),t=document.getElementById("mode-btns");s.addEventListener("click",V),t.addEventListener("click",rt),document.getElementById("stats-btn")?.addEventListener("click",()=>I("stats")),document.getElementById("tasks-btn")?.addEventListener("click",()=>I("tasks")),document.getElementById("goals-btn")?.addEventListener("click",()=>I("goals")),document.getElementById("settings-btn")?.addEventListener("click",()=>I("settings")),document.querySelectorAll(".close-panel").forEach(d=>{d.addEventListener("click",u=>{const g=u.target.closest(".close-panel")?.getAttribute("data-panel");g&&I(g)})}),document.querySelector(".timer-info")?.addEventListener("click",()=>{document.querySelector(".shadowBg")?.classList.add("active"),document.querySelector(".infoBox")?.classList.add("active")}),document.querySelector(".fa-xmark")?.addEventListener("click",U);let e=null,a="task";function o(d,u){a=d,e=u;const g=document.getElementById("edit-modal"),p=document.getElementById("edit-modal-title"),h=document.getElementById("edit-form");if(!g||!p||!h)return;p.textContent=d==="task"?n.t("editTask"):n.t("editGoal");const b=document.getElementById("edit-pomodoros-group"),w=document.getElementById("edit-category-group"),x=document.getElementById("edit-recurring-group"),q=document.getElementById("edit-goal-group"),M=document.getElementById("edit-target-group"),$=document.getElementById("edit-period-group"),j=document.getElementById("edit-notes-group");d==="task"?(b?.style.setProperty("display","block"),w?.style.setProperty("display","block"),x?.style.setProperty("display","block"),q?.style.setProperty("display","block"),M?.style.setProperty("display","none"),$?.style.setProperty("display","none"),j?.style.setProperty("display","block"),document.getElementById("edit-title").value=u.title,document.getElementById("edit-pomodoros").value=u.estimatedPomodoros.toString(),document.getElementById("edit-category").value=u.category||"work",document.getElementById("edit-recurring").checked=u.recurring?.enabled||!1,document.getElementById("edit-notes").value=u.notes||"",l(u.goalId)):(b?.style.setProperty("display","none"),w?.style.setProperty("display","none"),x?.style.setProperty("display","none"),q?.style.setProperty("display","none"),M?.style.setProperty("display","block"),$?.style.setProperty("display","block"),j?.style.setProperty("display","none"),document.getElementById("edit-title").value=u.title,document.getElementById("edit-target").value=u.target.toString(),document.getElementById("edit-period").value=u.period),g.classList.add("active")}function i(){const d=document.getElementById("edit-modal");d&&d.classList.remove("active"),e=null}function l(d){const u=document.getElementById("edit-goal");if(!u)return;u.innerHTML='<option value="" data-i18n="noGoal">Hedef yok</option>',T.getGoals().forEach(p=>{const h=document.createElement("option");h.value=p.id,h.textContent=p.title,p.id===d&&(h.selected=!0),u.appendChild(h)})}function r(d){if(d.preventDefault(),!e)return;const u=document.getElementById("edit-title").value.trim();if(!u){v.error("Title is required");return}let g=!1;if(a==="task"){const p=parseInt(document.getElementById("edit-pomodoros").value),h=document.getElementById("edit-notes").value.trim(),b=document.getElementById("edit-goal").value||void 0,w=document.getElementById("edit-category").value,x=document.getElementById("edit-recurring").checked;if(isNaN(p)||p<1||p>20){v.error(n.t("pomodoroCountError"));return}if(m.getTasks().find($=>$.title.toLowerCase()===u.toLowerCase()&&$.id!==e.id)){v.error(n.t("duplicateTaskName"));return}g=m.editTask(e.id,u,p,h,b,w,x),g?(S(),D(),v.success(n.t("taskUpdatedSuccess"))):v.error(n.t("updateFailed"))}else{const p=document.getElementById("edit-target"),h=document.getElementById("edit-period"),b=parseInt(p.value),w=h.value;if(!p.value||isNaN(b)||b<1||b>50){v.error(n.t("goalTargetError")),p.focus();return}if(T.getGoals().find(M=>M.title.toLowerCase()===u.toLowerCase()&&M.id!==e.id)){v.error(n.t("duplicateGoalName"));return}g=T.editGoal(e.id,u,b,w),g?(G(),D(),v.success(n.t("goalUpdatedSuccess"))):v.error(n.t("updateFailed"))}g&&i()}document.querySelector(".close-edit-modal")?.addEventListener("click",i),document.getElementById("edit-cancel")?.addEventListener("click",i),document.getElementById("edit-form")?.addEventListener("submit",r),document.getElementById("edit-modal")?.addEventListener("click",d=>{d.target===d.currentTarget&&i()}),window.openEditModal=o,document.addEventListener("keydown",d=>{if(!(d.target instanceof HTMLInputElement||d.target instanceof HTMLTextAreaElement))switch(d.key.toLowerCase()){case" ":d.preventDefault(),V();break;case"r":d.preventDefault(),it();break;case"1":d.preventDefault(),R("pomodoro");break;case"2":d.preventDefault(),R("shortBreak");break;case"3":d.preventDefault(),R("longBreak");break;case"t":d.preventDefault(),I("tasks");break;case"g":d.preventDefault(),I("goals");break;case"s":d.preventDefault(),I("stats");break;case"a":d.preventDefault(),I("settings");break;case"h":d.preventDefault(),I("help");break;case"escape":const u=document.querySelector(".infoBox"),g=document.getElementById("edit-modal");u?.classList.contains("active")?U():g?.classList.contains("active")&&i();break}}),document.querySelector(".shadowBg")?.addEventListener("click",d=>{d.target===d.currentTarget&&U()}),document.getElementById("add-task-btn")?.addEventListener("click",J),document.getElementById("task-input")?.addEventListener("keypress",d=>{d.key==="Enter"&&J()}),document.querySelectorAll(".close-notes-modal").forEach(d=>{d.addEventListener("click",et)}),document.getElementById("save-notes-btn")?.addEventListener("click",yt),document.querySelectorAll(".close-history-modal").forEach(d=>{d.addEventListener("click",Tt)}),document.getElementById("task-search")?.addEventListener("input",d=>{Y=d.target.value,S()}),document.querySelectorAll(".category-filter-btn").forEach(d=>{d.addEventListener("click",u=>{const g=u.currentTarget,p=g.getAttribute("data-category")||"all";document.querySelectorAll(".category-filter-btn").forEach(h=>h.classList.remove("active")),g.classList.add("active"),N=p,S()})}),document.querySelectorAll(".task-tab").forEach(d=>{d.addEventListener("click",u=>{const g=u.currentTarget,p=g.getAttribute("data-tab");document.querySelectorAll(".task-tab").forEach(w=>w.classList.remove("active")),g.classList.add("active");const h=document.getElementById("task-list"),b=document.getElementById("completed-task-list");p==="active"?(h?.classList.remove("hidden"),b?.classList.add("hidden")):(h?.classList.add("hidden"),b?.classList.remove("hidden"))})}),document.querySelectorAll(".goal-tab").forEach(d=>{d.addEventListener("click",u=>{const g=u.currentTarget,p=g.getAttribute("data-tab");document.querySelectorAll(".goal-tab").forEach(w=>w.classList.remove("active")),g.classList.add("active");const h=document.getElementById("goal-list"),b=document.getElementById("completed-goal-list");p==="active-goals"?(h?.classList.remove("hidden"),b?.classList.add("hidden")):(h?.classList.add("hidden"),b?.classList.remove("hidden"))})}),document.getElementById("add-goal-btn")?.addEventListener("click",Et),kt(),y.setCallbacks({onTick:L,onComplete:ct,onStart:()=>{C(!0)},onModeChange:d=>{z(d),K(d),setTimeout(()=>{C(y.isRunning())},150)}}),D(),dt()}function V(){B.enableAudio(),"Notification"in window&&Notification.permission==="default"&&y.requestNotificationPermission(),y.isRunning()?(y.pause(),C(!1)):(y.start(),C(!0))}function it(){y.reset(),L(),C(!1),z(y.getMode())}function R(s){const e={pomodoro:"pomodoro",shortBreak:"short",longBreak:"long"}[s];e&&(y.setMode(e),z(e),L())}function nt(s){y.setMode(s),z(s),K(s),L(),C(y.isRunning())}function rt(s){const e=s.target.dataset.mode;e&&nt(e)}function L(s){const t=s!==void 0?s:y.getCurrentTime(),e=Math.max(0,t),a=Math.floor(e/60),o=Math.floor(e%60),i=document.getElementById("minute"),l=document.getElementById("second");i&&(i.textContent=a.toString()),l&&(l.textContent=o.toString().padStart(2,"0")),lt(e)}function dt(){const s=document.getElementById("circle2");s&&(s.style.strokeDasharray=1036.7.toString(),s.style.strokeDashoffset=1036.7.toString())}function lt(s){const t=y.getCurrentTime(),e=Math.max(0,(t-s)/t),a=document.getElementById("circle2");if(a){const i=1036.7-e*1036.7;a.style.strokeDashoffset=i.toString()}}function ct(s){C(!1),D()}function C(s){const t=document.getElementById("action-btn");if(!t)return;const e=t.querySelector("i");e&&(s?e.className="fa-solid fa-pause":e.className="fa-solid fa-play")}function z(s){document.querySelectorAll(".btn").forEach(t=>{t.classList.remove("active")}),document.querySelector(`[data-mode="${s}"]`)?.classList.add("active")}function K(s){const t=document.getElementById("timer-info-text"),e=document.getElementById("timer-mode-icon");if(!t||!e)return;const a={pomodoro:n.t("youAreInPomodoroTime"),short:n.t("youAreInShortBreak"),long:n.t("youAreInLongBreak")},o={pomodoro:"fa-solid fa-clock",short:"fa-solid fa-coffee",long:"fa-solid fa-bed"};t.textContent=a[s],e.className=o[s]}let A=null;function U(){document.querySelector(".shadowBg")?.classList.remove("active"),document.querySelector(".infoBox")?.classList.remove("active")}function I(s){if(s==="help"){document.querySelector(".infoBox")?.classList.contains("active")?U():(document.querySelector(".shadowBg")?.classList.add("active"),document.querySelector(".infoBox")?.classList.add("active"));return}if(document.getElementById(`${s}-panel`)){if(A===s){W(s);return}A&&W(A),ut(s)}}function ut(s){const t=document.getElementById(`${s}-panel`);t&&(t.classList.add("active"),A=s,mt(s),setTimeout(()=>{document.addEventListener("click",Q),document.addEventListener("keydown",Z)},100))}function W(s){const t=document.getElementById(`${s}-panel`);t&&(t.classList.remove("active"),A=null,document.removeEventListener("click",Q),document.removeEventListener("keydown",Z))}function Q(s){const t=s.target,e=document.querySelector(".panel.active");e&&!e.contains(t)&&!t.closest(".nav-btn")&&A&&W(A)}function Z(s){s.key==="Escape"&&A&&W(A)}function mt(s){switch(s){case"stats":pt();break;case"tasks":S();break;case"goals":G();break;case"settings":X();break}}function pt(){const s=P.getTotalPomodoros(),t=P.getTotalTime(),e=P.getStreak(),a=P.getWeekSessions().length;document.getElementById("total-pomodoros").textContent=s.toString(),document.getElementById("total-time").textContent=It(t),document.getElementById("streak").textContent=`${e} ${n.t("days")}`,document.getElementById("week-pomodoros").textContent=a.toString(),gt(),ft()}function gt(){const s=document.getElementById("weekly-chart");if(!s)return;const t=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],e=["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"],a=n.getCurrentLanguage()==="tr"?e:t,o=P.getWeekSessions(),i=new Array(7).fill(0),l=new Date;o.forEach(k=>{if(k.mode==="pomodoro"){const d=new Date(k.startTime),u=d.getDay(),g=u===0?6:u-1,p=new Date(l);p.setDate(l.getDate()-(l.getDay()+6)%7),p.setHours(0,0,0,0);const h=new Date(p);h.setDate(p.getDate()+7),d>=p&&d<h&&i[g]++}});const r=Math.max(...i,1);s.innerHTML=a.map((k,d)=>`
    <div class="bar-item">
      <div class="bar-fill" style="height: ${i[d]/r*100}%">
        <span class="bar-value">${i[d]}</span>
      </div>
      <div class="bar-label">${k}</div>
    </div>
  `).join("")}function ft(){const s=document.getElementById("task-progress-chart");if(!s)return;const t=m.getActiveTasks();if(t.length===0){s.innerHTML=`<div class="empty-state"><i class="fa-solid fa-tasks"></i><p>${n.t("noTasksYet")}</p></div>`;return}s.innerHTML=t.slice(0,5).map(e=>{const a=e.estimatedPomodoros>0?e.pomodorosUsed/e.estimatedPomodoros*100:0;return`
      <div class="progress-item">
        <div class="progress-label">${e.title}</div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill" style="width: ${Math.min(a,100)}%"></div>
          <span class="progress-text">${e.pomodorosUsed}/${e.estimatedPomodoros}</span>
        </div>
      </div>
    `}).join("")}function ht(){const s=document.getElementById("task-goal");if(!s)return;const t=T.getActiveGoals();s.innerHTML=`<option value="" data-i18n="noGoal">${n.t("noGoal")}</option>`,t.forEach(e=>{const a=document.createElement("option");a.value=e.id,a.textContent=`🎯 ${e.title} (${e.current}/${e.target})`,s.appendChild(a)})}function S(){const s=m.getActiveTasks(),t=m.getCompletedTasks(),e=m.getActiveTaskId(),a=document.getElementById("task-list"),o=document.getElementById("completed-task-list");ht();let i=N==="all"?s:s.filter(r=>r.category===N),l=N==="all"?t:t.filter(r=>r.category===N);if(Y){const r=Y.toLowerCase();i=i.filter(k=>k.title.toLowerCase().includes(r)),l=l.filter(k=>k.title.toLowerCase().includes(r))}i.length===0?a.innerHTML=`<div class="empty-state"><i class="fa-solid fa-inbox"></i><p>${n.t("noTasksYet")}</p></div>`:a.innerHTML=i.map(r=>{const k=r.estimatedPomodoros>0?r.pomodorosUsed/r.estimatedPomodoros*100:0,d=r.id===e,u=r.priority||"medium",g=r.priority?n.t(r.priority):n.t("medium"),p=r.category||"work",h=n.t(p),b={work:"💼",personal:"👤",learning:"📚",health:"💪",other:"📌"}[p]||"📌",w=r.notes&&r.notes.trim().length>0,x=r.recurring?.enabled;return`
        <div class="task-item priority-${u} ${d?"active-task":""} ${x?"recurring-task":""}" data-task-id="${r.id}" onclick="setActiveTask('${r.id}', event)">
          <div class="task-header">
            <div class="task-title-wrapper">
              <div class="task-badges">
                <span class="priority-badge priority-${u}">${g}</span>
                <span class="category-badge">${b} ${h}</span>
                ${w?'<span class="notes-indicator" title="'+n.t("hasNotes")+'">📝</span>':""}
                ${x?'<span class="recurring-badge" title="'+n.t("recurringTask")+'">🔄</span>':""}
              </div>
              <h4>${r.title}</h4>
            </div>
            <div class="task-actions">
              <button class="task-btn move" onclick="event.stopPropagation(); moveTaskUp('${r.id}')" title="${n.t("moveUp")}">
                <i class="fa-solid fa-arrow-up"></i>
              </button>
              <button class="task-btn move" onclick="event.stopPropagation(); moveTaskDown('${r.id}')" title="${n.t("moveDown")}">
                <i class="fa-solid fa-arrow-down"></i>
              </button>
              <button class="task-btn history" onclick="event.stopPropagation(); openTaskHistory('${r.id}')" title="${n.t("history")}">
                <i class="fa-solid fa-clock-rotate-left"></i>
              </button>
              <button class="task-btn notes" onclick="event.stopPropagation(); openTaskNotes('${r.id}')" title="${n.t("notes")}">
                <i class="fa-solid fa-note-sticky"></i>
              </button>
              <button class="task-btn edit" onclick="event.stopPropagation(); editTask('${r.id}')" title="${n.t("edit")}">
                <i class="fa-solid fa-edit"></i>
              </button>
              <button class="task-btn complete" onclick="event.stopPropagation(); completeTask('${r.id}')" title="${n.t("complete")}">
                <i class="fa-solid fa-check"></i>
              </button>
              <button class="task-btn delete" onclick="event.stopPropagation(); deleteTask('${r.id}')" title="${n.t("delete")}">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
          ${w?'<div class="task-notes-preview">'+(r.notes?.substring(0,100)||"")+(r.notes&&r.notes.length>100?"...":"")+"</div>":""}
          <div class="task-progress-bar">
            <div class="task-progress-fill" style="width: ${k}%"></div>
          </div>
          <div class="task-stats">
            <span>🍅 ${r.pomodorosUsed}/${r.estimatedPomodoros}</span>
          </div>
          ${d?'<div class="active-task-badge"><i class="fa-solid fa-check-circle"></i> '+n.t("activeTask")+"</div>":""}
          ${k>=100?'<div class="completed-badge"><i class="fa-solid fa-trophy"></i> '+n.t("taskCompleted")+"</div>":""}
        </div>
      `}).join(""),l.length===0?o.innerHTML=`<div class="empty-state"><i class="fa-solid fa-check-circle"></i><p>${n.t("noCompletedTasks")}</p></div>`:o.innerHTML=l.map(r=>{const k=r.notes&&r.notes.trim().length>0;return`
        <div class="task-item completed" data-task-id="${r.id}">
          <div class="task-header">
            <h4><s>${r.title}</s></h4>
            <div class="task-actions">
              <button class="task-btn history" onclick="event.stopPropagation(); openTaskHistory('${r.id}')" title="${n.t("history")}">
                <i class="fa-solid fa-clock-rotate-left"></i>
              </button>
              <button class="task-btn notes" onclick="event.stopPropagation(); openTaskNotes('${r.id}')" title="${n.t("notes")}">
                <i class="fa-solid fa-note-sticky"></i>
              </button>
              <button class="task-btn edit" onclick="event.stopPropagation(); editTask('${r.id}')" title="${n.t("edit")}">
                <i class="fa-solid fa-edit"></i>
              </button>
              <button class="task-btn undo" onclick="uncompleteTask('${r.id}')" title="${n.t("undo")}">
                <i class="fa-solid fa-rotate-left"></i>
              </button>
              <button class="task-btn delete" onclick="deleteTask('${r.id}')" title="${n.t("delete")}">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
          ${k?'<div class="task-notes-preview">'+(r.notes?.substring(0,100)||"")+(r.notes&&r.notes.length>100?"...":"")+"</div>":""}
          <div class="task-stats">
            <span>🍅 ${r.pomodorosUsed}/${r.estimatedPomodoros}</span>
          </div>
          <div class="completed-badge"><i class="fa-solid fa-check"></i> ${n.t("completed")}</div>
        </div>
      `}).join("")}function G(){const s=T.getActiveGoals(),t=T.getCompletedGoals(),e=T.getActiveGoalId(),a=document.getElementById("goal-list"),o=document.getElementById("completed-goal-list");s.length===0?a.innerHTML=`<div class="empty-state"><i class="fa-solid fa-bullseye"></i><p>${n.t("noGoalsYet")}</p></div>`:a.innerHTML=s.map(i=>{const l=T.getProgressPercentage(i.id),r=i.id===e;return`
        <div class="goal-item ${r?"active-goal":""}" data-goal-id="${i.id}" onclick="setActiveGoal('${i.id}', event)">
          <div class="goal-header">
            <div class="goal-title-section">
              <h4>${i.title}</h4>
              <div class="goal-period-badge">
                <i class="fa-solid fa-${i.period==="daily"?"sun":"calendar-week"}"></i>
                <span>${i.period==="daily"?n.t("daily"):n.t("weekly")}</span>
              </div>
            </div>
            <div class="goal-actions">
              <button class="goal-btn edit" onclick="event.stopPropagation(); editGoal('${i.id}')" title="${n.t("edit")}">
                <i class="fa-solid fa-edit"></i>
              </button>
              <button class="goal-btn delete" onclick="event.stopPropagation(); deleteGoal('${i.id}')" title="${n.t("delete")}">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
          <div class="goal-progress-section">
            <div class="goal-progress-bar">
              <div class="goal-progress-fill" style="width: ${l}%"></div>
            </div>
            <div class="goal-stats">
              <span>${i.current}/${i.target} ${n.t("pomodoros")}</span>
            </div>
          </div>
          ${r?'<div class="active-goal-badge"><i class="fa-solid fa-check-circle"></i> '+n.t("activeGoal")+"</div>":""}
        </div>
      `}).join(""),t.length===0?o.innerHTML='<div class="empty-state"><i class="fa-solid fa-trophy"></i><p>Henüz tamamlanan hedef yok</p></div>':o.innerHTML=t.map(i=>{const r=i.achievedAt?new Date(i.achievedAt).toLocaleDateString():"";return`
        <div class="goal-item completed" data-goal-id="${i.id}">
          <div class="goal-header">
            <div class="goal-title-section">
              <h4><s>${i.title}</s></h4>
              <div class="goal-period-badge">
                <i class="fa-solid fa-${i.period==="daily"?"sun":"calendar-week"}"></i>
                <span>${i.period==="daily"?n.t("daily"):n.t("weekly")}</span>
              </div>
            </div>
            <div class="goal-actions">
              <button class="goal-btn edit" onclick="event.stopPropagation(); editGoal('${i.id}')" title="${n.t("edit")}">
                <i class="fa-solid fa-edit"></i>
              </button>
              <button class="goal-btn delete" onclick="event.stopPropagation(); deleteGoal('${i.id}')" title="${n.t("delete")}">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
          <div class="goal-progress-bar">
            <div class="goal-progress-fill" style="width: 100%"></div>
          </div>
          <div class="goal-stats">
            <span>${i.current}/${i.target} ${n.t("pomodoros")}</span>
          </div>
          <div class="completed-badge">
            <i class="fa-solid fa-trophy"></i> ${n.t("goalAchieved")} - ${r}
          </div>
        </div>
      `}).join("")}function X(){const s=f.getSettings(),t=f.getNotificationSettings();document.getElementById("pomodoro-duration").value=s.pomodoroDuration.toString(),document.getElementById("short-break-duration").value=s.shortBreakDuration.toString(),document.getElementById("long-break-duration").value=s.longBreakDuration.toString(),document.getElementById("sound-enabled").checked=s.soundEnabled,document.getElementById("notifications-enabled").checked=s.notificationsEnabled,document.getElementById("volume-slider").value=t.volume.toString(),tt()}function tt(){const s=H.getThemes(),t=H.getCurrentTheme(),e=document.getElementById("theme-selector");e.innerHTML=s.map(a=>`
    <div class="theme-option ${a.id===t.id?"active":""}" 
         data-theme="${a.id}" 
         style="background: ${a.colors.primary}; color: ${a.colors.text}">
      ${a.name}
  </div>
  `).join(""),e.querySelectorAll(".theme-option").forEach(a=>{a.addEventListener("click",()=>{const o=a.getAttribute("data-theme");H.setTheme(o),f.setTheme(o),tt()})})}function kt(){document.getElementById("pomodoro-duration")?.addEventListener("change",s=>{const t=s.target,e=parseInt(t.value);if(isNaN(e)||e<1||e>60){v.error(n.t("pomodoroDurationError")),t.value=f.getPomodoroDuration().toString();return}f.setPomodoroDuration(e),y.updateSettings(),L(),v.success(n.t("settingsUpdated"))}),document.getElementById("short-break-duration")?.addEventListener("change",s=>{const t=s.target,e=parseInt(t.value);if(isNaN(e)||e<1||e>30){v.error(n.t("shortBreakDurationError")),t.value=f.getShortBreakDuration().toString();return}f.setShortBreakDuration(e),y.updateSettings(),L(),v.success(n.t("settingsUpdated"))}),document.getElementById("long-break-duration")?.addEventListener("change",s=>{const t=s.target,e=parseInt(t.value);if(isNaN(e)||e<1||e>60){v.error(n.t("longBreakDurationError")),t.value=f.getLongBreakDuration().toString();return}f.setLongBreakDuration(e),y.updateSettings(),L(),v.success(n.t("settingsUpdated"))}),document.getElementById("sound-enabled")?.addEventListener("change",s=>{const t=s.target.checked;f.setSoundEnabled(t)}),document.getElementById("notifications-enabled")?.addEventListener("change",s=>{const t=s.target.checked;f.setNotificationsEnabled(t)}),document.getElementById("volume-slider")?.addEventListener("input",s=>{const t=parseFloat(s.target.value);f.setVolume(t)}),document.getElementById("language-selector")?.addEventListener("change",s=>{const t=s.target.value;n.setLanguage(t),f.setLanguage(t)}),document.getElementById("export-backup-btn")?.addEventListener("click",()=>{F.exportBackup(),alert(n.t("backupExported")||"Yedek başarıyla indirildi!")}),document.getElementById("import-backup-btn")?.addEventListener("click",()=>{document.getElementById("import-backup-input")?.click()}),document.getElementById("import-backup-input")?.addEventListener("change",async s=>{const t=s.target,e=t.files?.[0];if(e){const a=await F.importBackup(e);a.success?confirm(a.message+`

`+n.t("reloadPageConfirm"))&&window.location.reload():alert(a.message),t.value=""}}),document.getElementById("reset-settings-btn")?.addEventListener("click",()=>{confirm(n.t("resetSettingsConfirm"))&&(f.resetToDefaults(),y.updateSettings(),X(),D())}),document.getElementById("test-sound-btn")?.addEventListener("click",()=>{B.enableAudio(),y.getMode()==="pomodoro"?B.playWorkSound():B.playBreakSound()})}let N="all",Y="",O=null;function vt(s){const t=m.getTask(s);if(!t)return;O=s;const e=document.getElementById("notes-modal"),a=document.getElementById("task-notes-textarea");e&&a&&(a.value=t.notes||"",e.classList.add("active"),document.querySelector(".shadowBg")?.classList.add("active"),setTimeout(()=>a.focus(),100))}function et(){document.getElementById("notes-modal")?.classList.remove("active"),document.querySelector(".shadowBg")?.classList.remove("active"),O=null}function yt(){if(!O)return;const t=document.getElementById("task-notes-textarea").value.trim();m.updateTask(O,{notes:t}),et(),S()}function bt(s){const t=m.getTask(s);if(!t)return;const e=document.getElementById("history-modal"),a=document.getElementById("history-list");if(e&&a){const o=t.pomodoroHistory||[];o.length===0?a.innerHTML=`<div class="empty-state"><i class="fa-solid fa-clock"></i><p>${n.t("noHistory")}</p></div>`:a.innerHTML=o.map((i,l)=>{const r=new Date(i.completedAt),k=r.toLocaleDateString(),d=r.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return`
          <div class="history-item">
            <div class="history-icon">🍅</div>
            <div class="history-details">
              <div class="history-number">Pomodoro #${l+1}</div>
              <div class="history-time">${k} - ${d}</div>
              <div class="history-duration">${i.duration} ${n.t("minutes")}</div>
            </div>
          </div>
        `}).reverse().join(""),e.classList.add("active"),document.querySelector(".shadowBg")?.classList.add("active")}}function Tt(){document.getElementById("history-modal")?.classList.remove("active"),document.querySelector(".shadowBg")?.classList.remove("active")}function St(s){const t=m.getActiveTasks(),e=t.findIndex(a=>a.id===s);if(e>0){const a=m.getTasks(),o=a.findIndex(r=>r.id===s),i=t[e-1].id,l=a.findIndex(r=>r.id===i);[a[o],a[l]]=[a[l],a[o]],m.tasks=a,m.save(),S()}}function wt(s){const t=m.getActiveTasks(),e=t.findIndex(a=>a.id===s);if(e<t.length-1&&e!==-1){const a=m.getTasks(),o=a.findIndex(r=>r.id===s),i=t[e+1].id,l=a.findIndex(r=>r.id===i);[a[o],a[l]]=[a[l],a[o]],m.tasks=a,m.save(),S()}}function Dt(){const s=m.getActiveTasks();s.length!==0&&confirm(`${s.length} görevi tamamlamak istediğinizden emin misiniz?`)&&(s.forEach(t=>{m.completeTask(t.id)}),S(),D())}function Bt(){const s=m.getCompletedTasks();s.length!==0&&confirm(`${s.length} tamamlanan görevi silmek istediğinizden emin misiniz?`)&&(s.forEach(t=>{m.deleteTask(t.id)}),S(),D())}window.openTaskNotes=vt;window.openTaskHistory=bt;window.moveTaskUp=St;window.moveTaskDown=wt;window.completeAllTasks=Dt;window.deleteCompletedTasks=Bt;function J(){const s=document.getElementById("task-input"),t=document.getElementById("task-pomodoros"),e=document.getElementById("task-priority"),a=document.getElementById("task-category"),o=document.getElementById("task-goal"),i=document.getElementById("task-recurring"),l=s.value.trim(),r=parseInt(t.value),k=e.value,d=a.value,u=o.value||void 0,g=i.checked;if(!l){v.warning(n.t("taskTitleRequired")),s.focus();return}if(isNaN(r)||r<1||r>20){v.error(n.t("pomodoroCountError")),t.focus();return}if(l){const p=m.addTask(l,void 0,r);if(p){const h=g?{enabled:!0,frequency:"daily"}:void 0;if(m.updateTask(p.id,{priority:k,category:d,recurring:h}),u){const b=T.getGoal(u);if(b){const w=b.linkedTaskIds||[];w.push(p.id),T.updateGoal(u,{linkedTaskIds:w})}}}s.value="",t.value="1",e.value="medium",a.value="work",o.value="",i.checked=!1,S(),G(),D()}}window.completeTask=s=>{m.completeTask(s),S(),D()};window.deleteTask=s=>{m.deleteTask(s),S(),D()};function Et(){const s=document.getElementById("goal-input"),t=document.getElementById("goal-target"),e=document.getElementById("goal-period"),a=s.value.trim(),o=parseInt(t.value),i=e.value;if(!a){v.warning(n.t("goalTitleRequired")),s.focus();return}if(isNaN(o)||o<1||o>50){v.error(n.t("goalTargetError")),t.focus();return}T.createGoal(a,o,i),s.value="",t.value="5",G(),D(),v.success(n.t("goalAddedSuccessfully"))}window.setActiveTask=function(s,t){t&&t.stopPropagation(),m.getActiveTaskId()===s?m.setActiveTask(null):m.setActiveTask(s),S(),D()};window.completeTask=function(s){m.completeTask(s),S(),G();const t=m.getActiveTasks();t.length>0&&setTimeout(()=>{confirm(n.t("nextTaskQuestion"))&&(m.setActiveTask(t[0].id),S(),D())},1e3)};window.uncompleteTask=function(s){m.uncompleteTask(s),S()};window.deleteTask=function(s){confirm(n.t("confirmDeleteTask"))&&(m.deleteTask(s),S())};window.editTask=function(s){const t=m.getTask(s);t&&window.openEditModal("task",t)};window.editGoal=function(s){const t=T.getGoal(s);t&&window.openEditModal("goal",t)};window.setActiveGoal=function(s,t){t&&t.stopPropagation(),T.getActiveGoalId()===s?T.setActiveGoal(null):T.setActiveGoal(s),G(),D()};window.deleteGoal=function(s){confirm(n.t("confirmDeleteGoal"))&&(T.deleteGoal(s),G())};function It(s){const t=Math.max(0,s),e=Math.floor(t/60),a=Math.floor(t%60);return`${e}h ${a}m`}function D(){const s=document.getElementById("cycle-count");s&&(s.textContent=y.getCycle().toString());const t=P.getTodaySessions(),e=document.getElementById("today-count");e&&(e.textContent=t.length.toString());const a=m.getActiveTask(),o=document.getElementById("active-task-display"),i=document.getElementById("active-task-text");a&&o&&i?(i.textContent=`${n.t("activeTask")}: ${a.title} (${a.pomodorosUsed}/${a.estimatedPomodoros})`,o.style.display="flex"):o&&(o.style.display="none");const l=T.getActiveGoal(),r=document.getElementById("active-goal-display"),k=document.getElementById("active-goal-text");l&&r&&k?(k.textContent=`${n.t("activeGoal")}: ${l.title} (${l.current}/${l.target})`,r.style.display="flex"):r&&(r.style.display="none"),L(),z(y.getMode()),K(y.getMode());const d=document.getElementById("language-selector");d&&(d.value=n.getLanguage()),n.updateUI()}"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").then(s=>{console.log("SW registered: ",s)}).catch(s=>{console.log("SW registration failed: ",s)})});document.readyState==="loading"?document.addEventListener("DOMContentLoaded",_):_();
