/**
 * ingredients.js — 12 ingredient definitions.
 * Each has id, i18n keys, pattern, color, and synth function.
 */

const STEP_COUNT = 16;

const ingredientDefinitions = [
  {
    id: 'watermelon',
    nameKey: 'ingredient.watermelon.name',
    roleKey: 'ingredient.watermelon.role',
    color: '#ff7089',
    colorLight: 'rgba(255,240,242,0.96)',
    pattern: [0, 4, 8, 12],
    play(time, ctx, gain) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(96, time);
      osc.frequency.exponentialRampToValueAtTime(48, time + 0.16);
      g.gain.setValueAtTime(0.0001, time);
      g.gain.exponentialRampToValueAtTime(0.13, time + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 0.34);
      osc.connect(g).connect(gain);
      osc.start(time); osc.stop(time + 0.36);
      osc.onended = () => osc.disconnect();
    },
  },
  {
    id: 'lemonade',
    nameKey: 'ingredient.lemonade.name',
    roleKey: 'ingredient.lemonade.role',
    color: '#ffd45b',
    colorLight: 'rgba(255,252,230,0.96)',
    pattern: [2, 6, 10, 14],
    play(time, ctx, gain, step) {
      const scale = [0, 2, 4, 7, 9, 12, 14];
      const note = 440 * 2 ** ((72 + scale[step % scale.length] - 69) / 12);
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const g = ctx.createGain();
      const flt = ctx.createBiquadFilter();
      osc.type = 'triangle'; osc2.type = 'sine';
      osc.frequency.setValueAtTime(note, time);
      osc2.frequency.setValueAtTime(note * 2, time);
      flt.type = 'highpass'; flt.frequency.setValueAtTime(540, time);
      g.gain.setValueAtTime(0.0001, time);
      g.gain.exponentialRampToValueAtTime(0.08, time + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 0.24);
      osc.connect(flt); osc2.connect(flt); flt.connect(g).connect(gain);
      osc.start(time); osc2.start(time);
      osc.stop(time + 0.26); osc2.stop(time + 0.26);
      osc.onended = () => osc.disconnect();
      osc2.onended = () => osc2.disconnect();
    },
  },
  {
    id: 'strawberry',
    nameKey: 'ingredient.strawberry.name',
    roleKey: 'ingredient.strawberry.role',
    color: '#ff8090',
    colorLight: 'rgba(255,242,245,0.96)',
    pattern: [1, 3, 5, 7, 9, 11, 13, 15],
    play(time, ctx, gain, step) {
      const melody = [72, 74, 76, 79, 76, 74, 71, 72, 76, 79, 81, 79, 76, 74, 72, 69];
      const freq = 440 * 2 ** ((melody[step % 16] - 69) / 12);
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const flt = ctx.createBiquadFilter();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      flt.type = 'lowpass'; flt.frequency.setValueAtTime(2400, time); flt.Q.value = 0.7;
      g.gain.setValueAtTime(0.0001, time);
      g.gain.exponentialRampToValueAtTime(0.1, time + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 0.3);
      osc.connect(flt).connect(g).connect(gain);
      osc.start(time); osc.stop(time + 0.32);
      osc.onended = () => osc.disconnect();
    },
  },
  {
    id: 'cheese',
    nameKey: 'ingredient.cheese.name',
    roleKey: 'ingredient.cheese.role',
    color: '#ffe48e',
    colorLight: 'rgba(255,250,225,0.96)',
    pattern: [0, 8],
    play(time, ctx, gain, step) {
      const chords = [[60,64,67],[57,60,64],[65,69,72],[55,59,62]];
      const chord = chords[Math.floor(step / 4) % chords.length];
      const gG = ctx.createGain();
      const flt = ctx.createBiquadFilter();
      gG.gain.setValueAtTime(0.0001, time);
      gG.gain.exponentialRampToValueAtTime(0.07, time + 0.06);
      gG.gain.exponentialRampToValueAtTime(0.0001, time + 1.6);
      flt.type = 'lowpass'; flt.frequency.setValueAtTime(1800, time); flt.Q.value = 0.4;
      chord.forEach((midi, i) => {
        const o = ctx.createOscillator();
        o.type = i === 0 ? 'triangle' : 'sine';
        o.frequency.setValueAtTime(440 * 2 ** ((midi - 69) / 12), time);
        o.detune.setValueAtTime((i - 1) * 6, time);
        o.connect(flt); o.start(time); o.stop(time + 1.7);
        o.onended = () => o.disconnect();
      });
      flt.connect(gG).connect(gain);
    },
  },
  {
    id: 'grape',
    nameKey: 'ingredient.grape.name',
    roleKey: 'ingredient.grape.role',
    color: '#9e83d4',
    colorLight: 'rgba(248,242,255,0.96)',
    pattern: [2, 5, 8, 11, 14],
    play(time, ctx, gain) {
      const len = 0.12;
      const buf = ctx.createBuffer(1, Math.floor(len * ctx.sampleRate), ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      const src = ctx.createBufferSource(); src.buffer = buf;
      const flt = ctx.createBiquadFilter(); flt.type = 'highpass'; flt.frequency.setValueAtTime(6800, time);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, time);
      g.gain.exponentialRampToValueAtTime(0.04, time + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 0.1);
      src.connect(flt).connect(g).connect(gain);
      src.start(time); src.stop(time + len);
      src.onended = () => src.disconnect();
    },
  },
  {
    id: 'cupcake',
    nameKey: 'ingredient.cupcake.name',
    roleKey: 'ingredient.cupcake.role',
    color: '#f48fb1',
    colorLight: 'rgba(255,242,248,0.96)',
    pattern: [3, 7, 11, 15],
    play(time, ctx, gain, step) {
      const melody = [79, 81, 83, 86, 88, 86, 83, 81, 79, 83, 86, 88, 91, 88, 86, 83];
      const midi = melody[(step * 2) % 16];
      const freq = 440 * 2 ** ((midi - 69) / 12);
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const flt = ctx.createBiquadFilter();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, time + 0.08);
      flt.type = 'lowpass'; flt.frequency.setValueAtTime(2200, time);
      g.gain.setValueAtTime(0.0001, time);
      g.gain.exponentialRampToValueAtTime(0.065, time + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 0.24);
      osc.connect(flt).connect(g).connect(gain);
      osc.start(time); osc.stop(time + 0.26);
      osc.onended = () => osc.disconnect();
    },
  },
  {
    id: 'blueberry',
    nameKey: 'ingredient.blueberry.name',
    roleKey: 'ingredient.blueberry.role',
    color: '#5c6bc0',
    colorLight: 'rgba(237,240,255,0.96)',
    pattern: [0, 3, 6, 10, 13],
    play(time, ctx, gain, step) {
      const bassNotes = [36, 38, 40, 43, 40, 38, 36, 43, 36, 40, 43, 45, 43, 40, 38, 36];
      const freq = 440 * 2 ** ((bassNotes[step % 16] - 69) / 12);
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      g.gain.setValueAtTime(0.0001, time);
      g.gain.exponentialRampToValueAtTime(0.12, time + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 0.28);
      osc.connect(g).connect(gain);
      osc.start(time); osc.stop(time + 0.3);
      osc.onended = () => osc.disconnect();
    },
  },
  {
    id: 'peach',
    nameKey: 'ingredient.peach.name',
    roleKey: 'ingredient.peach.role',
    color: '#ffab91',
    colorLight: 'rgba(255,245,240,0.96)',
    pattern: [4, 12],
    play(time, ctx, gain) {
      const len = 0.08;
      const buf = ctx.createBuffer(1, Math.floor(len * ctx.sampleRate), ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (d.length * 0.15));
      const src = ctx.createBufferSource(); src.buffer = buf;
      const flt = ctx.createBiquadFilter(); flt.type = 'bandpass'; flt.frequency.setValueAtTime(1800, time); flt.Q.value = 1.2;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, time);
      g.gain.exponentialRampToValueAtTime(0.09, time + 0.003);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 0.07);
      src.connect(flt).connect(g).connect(gain);
      src.start(time); src.stop(time + len);
      src.onended = () => src.disconnect();
    },
  },
  {
    id: 'mint',
    nameKey: 'ingredient.mint.name',
    roleKey: 'ingredient.mint.role',
    color: '#80cbc4',
    colorLight: 'rgba(235,252,250,0.96)',
    pattern: [0],
    play(time, ctx, gain) {
      // Airy filtered texture — long, quiet
      const len = 2.0;
      const buf = ctx.createBuffer(1, Math.floor(len * ctx.sampleRate), ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.5;
      const src = ctx.createBufferSource(); src.buffer = buf;
      const flt = ctx.createBiquadFilter(); flt.type = 'bandpass'; flt.frequency.setValueAtTime(800, time); flt.Q.value = 3;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, time);
      g.gain.linearRampToValueAtTime(0.025, time + 0.3);
      g.gain.linearRampToValueAtTime(0.0001, time + 1.8);
      src.connect(flt).connect(g).connect(gain);
      src.start(time); src.stop(time + len);
      src.onended = () => src.disconnect();
    },
  },
  {
    id: 'honey',
    nameKey: 'ingredient.honey.name',
    roleKey: 'ingredient.honey.role',
    color: '#ffb74d',
    colorLight: 'rgba(255,248,230,0.96)',
    pattern: [0],
    play(time, ctx, gain) {
      // Warm humming drone
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const g = ctx.createGain();
      const flt = ctx.createBiquadFilter();
      osc.type = 'sine'; osc2.type = 'sine';
      osc.frequency.setValueAtTime(130.81, time); // C3
      osc2.frequency.setValueAtTime(196, time); // G3
      osc2.detune.setValueAtTime(3, time);
      flt.type = 'lowpass'; flt.frequency.setValueAtTime(400, time);
      g.gain.setValueAtTime(0.0001, time);
      g.gain.linearRampToValueAtTime(0.04, time + 0.4);
      g.gain.linearRampToValueAtTime(0.0001, time + 2.2);
      osc.connect(flt); osc2.connect(flt); flt.connect(g).connect(gain);
      osc.start(time); osc2.start(time);
      osc.stop(time + 2.4); osc2.stop(time + 2.4);
      osc.onended = () => osc.disconnect();
      osc2.onended = () => osc2.disconnect();
    },
  },
  {
    id: 'cherry',
    nameKey: 'ingredient.cherry.name',
    roleKey: 'ingredient.cherry.role',
    color: '#ef5350',
    colorLight: 'rgba(255,240,240,0.96)',
    pattern: [3, 7, 11],
    play(time, ctx, gain) {
      // Delicate high chime
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      const freqs = [1318.5, 1567.9, 2093, 1760]; // E6, G6, C7, A6
      osc.frequency.setValueAtTime(freqs[Math.floor(Math.random() * freqs.length)], time);
      g.gain.setValueAtTime(0.0001, time);
      g.gain.exponentialRampToValueAtTime(0.05, time + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 0.4);
      osc.connect(g).connect(gain);
      osc.start(time); osc.stop(time + 0.42);
      osc.onended = () => osc.disconnect();
    },
  },
  {
    id: 'sandwich',
    nameKey: 'ingredient.sandwich.name',
    roleKey: 'ingredient.sandwich.role',
    color: '#a1887f',
    colorLight: 'rgba(250,245,240,0.96)',
    pattern: [1, 4, 6, 9, 12, 14],
    play(time, ctx, gain, step) {
      // Playful bongo/tom
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const pitches = [180, 220, 160, 200]; // varied toms
      const freq = pitches[step % pitches.length];
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, time + 0.08);
      g.gain.setValueAtTime(0.0001, time);
      g.gain.exponentialRampToValueAtTime(0.1, time + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 0.15);
      osc.connect(g).connect(gain);
      osc.start(time); osc.stop(time + 0.17);
      osc.onended = () => osc.disconnect();
    },
  },
];

const ingredientById = new Map(ingredientDefinitions.map(d => [d.id, d]));

export { ingredientDefinitions, ingredientById, STEP_COUNT };
