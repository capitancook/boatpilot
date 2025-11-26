/**
 * This service simulates the hardware interface described in the PDF.
 * It uses the Web Audio API to generate pulses on the Left (CH1) and Right (CH2) channels.
 * 
 * In a real-world scenario per the PDF:
 * - Pulse width: 1ms to 2ms
 * - Interval: 10ms (100Hz frequency roughly, though standard RC is usually 50Hz/20ms)
 * 
 * Since precise sub-millisecond PWM generation via Audio jack in a browser is limited by 
 * sample rates and AC coupling of audio jacks, this generates a tone representation 
 * proportional to the control effort for demonstration purposes.
 */

let audioCtx: AudioContext | null = null;
let oscillator: OscillatorNode | null = null;
let gainNode: GainNode | null = null;

export const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
};

export const startSignal = () => {
  if (!audioCtx) initAudio();
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  // Create a low hum to indicate "System Active"
  if (!oscillator && audioCtx) {
    oscillator = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(100, audioCtx.currentTime); // 100Hz base
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); // Low volume
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
  }
};

export const updateSignal = (ch1Ms: number, ch2Ms: number) => {
  if (!oscillator || !audioCtx) return;
  
  // Modulate frequency slightly to give audible feedback of "steering"
  // 1.5ms is neutral. 
  const deviation = (ch1Ms - 1.5) * 100; // Shift frequency based on rudder
  oscillator.frequency.setTargetAtTime(100 + deviation, audioCtx.currentTime, 0.1);
};

export const stopSignal = () => {
  if (oscillator) {
    oscillator.stop();
    oscillator.disconnect();
    oscillator = null;
  }
  if (gainNode) {
    gainNode.disconnect();
    gainNode = null;
  }
};
