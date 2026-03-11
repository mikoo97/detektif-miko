export const playTone = (frequency: number, type: OscillatorType, duration: number, startTime: number, audioCtx: AudioContext) => {
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  
  gainNode.gain.setValueAtTime(0.1, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
};

export const playCorrectSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;
    playTone(523.25, 'sine', 0.1, now, audioCtx); // C5
    playTone(659.25, 'sine', 0.1, now + 0.1, audioCtx); // E5
    playTone(783.99, 'sine', 0.2, now + 0.2, audioCtx); // G5
  } catch (e) {
    console.error("Audio not supported or blocked", e);
  }
};

export const playIncorrectSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;
    playTone(300, 'sawtooth', 0.2, now, audioCtx);
    playTone(250, 'sawtooth', 0.3, now + 0.2, audioCtx);
  } catch (e) {
    console.error("Audio not supported or blocked", e);
  }
};

export const playClickSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;
    playTone(600, 'sine', 0.05, now, audioCtx);
  } catch (e) {
    console.error("Audio not supported or blocked", e);
  }
};
