/**
 * audio.js — Audio engine with dual bus (music + ambience),
 * look-ahead scheduler, and tempo control.
 */

import { state, setState } from './state.js';
import { ingredientDefinitions, STEP_COUNT } from './ingredients.js';

const SCHEDULE_AHEAD_TIME = 0.12;
const SCHEDULE_INTERVAL_MS = 25;

/** Create the audio graph with separate music and ambience buses */
function createAudioGraph() {
  if (state.context) return;

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioCtx();

  // Compressor for music bus
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -20;
  compressor.knee.value = 16;
  compressor.ratio.value = 3;
  compressor.attack.value = 0.004;
  compressor.release.value = 0.24;

  // Music master gain → compressor → destination
  const masterGain = ctx.createGain();
  masterGain.gain.value = state.volume;
  masterGain.connect(compressor);
  compressor.connect(ctx.destination);

  // Ambience gain → destination (bypasses compressor)
  const ambienceGain = ctx.createGain();
  ambienceGain.gain.value = state.ambienceMuted ? 0 : state.ambienceVolume;
  ambienceGain.connect(ctx.destination);

  setState({
    context: ctx,
    masterGain,
    ambienceGain,
    compressor,
  });
}

/** Resume audio context (required after user gesture) */
async function resumeAudio() {
  if (!state.context) createAudioGraph();
  if (state.context.state === 'suspended') {
    await state.context.resume();
  }
}

/** Start the sequencer transport */
function startTransport() {
  if (state.playing) return;
  setState({ playing: true });
  state.nextNoteTime = state.context.currentTime + 0.05;
  const id = setInterval(schedulerTick, SCHEDULE_INTERVAL_MS);
  setState({ timerId: id });
}

/** Stop the sequencer transport */
function stopTransport() {
  if (!state.playing) return;
  setState({ playing: false });
  if (state.timerId !== null) {
    clearInterval(state.timerId);
    setState({ timerId: null });
  }
  cancelVisualTimers();
}

/** Toggle play/pause */
function toggleTransport() {
  if (state.playing) {
    stopTransport();
  } else {
    resumeAudio().then(() => startTransport());
  }
}

/** Scheduler tick — look-ahead and schedule notes */
function schedulerTick() {
  const stepDuration = 60 / state.bpm / 4;
  while (state.nextNoteTime < state.context.currentTime + SCHEDULE_AHEAD_TIME) {
    scheduleStep(state.currentStep, state.nextNoteTime);
    state.nextNoteTime += stepDuration;
    state.currentStep = (state.currentStep + 1) % STEP_COUNT;
  }
}

/** Schedule all active layers for a given step */
function scheduleStep(stepIndex, time) {
  const now = state.context.currentTime;
  const delayMs = Math.max(0, (time - now) * 1000);

  for (const def of ingredientDefinitions) {
    if (!state.activeLayers.has(def.id)) continue;
    if (!def.pattern.includes(stepIndex)) continue;
    def.play(time, state.context, state.masterGain, stepIndex);
    queueVisual(def.id, delayMs);
  }
}

/** Queue visual feedback for an ingredient hit */
const visualCallbacks = new Set();

function onVisualHit(callback) {
  visualCallbacks.add(callback);
  return () => visualCallbacks.delete(callback);
}

function queueVisual(id, delayMs) {
  const timerId = setTimeout(() => {
    for (const cb of visualCallbacks) cb(id);
  }, delayMs);
  state.scheduledVisualTimers.push(timerId);
}

function cancelVisualTimers() {
  for (const t of state.scheduledVisualTimers) clearTimeout(t);
  state.scheduledVisualTimers = [];
}

/** Set master music volume */
function setMusicVolume(value) {
  setState({ volume: value }, true);
  if (state.masterGain) {
    state.masterGain.gain.setTargetAtTime(value, state.context.currentTime, 0.02);
  }
}

/** Set ambience volume */
function setAmbienceVolume(value) {
  setState({ ambienceVolume: value, ambienceMuted: false }, true);
  if (state.ambienceGain) {
    state.ambienceGain.gain.setTargetAtTime(value, state.context.currentTime, 0.05);
  }
}

/** Mute/unmute ambience */
function toggleAmbienceMute() {
  const muted = !state.ambienceMuted;
  setState({ ambienceMuted: muted }, true);
  if (state.ambienceGain) {
    const target = muted ? 0 : state.ambienceVolume;
    state.ambienceGain.gain.setTargetAtTime(target, state.context.currentTime, 0.05);
  }
}

/** Duck ambience when music layers are active */
function updateAmbienceDucking() {
  if (!state.ambienceGain || state.ambienceMuted) return;
  const hasMusic = state.activeLayers.size > 0;
  const target = hasMusic ? state.ambienceVolume * 0.12 : state.ambienceVolume;
  state.ambienceGain.gain.setTargetAtTime(target, state.context.currentTime, 0.8);
}

/** Set BPM */
function setTempo(bpm) {
  setState({ bpm: Math.max(60, Math.min(160, bpm)) }, true);
}

/** Preview a single ingredient sound */
function previewIngredient(id) {
  if (!state.context || !state.masterGain) return;
  const def = ingredientDefinitions.find(d => d.id === id);
  if (!def) return;
  def.play(state.context.currentTime + 0.015, state.context, state.masterGain, state.currentStep);
}

/** Clear all active layers and stop sounds */
function clearAllLayers() {
  state.activeLayers.clear();
  cancelVisualTimers();
  updateAmbienceDucking();
}

/** Start simple ambience (wind + birds or crickets based on theme) */
function startAmbience() {
  // Ambience implementation — creates quiet looping noise
  if (!state.context || !state.ambienceGain) return;

  const ctx = state.context;
  const duration = 4;
  const buf = ctx.createBuffer(1, Math.floor(duration * ctx.sampleRate), ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3;
  }

  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop = true;

  const flt = ctx.createBiquadFilter();
  flt.type = 'lowpass';
  flt.frequency.value = 400;
  flt.Q.value = 0.3;

  const g = ctx.createGain();
  g.gain.value = 0.6;

  src.connect(flt).connect(g).connect(state.ambienceGain);
  src.start();

  // Store reference for cleanup
  state._ambienceSource = src;
}

function stopAmbience() {
  if (state._ambienceSource) {
    try { state._ambienceSource.stop(); } catch (e) {}
    state._ambienceSource = null;
  }
}

export {
  createAudioGraph,
  resumeAudio,
  startTransport,
  stopTransport,
  toggleTransport,
  setMusicVolume,
  setAmbienceVolume,
  toggleAmbienceMute,
  updateAmbienceDucking,
  setTempo,
  previewIngredient,
  clearAllLayers,
  cancelVisualTimers,
  onVisualHit,
  startAmbience,
  stopAmbience,
};
