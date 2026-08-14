/**
 * audio-export.js — Offline audio rendering and WAV export.
 * Uses OfflineAudioContext to render the composition at a chosen tempo/loops.
 * Reuses the same ingredient play() functions from ingredients.js.
 */

import { ingredientDefinitions, STEP_COUNT } from './ingredients.js';
import { t } from './i18n.js';

/**
 * Render the composition offline and return an AudioBuffer.
 */
export async function renderOffline({ ingredientIds, tempo, loops, volume }) {
  const sampleRate = 44100;
  const stepDuration = 60 / tempo / 4; // duration of one 16th-note step
  const loopDuration = STEP_COUNT * stepDuration;
  const totalDuration = loopDuration * loops;
  const frameCount = Math.ceil(totalDuration * sampleRate);

  const offCtx = new OfflineAudioContext(2, frameCount, sampleRate);

  // Master gain for export volume
  const masterGain = offCtx.createGain();
  masterGain.gain.value = volume;
  masterGain.connect(offCtx.destination);

  // Schedule all ingredients for all loops
  const defs = ingredientDefinitions.filter(d => ingredientIds.includes(d.id));

  for (let loop = 0; loop < loops; loop++) {
    const loopOffset = loop * loopDuration;
    for (let step = 0; step < STEP_COUNT; step++) {
      const time = loopOffset + step * stepDuration;
      for (const def of defs) {
        if (!def.pattern.includes(step)) continue;
        def.play(time, offCtx, masterGain, step);
      }
    }
  }

  // Render
  const buffer = await offCtx.startRendering();
  return buffer;
}

/**
 * Encode an AudioBuffer to a WAV Blob.
 */
export function encodeWAV(buffer) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitsPerSample = 16;

  const channels = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  const numFrames = buffer.length;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = numFrames * blockAlign;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, totalSize - 8, true);
  writeString(view, 8, 'WAVE');

  // fmt chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // chunk size
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // data chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Interleaved samples
  let offset = 44;
  for (let i = 0; i < numFrames; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      let sample = channels[ch][i];
      sample = Math.max(-1, Math.min(1, sample));
      const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(offset, int16, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Calculate export info for display.
 */
export function getExportInfo({ tempo, loops, ingredientCount }) {
  const stepDuration = 60 / tempo / 4;
  const loopDuration = STEP_COUNT * stepDuration;
  const totalDuration = loopDuration * loops;
  const estimatedSizeBytes = Math.ceil(totalDuration * 44100 * 2 * 2); // stereo 16-bit
  return {
    durationSeconds: Math.round(totalDuration * 10) / 10,
    estimatedSizeMB: Math.round(estimatedSizeBytes / 1024 / 1024 * 10) / 10,
  };
}

/**
 * Full export flow: render + encode + download.
 */
export async function exportAudio({ ingredientIds, tempo, loops, volume, filename }) {
  const buffer = await renderOffline({ ingredientIds, tempo, loops, volume });
  const blob = encodeWAV(buffer);
  const safeName = (filename || 'picnic-symphony-creation')
    .replace(/[^a-zA-Z0-9\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff -]/g, '')
    .trim() || 'picnic-symphony-creation';

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${safeName}.wav`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return blob;
}
