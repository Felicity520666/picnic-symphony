/**
 * audio.js — Audio engine with multi-bus routing, 96 BPM default,
 * 6-layer limit, gentle compression, and ambience ducking.
 *
 * Bus architecture:
 *   Ingredient → bus gain (rhythm/bass/melody/harmony/texture)
 *                → master gain → compressor/limiter → destination
 *   Ambience   → ambience gain → destination (separate path)
 */

import { state, setState } from './state.js';
import { ingredientDefinitions, STEP_COUNT, MAX_LAYERS } from './ingredients.js';

const SCHEDULE_AHEAD_TIME = 0.1;
const SCHEDULE_INTERVAL_MS = 25;
const DEFAULT_BPM = 96;

// Bus gain levels (linear) — louder for audibility, compressor prevents clipping
const BUS_GAINS = {
  rhythm:  1.0,
  bass:    0.9,
  melody:  0.8,
  harmony: 0.7,
  texture: 0.6,
};

let buses = {};

/** Create the full audio graph */
function createAudioGraph() {
  if (state.context) return;

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioCtx();

  // Limiter to prevent clipping (gentle settings)
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -6;
  compressor.knee.value = 8;
  compressor.ratio.value = 3;
  compressor.attack.value = 0.005;
  compressor.release.value = 0.2;

  // Master gain (comfortable listening level)
  const masterGain = ctx.createGain();
  masterGain.gain.value = state.volume * 1.0;
  masterGain.connect(compressor);
  compressor.connect(ctx.destination);

  // Create bus gains
  buses = {};
  for (const [name, level] of Object.entries(BUS_GAINS)) {
    const g = ctx.createGain();
    g.gain.value = level;
    g.connect(masterGain);
    buses[name] = g;
  }

  // Ambience on separate path (default off — no real ambient track exists)
  const ambienceGain = ctx.createGain();
  ambienceGain.gain.value = 0;
  ambienceGain.connect(ctx.destination);

  setState({ context: ctx, masterGain, ambienceGain, compressor });
}

/** Get the correct bus gain node for an ingredient */
function getBusForIngredient(ingredientId) {
  const def = ingredientDefinitions.find(d => d.id === ingredientId);
  const busName = def?.bus || 'melody';
  return buses[busName] || state.masterGain;
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

/** Stop the sequencer */
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
  if (state.playing) stopTransport();
  else resumeAudio().then(() => startTransport());
}

/** Scheduler tick — look-ahead scheduling */
function schedulerTick() {
  const stepDuration = 60 / state.bpm / 4;
  while (state.nextNoteTime < state.context.currentTime + SCHEDULE_AHEAD_TIME) {
    scheduleStep(state.currentStep, state.nextNoteTime);
    state.nextNoteTime += stepDuration;
    state.currentStep = (state.currentStep + 1) % STEP_COUNT;
  }
}

/** Schedule active layers for a given step */
function scheduleStep(stepIndex, time) {
  const now = state.context.currentTime;
  const delayMs = Math.max(0, (time - now) * 1000);

  for (const def of ingredientDefinitions) {
    if (!state.activeLayers.has(def.id)) continue;
    if (!def.pattern.includes(stepIndex)) continue;
    // Route through the correct bus
    const busGain = getBusForIngredient(def.id);
    def.play(time, state.context, busGain, stepIndex);
    queueVisual(def.id, delayMs);
  }
}

/** Visual hit callback system */
const visualCallbacks = new Set();
function onVisualHit(cb) { visualCallbacks.add(cb); return () => visualCallbacks.delete(cb); }

function queueVisual(id, delayMs) {
  const t = setTimeout(() => { for (const cb of visualCallbacks) cb(id); }, delayMs);
  state.scheduledVisualTimers.push(t);
}

function cancelVisualTimers() {
  for (const t of state.scheduledVisualTimers) clearTimeout(t);
  state.scheduledVisualTimers = [];
}

/** Check if adding a layer would exceed MAX_LAYERS */
function canAddLayer() {
  return state.activeLayers.size < MAX_LAYERS;
}

/** Set master music volume */
function setMusicVolume(value) {
  setState({ volume: value }, true);
  if (state.masterGain) {
    state.masterGain.gain.setTargetAtTime(value * 1.0, state.context.currentTime, 0.03);
  }
}

/** Set ambience volume */
function setAmbienceVolume(value) {
  setState({ ambienceVolume: value, ambienceMuted: false }, true);
  if (state.ambienceGain) {
    state.ambienceGain.gain.setTargetAtTime(value * 0.3, state.context.currentTime, 0.05);
  }
}

/** Toggle ambience mute */
function toggleAmbienceMute() {
  const muted = !state.ambienceMuted;
  setState({ ambienceMuted: muted }, true);
  if (state.ambienceGain) {
    const target = muted ? 0 : state.ambienceVolume * 0.3;
    state.ambienceGain.gain.setTargetAtTime(target, state.context.currentTime, 0.05);
  }
}

/** Duck ambience when music layers are active */
function updateAmbienceDucking() {
  if (!state.ambienceGain || state.ambienceMuted) return;
  const hasMusic = state.activeLayers.size > 0;
  const base = state.ambienceVolume * 0.3;
  const target = hasMusic ? base * 0.12 : base;
  state.ambienceGain.gain.setTargetAtTime(target, state.context.currentTime, 1.0);
}

/** Set BPM */
function setTempo(bpm) {
  setState({ bpm: Math.max(60, Math.min(140, bpm)) }, true);
}

/** Preview a single ingredient (solo, short) */
function previewIngredient(id) {
  if (!state.context) return;
  const def = ingredientDefinitions.find(d => d.id === id);
  if (!def) return;
  const busGain = getBusForIngredient(id);
  def.play(state.context.currentTime + 0.01, state.context, busGain, 0);
}

/** Clear all active layers */
function clearAllLayers() {
  state.activeLayers.clear();
  cancelVisualTimers();
  updateAmbienceDucking();
}

/** Start quiet environmental ambience (only if user enables it) */
function startAmbience() {
  // No real ambient audio file exists — skip synthetic noise
  // If a real lofi track is added later, load it here
}

function stopAmbience() {
  if (state._ambienceSource) {
    try { state._ambienceSource.stop(); } catch (e) {}
    state._ambienceSource = null;
  }
}

export {
  createAudioGraph, resumeAudio,
  startTransport, stopTransport, toggleTransport,
  setMusicVolume, setAmbienceVolume, toggleAmbienceMute, updateAmbienceDucking,
  setTempo, previewIngredient, clearAllLayers, canAddLayer,
  cancelVisualTimers, onVisualHit,
  startAmbience, stopAmbience,
  DEFAULT_BPM,
};
