// Optional ambient sound: a rack-fan hum whose loudness follows the hidden Noise meter and
// which switch is running the DadLAN. Generated with Web Audio, so there are no audio files.
// Off by default; browsers only allow it after a click anyway.

let ctx: AudioContext | null = null;
let gain: GainNode | null = null;
let filter: BiquadFilterNode | null = null;

function start(): void {
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  // Brown noise reads as fan air.
  const length = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1; // UI-only randomness; the game engine never sees it.
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;
  filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  // A faint mains-hum under the air.
  const hum = ctx.createOscillator();
  hum.frequency.value = 100;
  const humGain = ctx.createGain();
  humGain.gain.value = 0.02;
  gain = ctx.createGain();
  gain.gain.value = 0;
  noise.connect(filter).connect(gain);
  hum.connect(humGain).connect(gain);
  gain.connect(ctx.destination);
  noise.start();
  hum.start();
}

/** noise: hidden Noise meter (0–20). rackSwitch: 1 quiet, 2 D-Link, 4 ProCurve, 0 unknown. */
export function setAmbience(on: boolean, noise: number, rackSwitch: number): void {
  if (!on) {
    if (ctx && gain) gain.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
    return;
  }
  if (!ctx) start();
  if (!ctx || !gain || !filter) return;
  void ctx.resume();
  const fan = rackSwitch === 4 ? 1 : rackSwitch === 1 ? 0.25 : 0.55;
  const level = Math.min(0.35, 0.04 + fan * 0.12 + noise * 0.01);
  filter.frequency.setTargetAtTime(300 + fan * 900 + noise * 40, ctx.currentTime, 0.5);
  gain.gain.setTargetAtTime(level, ctx.currentTime, 0.5);
}
