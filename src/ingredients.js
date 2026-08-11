/**
 * ingredients.js — 12 ingredient definitions with musically coherent synthesis.
 *
 * Shared scale: C major pentatonic (C D E G A) across octaves.
 * Shared grid: 16 steps at default 96 BPM (sixteenth notes).
 * Max 6 simultaneous layers enforced by audio.js.
 *
 * Gain levels follow role-based mixing:
 *   Kick/rhythm: ~0.05 (≈-26 dBFS, leaves headroom)
 *   Bass: ~0.04
 *   Melody: ~0.035
 *   Secondary perc: ~0.03
 *   Harmony/pad: ~0.025
 *   Texture: ~0.015
 */

const STEP_COUNT = 16;

// C major pentatonic MIDI notes across useful octaves
const SCALE = {
  bass: [36, 38, 40, 43, 45],       // C2 D2 E2 G2 A2
  low:  [48, 50, 52, 55, 57],       // C3 D3 E3 G3 A3
  mid:  [60, 62, 64, 67, 69],       // C4 D4 E4 G4 A4
  high: [72, 74, 76, 79, 81],       // C5 D5 E5 G5 A5
};

function midi(note) { return 440 * 2 ** ((note - 69) / 12); }

const ingredientDefinitions = [
  // ─── RHYTHM ────────────────────────────────────────────
  {
    id: 'watermelon',
    nameKey: 'ingredient.watermelon.name',
    roleKey: 'ingredient.watermelon.role',
    bus: 'rhythm',
    color: '#E97B70',
    image: 'assets/ingredients/watermelon.png',
    pattern: [0, 4, 8, 12],
    play(time, ctx, gain) {
      // Warm kick: sine sweep down, short envelope
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, time);
      osc.frequency.exponentialRampToValueAtTime(40, time + 0.12);
      g.gain.setValueAtTime(0.0001, time);
      g.gain.linearRampToValueAtTime(1.00, time + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 0.25);
      osc.connect(g).connect(gain);
      osc.start(time); osc.stop(time + 0.27);
      osc.onended = () => osc.disconnect();
    },
  },
  {
    id: 'strawberry',
    nameKey: 'ingredient.strawberry.name',
    roleKey: 'ingredient.strawberry.role',
    bus: 'rhythm',
    color: '#E97B70',
    image: 'assets/ingredients/strawberry.png',
    pattern: [4, 12],
    play(time, ctx, gain) {
      // Soft hand-clap: filtered noise, very short
      const len = 0.04;
      const buf = ctx.createBuffer(1, Math.floor(len * ctx.sampleRate), ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (d.length * 0.12));
      const src = ctx.createBufferSource(); src.buffer = buf;
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.setValueAtTime(1200, time); bp.Q.value = 1.5;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(4000, time);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, time);
      g.gain.linearRampToValueAtTime(0.24, time + 0.002);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 0.035);
      src.connect(bp).connect(lp).connect(g).connect(gain);
      src.start(time); src.stop(time + len);
      src.onended = () => src.disconnect();
    },
  },
  {
    id: 'cherry',
    nameKey: 'ingredient.cherry.name',
    roleKey: 'ingredient.cherry.role',
    bus: 'rhythm',
    color: '#E97B70',
    image: 'assets/ingredients/cherry.png',
    pattern: [2, 6, 10, 14],
    play(time, ctx, gain) {
      // Woodblock: short sine with fast decay
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, time);
      g.gain.setValueAtTime(0.0001, time);
      g.gain.linearRampToValueAtTime(0.24, time + 0.001);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 0.06);
      osc.connect(g).connect(gain);
      osc.start(time); osc.stop(time + 0.07);
      osc.onended = () => osc.disconnect();
    },
  },

  // ─── BASS ──────────────────────────────────────────────
  {
    id: 'grape',
    nameKey: 'ingredient.grape.name',
    roleKey: 'ingredient.grape.role',
    bus: 'bass',
    color: '#596783',
    image: 'assets/ingredients/grapes.png',
    pattern: [0, 4, 7, 10, 14],
    play(time, ctx, gain, step) {
      // Round plucked bass from pentatonic scale
      const notes = [SCALE.bass[0], SCALE.bass[2], SCALE.bass[4], SCALE.bass[1], SCALE.bass[3]];
      const freq = midi(notes[step % notes.length]);
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(600, time);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      g.gain.setValueAtTime(0.0001, time);
      g.gain.linearRampToValueAtTime(0.32, time + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 0.22);
      osc.connect(lp).connect(g).connect(gain);
      osc.start(time); osc.stop(time + 0.24);
      osc.onended = () => osc.disconnect();
    },
  },
  {
    id: 'blueberry',
    nameKey: 'ingredient.blueberry.name',
    roleKey: 'ingredient.blueberry.role',
    bus: 'bass',
    color: '#596783',
    image: 'assets/ingredients/blueberry.png',
    pattern: [0, 8],
    play(time, ctx, gain) {
      // Low soft tom
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, time);
      osc.frequency.exponentialRampToValueAtTime(60, time + 0.1);
      g.gain.setValueAtTime(0.0001, time);
      g.gain.linearRampToValueAtTime(0.32, time + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 0.2);
      osc.connect(g).connect(gain);
      osc.start(time); osc.stop(time + 0.22);
      osc.onended = () => osc.disconnect();
    },
  },

  // ─── MELODY ────────────────────────────────────────────
  {
    id: 'lemonade',
    nameKey: 'ingredient.lemonade.name',
    roleKey: 'ingredient.lemonade.role',
    bus: 'melody',
    color: '#F4D77D',
    image: 'assets/ingredients/lemonade.png',
    pattern: [0, 3, 6, 10, 13],
    play(time, ctx, gain, step) {
      // Bright glass melody: sine with shimmer, pentatonic
      const notes = [SCALE.high[0], SCALE.high[2], SCALE.high[4], SCALE.high[3], SCALE.high[1]];
      const freq = midi(notes[step % notes.length]);
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      g.gain.setValueAtTime(0.0001, time);
      g.gain.linearRampToValueAtTime(0.28, time + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 0.3);
      osc.connect(g).connect(gain);
      osc.start(time); osc.stop(time + 0.32);
      osc.onended = () => osc.disconnect();
    },
  },
  {
    id: 'peach',
    nameKey: 'ingredient.peach.name',
    roleKey: 'ingredient.peach.role',
    bus: 'melody',
    color: '#F4D77D',
    image: 'assets/ingredients/peach.png',
    pattern: [2, 5, 9, 14],
    play(time, ctx, gain, step) {
      // Airy plucked melody: triangle, mid octave pentatonic
      const notes = [SCALE.mid[4], SCALE.mid[2], SCALE.mid[3], SCALE.mid[0], SCALE.mid[1]];
      const freq = midi(notes[step % notes.length]);
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(3000, time);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      g.gain.setValueAtTime(0.0001, time);
      g.gain.linearRampToValueAtTime(0.28, time + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 0.28);
      osc.connect(lp).connect(g).connect(gain);
      osc.start(time); osc.stop(time + 0.3);
      osc.onended = () => osc.disconnect();
    },
  },
  {
    id: 'cupcake',
    nameKey: 'ingredient.cupcake.name',
    roleKey: 'ingredient.cupcake.role',
    bus: 'melody',
    color: '#F4D77D',
    image: 'assets/ingredients/cupcake.png',
    pattern: [1, 5, 9, 13],
    play(time, ctx, gain, step) {
      // Gentle bell / music-box: sine with quick decay, high pentatonic
      const notes = [SCALE.high[2], SCALE.high[4], SCALE.high[0], SCALE.high[3]];
      const freq = midi(notes[step % notes.length]);
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      g.gain.setValueAtTime(0.0001, time);
      g.gain.linearRampToValueAtTime(0.24, time + 0.003);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 0.4);
      osc.connect(g).connect(gain);
      osc.start(time); osc.stop(time + 0.42);
      osc.onended = () => osc.disconnect();
    },
  },

  // ─── HARMONY ───────────────────────────────────────────
  {
    id: 'cheese',
    nameKey: 'ingredient.cheese.name',
    roleKey: 'ingredient.cheese.role',
    bus: 'harmony',
    color: '#9A8EB8',
    image: 'assets/ingredients/cheese.png',
    pattern: [0, 8],
    play(time, ctx, gain, step) {
      // Mellow chord pad: 3 sines forming pentatonic triad, slow envelope
      const roots = [SCALE.low[0], SCALE.low[2], SCALE.low[4], SCALE.low[3]];
      const root = roots[Math.floor(step / 4) % roots.length];
      const chord = [root, root + 4, root + 7]; // approx major voicing
      const gG = ctx.createGain();
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(1200, time); lp.Q.value = 0.3;
      gG.gain.setValueAtTime(0.0001, time);
      gG.gain.linearRampToValueAtTime(0.20, time + 0.1);
      gG.gain.linearRampToValueAtTime(0.20, time + 1.2);
      gG.gain.linearRampToValueAtTime(0.0001, time + 1.8);
      chord.forEach((n) => {
        const o = ctx.createOscillator(); o.type = 'sine';
        o.frequency.setValueAtTime(midi(n), time);
        o.connect(lp); o.start(time); o.stop(time + 1.9);
        o.onended = () => o.disconnect();
      });
      lp.connect(gG).connect(gain);
    },
  },
  {
    id: 'honey',
    nameKey: 'ingredient.honey.name',
    roleKey: 'ingredient.honey.role',
    bus: 'harmony',
    color: '#9A8EB8',
    image: 'assets/ingredients/honey.png',
    pattern: [0],
    play(time, ctx, gain) {
      // Warm sustained harmony: two sines (C3+G3), very quiet, long
      const osc = ctx.createOscillator(); const osc2 = ctx.createOscillator();
      const g = ctx.createGain();
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(500, time);
      osc.type = 'sine'; osc2.type = 'sine';
      osc.frequency.setValueAtTime(midi(48), time); // C3
      osc2.frequency.setValueAtTime(midi(55), time); // G3
      g.gain.setValueAtTime(0.0001, time);
      g.gain.linearRampToValueAtTime(0.16, time + 0.5);
      g.gain.linearRampToValueAtTime(0.16, time + 2.0);
      g.gain.linearRampToValueAtTime(0.0001, time + 2.8);
      osc.connect(lp); osc2.connect(lp); lp.connect(g).connect(gain);
      osc.start(time); osc2.start(time);
      osc.stop(time + 3.0); osc2.stop(time + 3.0);
      osc.onended = () => osc.disconnect();
      osc2.onended = () => osc2.disconnect();
    },
  },

  // ─── TEXTURE ───────────────────────────────────────────
  {
    id: 'mint',
    nameKey: 'ingredient.mint.name',
    roleKey: 'ingredient.mint.role',
    bus: 'texture',
    color: '#A9BE91',
    image: 'assets/ingredients/mint.png',
    pattern: [0, 8],
    play(time, ctx, gain) {
      // Filtered shaker: very quiet bandpass noise, short
      const len = 0.15;
      const buf = ctx.createBuffer(1, Math.floor(len * ctx.sampleRate), ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) * 0.5;
      const src = ctx.createBufferSource(); src.buffer = buf;
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.setValueAtTime(3000, time); bp.Q.value = 2;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(5000, time);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, time);
      g.gain.linearRampToValueAtTime(0.12, time + 0.01);
      g.gain.linearRampToValueAtTime(0.0001, time + 0.12);
      src.connect(bp).connect(lp).connect(g).connect(gain);
      src.start(time); src.stop(time + len);
      src.onended = () => src.disconnect();
    },
  },
  {
    id: 'sandwich',
    nameKey: 'ingredient.sandwich.name',
    roleKey: 'ingredient.sandwich.role',
    bus: 'texture',
    color: '#A9BE91',
    image: 'assets/ingredients/sandwich.png',
    pattern: [1, 3, 5, 7, 9, 11, 13, 15],
    play(time, ctx, gain) {
      // Brushed rhythmic texture: very quiet filtered noise, ultra-short
      const len = 0.03;
      const buf = ctx.createBuffer(1, Math.floor(len * ctx.sampleRate), ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (d.length * 0.3)) * 0.3;
      const src = ctx.createBufferSource(); src.buffer = buf;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(3500, time);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, time);
      g.gain.linearRampToValueAtTime(0.10, time + 0.002);
      g.gain.linearRampToValueAtTime(0.0001, time + 0.025);
      src.connect(lp).connect(g).connect(gain);
      src.start(time); src.stop(time + len);
      src.onended = () => src.disconnect();
    },
  },
];

const ingredientById = new Map(ingredientDefinitions.map(d => [d.id, d]));
const MAX_LAYERS = 6;

export { ingredientDefinitions, ingredientById, STEP_COUNT, MAX_LAYERS, SCALE };
