import { Howl } from 'howler';

const sounds = {
  addToCart: new Howl({
    src: ['/sounds/add-to-cart.mp3'],
    volume: 0.5,
  }),
  removeFromCart: new Howl({
    src: ['/sounds/remove.mp3'],
    volume: 0.3,
  }),
  success: new Howl({
    src: ['/sounds/success.mp3'],
    volume: 0.6,
  }),
  error: new Howl({
    src: ['/sounds/error.mp3'],
    volume: 0.4,
  }),
  click: new Howl({
    src: ['/sounds/click.mp3'],
    volume: 0.2,
  }),
  notification: new Howl({
    src: ['/sounds/notification.mp3'],
    volume: 0.5,
  }),
};

export const playSound = (soundName: keyof typeof sounds) => {
  const soundEnabled = localStorage.getItem('sound_enabled') !== 'false';
  if (soundEnabled && sounds[soundName]) {
    sounds[soundName].play();
  }
};

export const toggleSound = () => {
  const current = localStorage.getItem('sound_enabled') !== 'false';
  localStorage.setItem('sound_enabled', (!current).toString());
  return !current;
};

export const isSoundEnabled = () => {
  return localStorage.getItem('sound_enabled') !== 'false';
};
