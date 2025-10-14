// Audio utility functions
export class AudioManager {
  private static workSound: HTMLAudioElement;
  private static breakSound: HTMLAudioElement;
  private static volume: number = 0.5;
  private static initialized: boolean = false;
  private static userInteracted: boolean = false;

  static init(): void {
    if (this.initialized) return;
    
    try {
      // Create new audio instances
      this.workSound = new Audio();
      this.breakSound = new Audio();
      
      // Set sources
      this.workSound.src = '/work.mp3';
      this.breakSound.src = '/break.mp3';
      
      // Set properties
      this.workSound.volume = this.volume;
      this.breakSound.volume = this.volume;
      this.workSound.preload = 'auto';
      this.breakSound.preload = 'auto';
      
      // Enable autoplay
      this.workSound.autoplay = false;
      this.breakSound.autoplay = false;
      
      // Load the audio files
      this.workSound.load();
      this.breakSound.load();
      
      // Add user interaction listener
      this.addUserInteractionListener();
      
      this.initialized = true;
      console.log('Audio manager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  private static addUserInteractionListener(): void {
    const enableAudio = () => {
      this.userInteracted = true;
      console.log('User interaction detected, audio enabled');
      // Remove listeners after first interaction
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('keydown', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
    };

    document.addEventListener('click', enableAudio);
    document.addEventListener('keydown', enableAudio);
    document.addEventListener('touchstart', enableAudio);
  }

  static playWorkSound(): void {
    if (!this.initialized) {
      this.init();
    }
    
    if (!this.userInteracted) {
      console.log('Audio not enabled yet, user interaction required');
      return;
    }
    
    if (this.workSound) {
      this.workSound.currentTime = 0;
      this.workSound.play().catch((error) => {
        console.log('Work sound play failed:', error);
        // Try to enable audio context
        this.enableAudioContext();
        // Fallback to system beep
        this.playSystemBeep();
      });
    }
  }

  static playBreakSound(): void {
    if (!this.initialized) {
      this.init();
    }
    
    if (!this.userInteracted) {
      console.log('Audio not enabled yet, user interaction required');
      return;
    }
    
    if (this.breakSound) {
      this.breakSound.currentTime = 0;
      this.breakSound.play().catch((error) => {
        console.log('Break sound play failed:', error);
        // Try to enable audio context
        this.enableAudioContext();
        // Fallback to system beep
        this.playSystemBeep();
      });
    }
  }

  private static enableAudioContext(): void {
    // Try to enable audio context if it's suspended
    if (typeof AudioContext !== 'undefined') {
      const audioContext = new AudioContext();
      if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          console.log('Audio context resumed');
        });
      }
    }
  }

  private static playSystemBeep(): void {
    // Fallback to system beep using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(this.volume * 0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      
      console.log('System beep played as fallback');
    } catch (error) {
      console.log('System beep failed:', error);
    }
  }

  static setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.workSound) this.workSound.volume = this.volume;
    if (this.breakSound) this.breakSound.volume = this.volume;
  }

  static getVolume(): number {
    return this.volume;
  }

  static enableAudio(): void {
    this.userInteracted = true;
    console.log('Audio manually enabled');
  }
}
