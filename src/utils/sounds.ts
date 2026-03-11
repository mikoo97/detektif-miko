let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const playTone = (frequency: number, type: OscillatorType, duration: number, startTime: number, ctx: AudioContext, gainValue: number = 0.1) => {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  
  gainNode.gain.setValueAtTime(gainValue, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
};

export const playCorrectSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // Cheerful arpeggio (C5, E5, G5, C6)
    playTone(523.25, 'sine', 0.15, now, ctx, 0.15); // C5
    playTone(659.25, 'sine', 0.15, now + 0.1, ctx, 0.15); // E5
    playTone(783.99, 'sine', 0.15, now + 0.2, ctx, 0.15); // G5
    playTone(1046.50, 'sine', 0.3, now + 0.3, ctx, 0.2); // C6
  } catch (e) {
    console.error("Audio not supported or blocked", e);
  }
};

export const playIncorrectSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // Sad descending buzzer
    playTone(300, 'sawtooth', 0.2, now, ctx, 0.1);
    playTone(250, 'sawtooth', 0.2, now + 0.15, ctx, 0.1);
    playTone(200, 'sawtooth', 0.4, now + 0.3, ctx, 0.1);
  } catch (e) {
    console.error("Audio not supported or blocked", e);
  }
};

export const playClickSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // Short, snappy pop
    playTone(800, 'sine', 0.05, now, ctx, 0.05);
    playTone(1200, 'sine', 0.05, now + 0.02, ctx, 0.05);
  } catch (e) {
    console.error("Audio not supported or blocked", e);
  }
};
