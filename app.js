const STEP_COUNT = 16;
const BPM = 110;
const STEP_DURATION = 60 / BPM / 4;
const SCHEDULE_AHEAD_TIME = 0.12;
const SCHEDULE_INTERVAL_MS = 25;

const ingredientDefinitions = [
  {
    id: "watermelon",
    name: "Watermelon Bounce",
    selector: ".ingredient--watermelon",
    pattern: [0, 4, 8, 12],
    play(time, context, masterGain) {
      playWatermelonBounce(time, context, masterGain);
    },
  },
  {
    id: "lemonade",
    name: "Lemonade Sparkle",
    selector: ".ingredient--lemonade",
    pattern: [1, 3, 5, 7, 9, 11, 13, 15],
    play(time, context, masterGain, stepIndex) {
      playLemonadeSparkle(time, context, masterGain, stepIndex);
    },
  },
  {
    id: "strawberry",
    name: "Strawberry Melody",
    selector: ".ingredient--strawberry",
    pattern: [2, 5, 7, 10, 12, 14],
    play(time, context, masterGain, stepIndex) {
      playStrawberryMelody(time, context, masterGain, stepIndex);
    },
  },
  {
    id: "cheese",
    name: "Cheesy Harmony",
    selector: ".ingredient--cheese",
    pattern: [0, 4, 8, 12],
    play(time, context, masterGain, stepIndex) {
      playCheesyHarmony(time, context, masterGain, stepIndex);
    },
  },
  {
    id: "grape",
    name: "Grape Shaker",
    selector: ".ingredient--grape",
    pattern: [1, 3, 5, 7, 9, 11, 13, 15],
    play(time, context, masterGain) {
      playGrapeShaker(time, context, masterGain);
    },
  },
  {
    id: "cupcake",
    name: "Cupcake Whistle",
    selector: ".ingredient--cupcake",
    pattern: [4, 6, 8, 11, 14],
    play(time, context, masterGain, stepIndex) {
      playCupcakeWhistle(time, context, masterGain, stepIndex);
    },
  },
];

const state = {
  started: false,
  playing: false,
  currentStep: 0,
  timerId: null,
  nextNoteTime: 0,
  context: null,
  masterGain: null,
  compressor: null,
  volume: 0.7,
  activeLayers: new Set(),
  scheduledVisualTimers: [],
  helpTimerId: null,
  clearMessageActive: false,
  introDismissedAt: 0,
};

const elements = {
  introOverlay: document.getElementById("introOverlay"),
  startButton: document.getElementById("startButton"),
  appShell: document.getElementById("appShell"),
  playPauseButton: document.getElementById("playPauseButton"),
  clearButton: document.getElementById("clearButton"),
  helpButton: document.getElementById("helpButton"),
  volumeSlider: document.getElementById("volumeSlider"),
  activeLayerCount: document.getElementById("activeLayerCount"),
  beatIndicator: document.getElementById("beatIndicator"),
  beatLabel: document.getElementById("beatLabel"),
  recipeStrip: document.getElementById("recipeStrip"),
  mimiSpeech: document.getElementById("mimiSpeech"),
  meadowScene: document.querySelector(".meadow-scene"),
  ingredientButtons: Array.from(document.querySelectorAll(".ingredient")),
};

const ingredientById = new Map(ingredientDefinitions.map((definition) => [definition.id, definition]));
const visualByIngredient = new Map();

initializeBeatIndicator();
cacheIngredientButtons();
bindEvents();
updateInterface();
updateSceneMood();

function bindEvents() {
  elements.startButton.addEventListener("click", handleStartPicnic);
  elements.playPauseButton.addEventListener("click", togglePlayback);
  elements.clearButton.addEventListener("click", clearMix);
  elements.helpButton.addEventListener("click", showHelpMessage);
  elements.volumeSlider.addEventListener("input", handleVolumeChange);

  for (const button of elements.ingredientButtons) {
    button.addEventListener("click", () => toggleIngredient(button.dataset.ingredient));
  }
}

function cacheIngredientButtons() {
  for (const button of elements.ingredientButtons) {
    visualByIngredient.set(button.dataset.ingredient, button);
  }
}

function initializeBeatIndicator() {
  elements.beatIndicator.innerHTML = "";
  for (let index = 0; index < STEP_COUNT; index += 1) {
    const dot = document.createElement("span");
    dot.className = "beat-dot";
    dot.dataset.step = String(index);
    elements.beatIndicator.appendChild(dot);
  }
}

async function handleStartPicnic() {
  if (!state.context) {
    createAudioGraph();
  }

  state.started = true;
  state.clearMessageActive = false;
  state.introDismissedAt = performance.now();
  elements.introOverlay.remove();
  elements.appShell.hidden = false;
  setControlsEnabled(true);
  updateInterface();

  await state.context.resume();
  startTransport();
}

function createAudioGraph() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  state.context = new AudioContextClass();

  state.compressor = state.context.createDynamicsCompressor();
  state.compressor.threshold.value = -22;
  state.compressor.knee.value = 18;
  state.compressor.ratio.value = 3.5;
  state.compressor.attack.value = 0.004;
  state.compressor.release.value = 0.24;

  state.masterGain = state.context.createGain();
  state.masterGain.gain.value = state.volume;
  state.masterGain.connect(state.compressor);
  state.compressor.connect(state.context.destination);
}

function setControlsEnabled(enabled) {
  elements.playPauseButton.disabled = !enabled;
  elements.clearButton.disabled = !enabled;
  elements.helpButton.disabled = !enabled;
  elements.volumeSlider.disabled = !enabled;
  for (const button of elements.ingredientButtons) {
    button.disabled = !enabled;
  }
}

function startTransport() {
  if (state.playing) {
    return;
  }

  state.playing = true;
  state.nextNoteTime = state.context.currentTime + 0.05;
  state.timerId = window.setInterval(schedulerTick, SCHEDULE_INTERVAL_MS);
  elements.playPauseButton.textContent = "Pause";
  updateInterface();
}

function stopTransport() {
  if (!state.playing) {
    return;
  }

  state.playing = false;
  if (state.timerId !== null) {
    window.clearInterval(state.timerId);
    state.timerId = null;
  }
  cancelVisualTimers();
  elements.playPauseButton.textContent = "Play";
  updateInterface();
}

function togglePlayback() {
  if (!state.started) {
    return;
  }

  if (state.playing) {
    stopTransport();
    return;
  }

  state.context.resume().then(() => {
    startTransport();
  });
}

function schedulerTick() {
  while (state.nextNoteTime < state.context.currentTime + SCHEDULE_AHEAD_TIME) {
    scheduleStep(state.currentStep, state.nextNoteTime);
    state.nextNoteTime += STEP_DURATION;
    state.currentStep = (state.currentStep + 1) % STEP_COUNT;
  }
}

function scheduleStep(stepIndex, time) {
  const now = state.context.currentTime;
  const delayMs = Math.max(0, (time - now) * 1000);

  queueVisualBeat(stepIndex, delayMs);
  for (const definition of ingredientDefinitions) {
    if (!state.activeLayers.has(definition.id)) {
      continue;
    }
    if (!definition.pattern.includes(stepIndex)) {
      continue;
    }

    definition.play(time, state.context, state.masterGain, stepIndex);
    queueIngredientVisual(definition.id, delayMs, getVisualDuration(definition.id));
  }
}

function queueVisualBeat(stepIndex, delayMs) {
  const timerId = window.setTimeout(() => {
    updateBeatVisual(stepIndex);
  }, delayMs);
  state.scheduledVisualTimers.push(timerId);
}

function queueIngredientVisual(id, delayMs, durationMs) {
  const timerId = window.setTimeout(() => {
    const button = visualByIngredient.get(id);
    if (!button) {
      return;
    }
    button.classList.add("is-playing");
    window.setTimeout(() => button.classList.remove("is-playing"), durationMs);
  }, delayMs);
  state.scheduledVisualTimers.push(timerId);
}

function getVisualDuration(id) {
  if (id === "cheese") {
    return 520;
  }
  if (id === "grape") {
    return 240;
  }
  return 300;
}

function cancelVisualTimers() {
  for (const timerId of state.scheduledVisualTimers) {
    window.clearTimeout(timerId);
  }
  state.scheduledVisualTimers = [];
  for (const button of elements.ingredientButtons) {
    button.classList.remove("is-playing");
  }
  updateBeatVisual(state.currentStep);
}

function toggleIngredient(id) {
  if (!state.started) {
    return;
  }

  const button = visualByIngredient.get(id);
  if (!button) {
    return;
  }

  if (state.activeLayers.has(id)) {
    state.activeLayers.delete(id);
    button.classList.remove("is-selected");
    button.setAttribute("aria-pressed", "false");
  } else {
    state.activeLayers.add(id);
    button.classList.add("is-selected");
    button.setAttribute("aria-pressed", "true");
    const flickerMs = 260;
    button.classList.add("is-playing");
    window.setTimeout(() => button.classList.remove("is-playing"), flickerMs);
    triggerIngredientPreview(id);
  }

  state.clearMessageActive = false;
  updateInterface();
}

function triggerIngredientPreview(id) {
  if (!state.context || !state.masterGain) {
    return;
  }

  const definition = ingredientDefinitions.find((entry) => entry.id === id);
  if (!definition) {
    return;
  }

  const previewTime = state.context.currentTime + 0.015;
  definition.play(previewTime, state.context, state.masterGain, state.currentStep);
}

function clearMix() {
  state.clearMessageActive = true;
  state.activeLayers.clear();

  for (const button of elements.ingredientButtons) {
    button.classList.remove("is-selected", "is-playing");
    button.setAttribute("aria-pressed", "false");
  }

  cancelVisualTimers();
  updateInterface();
}

function showHelpMessage() {
  if (!state.started) {
    return;
  }

  const helpText = "Tap any picnic treat to turn its sound on or off. Play or pause the groove anytime, clear the mix for a fresh basket, and use the volume slider to keep things gentle.";
  setMimiSpeech(helpText);

  if (state.helpTimerId !== null) {
    window.clearTimeout(state.helpTimerId);
  }

  state.helpTimerId = window.setTimeout(() => {
    state.helpTimerId = null;
    updateInterface();
  }, 7000);
}

function handleVolumeChange(event) {
  const value = Number(event.currentTarget.value) / 100;
  state.volume = value;
  if (state.masterGain) {
    state.masterGain.gain.setTargetAtTime(value, state.context.currentTime, 0.02);
  }
}

function updateInterface() {
  updateActiveLayerSummary();
  updateRecipeStrip();
  updateSceneMood();
  updateMimiMessage();
  updateTransportLabel();
  updateBeatVisual(state.currentStep);
}

function updateTransportLabel() {
  if (!state.started) {
    elements.playPauseButton.textContent = "Play";
    return;
  }

  if (!state.playing) {
    elements.playPauseButton.textContent = "Play";
  }
}

function updateActiveLayerSummary() {
  elements.activeLayerCount.textContent = `${state.activeLayers.size} / 6 sounds`;
}

function updateRecipeStrip() {
  elements.recipeStrip.innerHTML = "";
  if (state.activeLayers.size === 0) {
    const empty = document.createElement("span");
    empty.className = "recipe-empty";
    empty.textContent = "No ingredients yet";
    elements.recipeStrip.appendChild(empty);
    return;
  }

  for (const definition of ingredientDefinitions) {
    if (!state.activeLayers.has(definition.id)) {
      continue;
    }

    const chip = document.createElement("span");
    chip.className = "recipe-chip";
    chip.textContent = definition.name;
    elements.recipeStrip.appendChild(chip);
  }
}

function updateSceneMood() {
  const count = state.activeLayers.size;
  const scene = elements.meadowScene;
  scene.classList.remove("is-calm", "is-gentle", "is-bloom", "is-butterflies", "is-notes", "is-full");

  if (count === 0) {
    scene.classList.add("is-calm");
  } else if (count === 1) {
    scene.classList.add("is-gentle");
  } else if (count === 2) {
    scene.classList.add("is-bloom");
  } else if (count === 3) {
    scene.classList.add("is-bloom");
    scene.classList.add("is-butterflies");
  } else if (count === 4) {
    scene.classList.add("is-notes");
  } else {
    scene.classList.add("is-full");
  }
}

function updateMimiMessage() {
  if (state.helpTimerId !== null) {
    return;
  }

  const count = state.activeLayers.size;
  let message = "Welcome to Picnic Symphony! Every picnic treat has a sound.";

  if (state.started) {
    if (count === 0 && state.clearMessageActive) {
      message = "The picnic is quiet again. Let’s create a new recipe!";
      state.clearMessageActive = false;
    } else if (count === 0) {
      message = "The meadow is listening. Choose a picnic treat to begin!";
    } else if (count === 1) {
      message = "A lovely beginning! Try adding another flavor.";
    } else if (count === 3) {
      message = "Your picnic band is coming alive!";
    } else if (count >= 5) {
      message = "A full summer symphony! Look at the whole meadow dance!";
    } else {
      message = "Keep layering sounds to grow the picnic scene.";
    }
  }

  setMimiSpeech(message);
}

function setMimiSpeech(message) {
  elements.mimiSpeech.textContent = message;
}

function updateBeatVisual(stepIndex) {
  const dots = Array.from(elements.beatIndicator.querySelectorAll(".beat-dot"));
  for (const dot of dots) {
    dot.classList.toggle("is-current", Number(dot.dataset.step) === stepIndex);
  }
  elements.beatLabel.textContent = `Step ${stepIndex + 1} of ${STEP_COUNT}`;
}

function playWatermelonBounce(time, context, masterGain) {
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(96, time);
  osc.frequency.exponentialRampToValueAtTime(48, time + 0.16);
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(0.14, time + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.34);
  osc.connect(gain).connect(masterGain);
  osc.start(time);
  osc.stop(time + 0.36);
  osc.onended = () => osc.disconnect();
}

function playLemonadeSparkle(time, context, masterGain, stepIndex) {
  const scale = [0, 2, 4, 7, 9, 11, 14];
  const noteIndex = scale[Math.floor(stepIndex / 2) % scale.length];
  const note = midiToFrequency(72 + noteIndex);

  const oscA = context.createOscillator();
  const oscB = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();

  oscA.type = "triangle";
  oscB.type = "sine";
  oscA.frequency.setValueAtTime(note, time);
  oscB.frequency.setValueAtTime(note * 2, time);
  oscB.detune.setValueAtTime(-7, time);

  filter.type = "highpass";
  filter.frequency.setValueAtTime(540, time);

  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(0.085, time + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.26);

  oscA.connect(filter);
  oscB.connect(filter);
  filter.connect(gain).connect(masterGain);
  oscA.start(time);
  oscB.start(time);
  oscA.stop(time + 0.28);
  oscB.stop(time + 0.28);
  oscA.onended = () => oscA.disconnect();
  oscB.onended = () => oscB.disconnect();
}

function playStrawberryMelody(time, context, masterGain, stepIndex) {
  const melody = [72, 74, 76, 79, 76, 74, 71, 72, 76, 79, 81, 79, 76, 74, 72, 69];
  const frequency = midiToFrequency(melody[stepIndex % melody.length]);
  const osc = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(frequency, time);
  osc.detune.setValueAtTime(-4, time);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2400, time);
  filter.Q.value = 0.7;

  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(0.11, time + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.34);

  osc.connect(filter).connect(gain).connect(masterGain);
  osc.start(time);
  osc.stop(time + 0.36);
  osc.onended = () => osc.disconnect();
}

function playCheesyHarmony(time, context, masterGain, stepIndex) {
  const chordProgression = [
    [60, 64, 67],
    [57, 60, 64],
    [65, 69, 72],
    [55, 59, 62],
  ];
  const chord = chordProgression[Math.floor(stepIndex / 4) % chordProgression.length];
  const groupGain = context.createGain();
  groupGain.gain.setValueAtTime(0.0001, time);
  groupGain.gain.exponentialRampToValueAtTime(0.08, time + 0.06);
  groupGain.gain.exponentialRampToValueAtTime(0.0001, time + 1.6);

  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1800, time);
  filter.Q.value = 0.4;

  chord.forEach((midi, voiceIndex) => {
    const osc = context.createOscillator();
    osc.type = voiceIndex === 0 ? "triangle" : "sine";
    osc.frequency.setValueAtTime(midiToFrequency(midi), time);
    osc.detune.setValueAtTime((voiceIndex - 1) * 6, time);
    osc.connect(filter);
    osc.start(time);
    osc.stop(time + 1.7);
    osc.onended = () => osc.disconnect();
  });

  filter.connect(groupGain).connect(masterGain);
}

function playGrapeShaker(time, context, masterGain) {
  const buffer = createNoiseBuffer(context, 0.16);
  const source = context.createBufferSource();
  source.buffer = buffer;

  const filter = context.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.setValueAtTime(6800, time);

  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(0.045, time + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.11);

  source.connect(filter).connect(gain).connect(masterGain);
  source.start(time);
  source.stop(time + 0.14);
  source.onended = () => source.disconnect();
}

function playCupcakeWhistle(time, context, masterGain, stepIndex) {
  const melody = [79, 81, 83, 86, 88, 86, 83, 81, 79, 83, 86, 88, 91, 88, 86, 83];
  const midi = melody[(stepIndex * 2) % melody.length];
  const osc = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();

  osc.type = "sine";
  osc.frequency.setValueAtTime(midiToFrequency(midi), time);
  osc.frequency.exponentialRampToValueAtTime(midiToFrequency(midi + 2), time + 0.08);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2200, time);

  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(0.07, time + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.26);

  osc.connect(filter).connect(gain).connect(masterGain);
  osc.start(time);
  osc.stop(time + 0.28);
  osc.onended = () => osc.disconnect();
}

function createNoiseBuffer(context, lengthSeconds) {
  const sampleRate = context.sampleRate;
  const frameCount = Math.max(1, Math.floor(lengthSeconds * sampleRate));
  const buffer = context.createBuffer(1, frameCount, sampleRate);
  const channelData = buffer.getChannelData(0);

  for (let index = 0; index < frameCount; index += 1) {
    channelData[index] = (Math.random() * 2 - 1) * (1 - index / frameCount);
  }

  return buffer;
}

function midiToFrequency(midi) {
  return 440 * (2 ** ((midi - 69) / 12));
}
