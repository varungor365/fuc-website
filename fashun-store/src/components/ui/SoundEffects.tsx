'use client';

import React, { useEffect, useRef } from 'react';
import { Howl, Howler } from 'howler';

interface SoundEffectsConfig {
  volume?: number;
  muted?: boolean;
}

class SoundEffects {
  private static sounds: { [key: string]: Howl } = {};
  private static volume = 0.3;
  private static muted = false;

  // Initialize sound library
  static init(config: SoundEffectsConfig = {}) {
    try {
      this.volume = config.volume || 0.3;
      this.muted = config.muted || false;
      Howler.volume(this.volume);

      // Create synthetic sounds using Web Audio API since we don't have audio files
      this.createSyntheticSounds();
    } catch (error) {
      console.warn('SoundEffects: Failed to initialize sounds, running in silent mode:', error);
      this.muted = true;
      this.sounds = {}; // Ensure sounds object exists even if empty
    }
  }

  // Create synthetic sounds using oscillator
  private static createSyntheticSounds() {
    try {
      // Initialize empty sounds object first
      this.sounds = {};
      
      // Click sound - short, crisp
      this.sounds.click = new Howl({
        src: [this.generateTone(800, 0.1, 'sine')],
        volume: 0.2
      });

    // Swoosh sound - smooth transition
    this.sounds.swoosh = new Howl({
      src: [this.generateSweep(400, 800, 0.3)],
      volume: 0.3
    });

    // Success chime - positive, ascending
    this.sounds.chime = new Howl({
      src: [this.generateChime()],
      volume: 0.4
    });

    // Pop sound - for buttons
    this.sounds.pop = new Howl({
      src: [this.generateTone(1200, 0.05, 'square')],
      volume: 0.25
    });

    // Notification sound
    this.sounds.notification = new Howl({
      src: [this.generateNotification()],
      volume: 0.35
    });

    // Error sound - lower, warning tone
    this.sounds.error = new Howl({
      src: [this.generateTone(300, 0.2, 'sawtooth')],
      volume: 0.3
    });

    // Achievement sound - triumphant
    this.sounds.achievement = new Howl({
      src: [this.generateAchievement()],
      volume: 0.5
    });
    } catch (error) {
      console.warn('SoundEffects: Failed to create synthetic sounds:', error);
      // Ensure sounds object exists even if sound creation fails
      this.sounds = this.sounds || {};
    }
  }

  // Generate synthetic tone
  private static generateTone(frequency: number, duration: number, type: 'sine' | 'square' | 'sawtooth' | 'triangle' = 'sine'): string {
    const sampleRate = 44100;
    const samples = Math.floor(sampleRate * duration);
    const buffer = new Float32Array(samples);

    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      let value = 0;

      switch (type) {
        case 'sine':
          value = Math.sin(2 * Math.PI * frequency * t);
          break;
        case 'square':
          value = Math.sign(Math.sin(2 * Math.PI * frequency * t));
          break;
        case 'sawtooth':
          value = 2 * (t * frequency % 1) - 1;
          break;
        case 'triangle':
          value = Math.abs((t * frequency % 1) * 4 - 2) - 1;
          break;
      }

      // Apply envelope (fade in/out)
      const envelope = Math.min(1, Math.min(i / (sampleRate * 0.01), (samples - i) / (sampleRate * 0.01)));
      buffer[i] = value * envelope;
    }

    return this.bufferToDataURL(buffer, sampleRate);
  }

  // Generate frequency sweep
  private static generateSweep(startFreq: number, endFreq: number, duration: number): string {
    const sampleRate = 44100;
    const samples = Math.floor(sampleRate * duration);
    const buffer = new Float32Array(samples);

    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      const progress = t / duration;
      const frequency = startFreq + (endFreq - startFreq) * progress;
      const envelope = Math.sin(Math.PI * progress); // Bell curve envelope
      buffer[i] = Math.sin(2 * Math.PI * frequency * t) * envelope;
    }

    return this.bufferToDataURL(buffer, sampleRate);
  }

  // Generate chime sound (multiple harmonics)
  private static generateChime(): string {
    const sampleRate = 44100;
    const duration = 0.5;
    const samples = Math.floor(sampleRate * duration);
    const buffer = new Float32Array(samples);

    const fundamentals = [523, 659, 784]; // C, E, G chord

    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      let value = 0;

      fundamentals.forEach((freq, index) => {
        const envelope = Math.exp(-t * (2 + index)); // Decay envelope
        value += Math.sin(2 * Math.PI * freq * t) * envelope * 0.3;
      });

      buffer[i] = value;
    }

    return this.bufferToDataURL(buffer, sampleRate);
  }

  // Generate notification sound
  private static generateNotification(): string {
    const sampleRate = 44100;
    const duration = 0.3;
    const samples = Math.floor(sampleRate * duration);
    const buffer = new Float32Array(samples);

    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 5);
      const freq1 = 880 + Math.sin(t * 20) * 50; // Slight vibrato
      buffer[i] = Math.sin(2 * Math.PI * freq1 * t) * envelope;
    }

    return this.bufferToDataURL(buffer, sampleRate);
  }

  // Generate achievement sound
  private static generateAchievement(): string {
    const sampleRate = 44100;
    const duration = 0.8;
    const samples = Math.floor(sampleRate * duration);
    const buffer = new Float32Array(samples);

    // Ascending notes: C, E, G, C
    const notes = [261, 329, 392, 523];
    const noteDuration = duration / notes.length;

    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      const noteIndex = Math.floor(t / noteDuration);
      const noteTime = t % noteDuration;
      
      if (noteIndex < notes.length) {
        const frequency = notes[noteIndex];
        const envelope = Math.max(0, 1 - noteTime / noteDuration);
        buffer[i] = Math.sin(2 * Math.PI * frequency * noteTime) * envelope * 0.5;
      }
    }

    return this.bufferToDataURL(buffer, sampleRate);
  }

  // Convert buffer to data URL
  private static bufferToDataURL(buffer: Float32Array, sampleRate: number): string {
    const length = buffer.length;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);
    
    // WAV file header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);

    // Convert float32 to int16
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, buffer[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }

    const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  }

  // Play sound methods
  static click() {
    // Ensure sounds are initialized before trying to play
    if (!this.sounds || Object.keys(this.sounds).length === 0) {
      SoundEffects.init();
    }
    if (!this.muted && this.sounds && this.sounds.click) {
      this.sounds.click.play();
    }
  }

  static swoosh() {
    // Ensure sounds are initialized before trying to play
    if (!this.sounds || Object.keys(this.sounds).length === 0) {
      SoundEffects.init();
    }
    if (!this.muted && this.sounds && this.sounds.swoosh) {
      this.sounds.swoosh.play();
    }
  }

  static chime() {
    // Ensure sounds are initialized before trying to play
    if (!this.sounds || Object.keys(this.sounds).length === 0) {
      SoundEffects.init();
    }
    if (!this.muted && this.sounds && this.sounds.chime) {
      this.sounds.chime.play();
    }
  }

  static pop() {
    // Ensure sounds are initialized before trying to play
    if (!this.sounds || Object.keys(this.sounds).length === 0) {
      SoundEffects.init();
    }
    if (!this.muted && this.sounds && this.sounds.pop) {
      this.sounds.pop.play();
    }
  }

  static notification() {
    // Ensure sounds are initialized before trying to play
    if (!this.sounds || Object.keys(this.sounds).length === 0) {
      SoundEffects.init();
    }
    if (!this.muted && this.sounds && this.sounds.notification) {
      this.sounds.notification.play();
    }
  }

  static error() {
    // Ensure sounds are initialized before trying to play
    if (!this.sounds || Object.keys(this.sounds).length === 0) {
      SoundEffects.init();
    }
    if (!this.muted && this.sounds && this.sounds.error) {
      this.sounds.error.play();
    }
  }

  static achievement() {
    // Ensure sounds are initialized before trying to play
    if (!this.sounds || Object.keys(this.sounds).length === 0) {
      SoundEffects.init();
    }
    if (!this.muted && this.sounds && this.sounds.achievement) {
      this.sounds.achievement.play();
    }
  }

  // Control methods
  static setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    Howler.volume(this.volume);
  }

  static mute() {
    this.muted = true;
  }

  static unmute() {
    this.muted = false;
  }

  static toggle() {
    this.muted = !this.muted;
  }

  static isMuted() {
    return this.muted;
  }
}

// React Hook for easy use in components
export const useSoundEffects = () => {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      SoundEffects.init();
      initialized.current = true;
    }
  }, []);

  return {
    click: SoundEffects.click,
    swoosh: SoundEffects.swoosh,
    chime: SoundEffects.chime,
    pop: SoundEffects.pop,
    notification: SoundEffects.notification,
    error: SoundEffects.error,
    achievement: SoundEffects.achievement,
    setVolume: SoundEffects.setVolume,
    mute: SoundEffects.mute,
    unmute: SoundEffects.unmute,
    toggle: SoundEffects.toggle,
    isMuted: SoundEffects.isMuted
  };
};

// HOC to add sound effects to any component
interface WithSoundEffectsProps {
  soundOnClick?: 'click' | 'pop' | 'chime';
  soundOnHover?: 'swoosh';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
}

export const WithSoundEffects: React.FC<WithSoundEffectsProps> = ({
  soundOnClick,
  soundOnHover,
  children,
  className,
  onClick,
  onMouseEnter
}) => {
  const sounds = useSoundEffects();

  const handleClick = () => {
    if (soundOnClick) {
      sounds[soundOnClick]();
    }
    onClick?.();
  };

  const handleMouseEnter = () => {
    if (soundOnHover) {
      sounds[soundOnHover]();
    }
    onMouseEnter?.();
  };

  return (
    <div 
      className={className}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
    >
      {children}
    </div>
  );
};

export default SoundEffects;