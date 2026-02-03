
class AudioService {
  private ctx: AudioContext | null = null;
  private processingOscillator: OscillatorNode | null = null;
  private processingGain: GainNode | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playAppear() {
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playDisappear() {
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(660, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  startProcessing() {
    this.init();
    if (!this.ctx || this.processingOscillator) return;

    this.processingOscillator = this.ctx.createOscillator();
    this.processingGain = this.ctx.createGain();

    // Subtle rhythmic "thinking" sound
    this.processingOscillator.type = 'square';
    this.processingOscillator.frequency.setValueAtTime(60, this.ctx.currentTime);
    
    // Low pass filter to make it softer
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, this.ctx.currentTime);

    this.processingGain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    
    // Create a pulsing effect
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(4, this.ctx.currentTime); // 4Hz pulse
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    
    lfo.connect(lfoGain);
    lfoGain.connect(this.processingGain.gain);
    lfo.start();

    this.processingOscillator.connect(filter);
    filter.connect(this.processingGain);
    this.processingGain.connect(this.ctx.destination);

    this.processingOscillator.start();
  }

  stopProcessing() {
    if (this.processingOscillator) {
      this.processingOscillator.stop();
      this.processingOscillator = null;
    }
  }
}

export const audioService = new AudioService();
