// Web Audio API Synthesizer for Retro & Arcade Sound Effects

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.3;

  constructor() {
    const savedMute = localStorage.getItem('snake_audio_muted');
    if (savedMute !== null) {
      this.isMuted = savedMute === 'true';
    }
    const savedVol = localStorage.getItem('snake_audio_volume');
    if (savedVol !== null) {
      this.volume = parseFloat(savedVol) || 0.3;
    }
  }

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('snake_audio_muted', String(this.isMuted));
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    localStorage.setItem('snake_audio_volume', String(this.volume));
  }

  public getVolume(): number {
    return this.volume;
  }

  // Play a simple synthesized frequency envelope
  private playTone(freq: number, type: OscillatorType, duration: number, gainVal: number = 0.2, endFreq?: number) {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if (endFreq) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(10, endFreq), ctx.currentTime + duration);
      }

      const effectiveGain = gainVal * this.volume;
      gain.gain.setValueAtTime(effectiveGain, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext could be blocked by browser policy prior to gesture
    }
  }

  // Eat standard apple sound
  public playEat() {
    this.playTone(520, 'sine', 0.1, 0.25, 780);
  }

  // Eat golden apple or special powerup
  public playPowerUp() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const notes = [440, 554, 659, 880];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);

        const effGain = 0.2 * this.volume;
        gain.gain.setValueAtTime(effGain, ctx.currentTime + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.05 + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.05);
        osc.stop(ctx.currentTime + idx * 0.05 + 0.15);
      });
    } catch {
      // AudioContext error handling
    }
  }

  // Direction turn subtle tick
  public playTurn() {
    this.playTone(280, 'sine', 0.03, 0.05, 200);
  }

  // Portal teleport sound
  public playPortal() {
    this.playTone(300, 'sawtooth', 0.2, 0.15, 900);
  }

  // Game over crash tone
  public playGameOver() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.6);

      const effGain = 0.3 * this.volume;
      gain.gain.setValueAtTime(effGain, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // AudioContext error handling
    }
  }

  // Level cleared victory sound
  public playVictory() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const chords = [523.25, 659.25, 783.99, 1046.5]; // C E G C
      chords.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        const effGain = 0.25 * this.volume;
        gain.gain.setValueAtTime(effGain, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.3);
      });
    } catch {
      // AudioContext error handling
    }
  }

  // UI button click
  public playClick() {
    this.playTone(600, 'sine', 0.04, 0.08, 400);
  }
}

export const soundManager = new SoundManager();
