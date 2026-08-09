/* ===== CONSTANTS ===== */
const STEP_COUNT = 16;
const BPM = 110;
const STEP_DURATION = 60 / BPM / 4;
const SCHEDULE_AHEAD_TIME = 0.12;
const SCHEDULE_INTERVAL_MS = 25;

/* ===== GUIDE DEFINITIONS ===== */
const guideDefinitions = {
  bee: {
    name: "Honey Bee",
    personality: "cheerful",
    messages: {
      welcome: "Bzz! Let's make some sweet music together!",
      firstAdd: "That's the buzz! Add another treat!",
      threeActive: "The hive is humming! Keep going!",
      fullMix: "A full honeycomb of sound! Beautiful!",
      cleared: "Fresh start! Let's fill the meadow again!",
      idle: "Tap any treat to get the buzz started, or pick a recipe!",
      recipeStep: (name, step, total) => `Step ${step} of ${total}: Add ${name}! Buzz buzz!`,
      recipeDone: (name) => `Sweet! ${name} is complete! Try remixing or pick a new recipe!`,
    },
  },
  butterfly: {
    name: "Butterfly",
    personality: "gentle",
    messages: {
      welcome: "Welcome to Picnic Symphony! Follow me to the next treat.",
      firstAdd: "A lovely beginning! Try adding another flavor.",
      threeActive: "Your picnic band is coming alive!",
      fullMix: "A full summer symphony! Look at the meadow dance!",
      cleared: "The picnic is quiet again. Let's create something new!",
      idle: "The meadow is listening. Pick a recipe above to get started!",
      recipeStep: (name, step, total) => `Step ${step} of ${total}: Gently add ${name}.`,
      recipeDone: (name) => `Beautiful. ${name} is ready. You can remix it or try a new recipe.`,
    },
  },
  dragonfly: {
    name: "Dragonfly",
    personality: "curious",
    messages: {
      welcome: "Hey! Ready to zip through some musical treats?",
      firstAdd: "Nice pick! What's next? I'm curious!",
      threeActive: "Ooh, layers are building! This is getting interesting!",
      fullMix: "Wow, the whole meadow is alive with sound!",
      cleared: "Clean slate! Let's explore something new!",
      idle: "Tap a treat and let's see what sound it makes! Or pick a recipe!",
      recipeStep: (name, step, total) => `Step ${step} of ${total}: Quick, add ${name}!`,
      recipeDone: (name) => `Done! ${name} sounds great! Want to try another combo?`,
    },
  },
  bird: {
    name: "Little Bird",
    personality: "warm",
    messages: {
      welcome: "Hello friend! Let's sing a picnic song together!",
      firstAdd: "What a nice note! Let's add more to the melody!",
      threeActive: "Our little choir is growing! Tweet tweet!",
      fullMix: "A whole orchestra of picnic sounds! Lovely!",
      cleared: "A quiet moment. Ready to sing again when you are!",
      idle: "Pick a recipe and tap a treat to start our song!",
      recipeStep: (name, step, total) => `Step ${step} of ${total}: Add ${name} to our song!`,
      recipeDone: (name) => `Wonderful! ${name} is complete! Shall we try another tune?`,
    },
  },
};

/* ===== GUIDE SVG TEMPLATES ===== */
const guideSvgTemplates = {
  bee: `<svg viewBox="55 45 90 115">
    <defs>
      <linearGradient id="gbBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffd54f"/><stop offset="100%" stop-color="#f9a825"/></linearGradient>
      <linearGradient id="gbWing" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fff" stop-opacity="0.85"/><stop offset="100%" stop-color="#e3f2fd" stop-opacity="0.4"/></linearGradient>
    </defs>
    <ellipse cx="80" cy="80" rx="20" ry="28" fill="url(#gbWing)" stroke="#90caf9" stroke-width="1.5" transform="rotate(-15 80 80)"/>
    <ellipse cx="120" cy="80" rx="20" ry="28" fill="url(#gbWing)" stroke="#90caf9" stroke-width="1.5" transform="rotate(15 120 80)"/>
    <ellipse cx="100" cy="110" rx="22" ry="30" fill="url(#gbBody)" stroke="#e65100" stroke-width="2.5"/>
    <path d="M80 100h40" stroke="#4e342e" stroke-width="4" stroke-linecap="round"/>
    <path d="M81 112h38" stroke="#4e342e" stroke-width="4" stroke-linecap="round"/>
    <path d="M82 124h36" stroke="#4e342e" stroke-width="4" stroke-linecap="round"/>
    <circle cx="100" cy="82" r="16" fill="#fff8e1" stroke="#f9a825" stroke-width="2.5"/>
    <circle cx="94" cy="80" r="3.5" fill="#3e2723"/><circle cx="106" cy="80" r="3.5" fill="#3e2723"/>
    <circle cx="93" cy="78.5" r="1.3" fill="#fff"/><circle cx="105" cy="78.5" r="1.3" fill="#fff"/>
    <path d="M96 89c2 2.5 6 2.5 8 0" fill="none" stroke="#5d4037" stroke-width="2" stroke-linecap="round"/>
    <path d="M94 67c-3-8-6-13-9-15" fill="none" stroke="#5d4037" stroke-width="2" stroke-linecap="round"/>
    <circle cx="85" cy="52" r="3" fill="#ffd54f" stroke="#5d4037" stroke-width="1.5"/>
    <path d="M106 67c3-8 6-13 9-15" fill="none" stroke="#5d4037" stroke-width="2" stroke-linecap="round"/>
    <circle cx="115" cy="52" r="3" fill="#ffd54f" stroke="#5d4037" stroke-width="1.5"/>
  </svg>`,

  butterfly: `<svg viewBox="25 50 150 105">
    <defs>
      <linearGradient id="gbfWL" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fff8cf"/><stop offset="45%" stop-color="#f5c1ee"/><stop offset="100%" stop-color="#82d7e6"/></linearGradient>
      <linearGradient id="gbfWR" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fdf2ff"/><stop offset="55%" stop-color="#8fd8ec"/><stop offset="100%" stop-color="#6abf88"/></linearGradient>
    </defs>
    <path d="M98 100c-12-26-36-44-58-40-8 20-1 46 20 60 14 10 30 12 40 5 6-4 6-14-2-25Z" fill="url(#gbfWL)" stroke="#6e6d8a" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M102 100c12-26 36-44 58-40 8 20 1 46-20 60-14 10-30 12-40 5-6-4-6-14 2-25Z" fill="url(#gbfWR)" stroke="#6e6d8a" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M90 108c-14-10-28-11-38-5 4 12 13 20 24 23 9 2 18-2 20-11 1-3-1-4-6-7Z" fill="#fff" fill-opacity="0.3"/>
    <path d="M110 108c14-10 28-11 38-5-4 12-13 20-24 23-9 2-18-2-20-11-1-3 1-4 6-7Z" fill="#fff" fill-opacity="0.3"/>
    <path d="M96 84c-4-12-14-22-24-26 0 10 5 18 12 24" fill="none" stroke="#b7de83" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M104 84c4-12 14-22 24-26 0 10-5 18-12 24" fill="none" stroke="#b7de83" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M100 106v28" fill="none" stroke="#6a4f53" stroke-width="4.5" stroke-linecap="round"/>
    <circle cx="96" cy="100" r="4" fill="#3d2a25"/><circle cx="104" cy="100" r="4" fill="#3d2a25"/>
    <circle cx="95" cy="98.5" r="1.4" fill="#fff8f2"/><circle cx="103" cy="98.5" r="1.4" fill="#fff8f2"/>
    <path d="M97 107c2 2.5 5 2.5 7 0" fill="none" stroke="#d86b87" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  dragonfly: `<svg viewBox="35 58 130 110">
    <defs>
      <linearGradient id="gdfB" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4dd0e1"/><stop offset="100%" stop-color="#00897b"/></linearGradient>
      <linearGradient id="gdfW" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e0f7fa" stop-opacity="0.85"/><stop offset="100%" stop-color="#b2ebf2" stop-opacity="0.35"/></linearGradient>
    </defs>
    <ellipse cx="68" cy="80" rx="26" ry="12" fill="url(#gdfW)" stroke="#4dd0e1" stroke-width="1.5" transform="rotate(-20 68 80)"/>
    <ellipse cx="132" cy="80" rx="26" ry="12" fill="url(#gdfW)" stroke="#4dd0e1" stroke-width="1.5" transform="rotate(20 132 80)"/>
    <ellipse cx="72" cy="98" rx="22" ry="9" fill="url(#gdfW)" stroke="#4dd0e1" stroke-width="1.2" transform="rotate(-10 72 98)"/>
    <ellipse cx="128" cy="98" rx="22" ry="9" fill="url(#gdfW)" stroke="#4dd0e1" stroke-width="1.2" transform="rotate(10 128 98)"/>
    <path d="M100 92v60" stroke="url(#gdfB)" stroke-width="5" stroke-linecap="round"/>
    <circle cx="100" cy="108" r="3" fill="#26a69a" stroke="#00695c" stroke-width="1.2"/>
    <circle cx="100" cy="120" r="2.7" fill="#26a69a" stroke="#00695c" stroke-width="1.2"/>
    <circle cx="100" cy="131" r="2.4" fill="#26a69a" stroke="#00695c" stroke-width="1.2"/>
    <circle cx="100" cy="141" r="2" fill="#26a69a" stroke="#00695c" stroke-width="1.2"/>
    <circle cx="100" cy="78" r="14" fill="#e0f7fa" stroke="#00897b" stroke-width="2.5"/>
    <circle cx="93" cy="76" r="5.5" fill="#00695c"/><circle cx="107" cy="76" r="5.5" fill="#00695c"/>
    <circle cx="91.5" cy="74.5" r="2" fill="#e0f7fa"/><circle cx="105.5" cy="74.5" r="2" fill="#e0f7fa"/>
    <path d="M96 87c2.5 2 5.5 2 8 0" fill="none" stroke="#00695c" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`,

  bird: `<svg viewBox="45 48 110 120">
    <defs>
      <linearGradient id="gbiB" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffcc80"/><stop offset="100%" stop-color="#ff8a65"/></linearGradient>
      <linearGradient id="gbiBe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff8e1"/><stop offset="100%" stop-color="#ffecb3"/></linearGradient>
    </defs>
    <path d="M116 135c7 5 13 12 16 20" fill="none" stroke="#ff8a65" stroke-width="3" stroke-linecap="round"/>
    <path d="M112 133c9 5 17 11 22 18" fill="none" stroke="#ffab91" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="100" cy="115" rx="28" ry="32" fill="url(#gbiB)" stroke="#e65100" stroke-width="2.5"/>
    <ellipse cx="100" cy="124" rx="18" ry="20" fill="url(#gbiBe)" stroke="#ffcc80" stroke-width="1.2"/>
    <path d="M74 106c-9-3-16 1-19 10 6 7 13 11 21 9 6-1 10-6 10-12 0-3-3-5-12-7Z" fill="#ffe0b2" stroke="#e65100" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="100" cy="72" r="18" fill="url(#gbiB)" stroke="#e65100" stroke-width="2.5"/>
    <circle cx="89" cy="77" r="4.5" fill="#ffab91" opacity="0.5"/><circle cx="111" cy="77" r="4.5" fill="#ffab91" opacity="0.5"/>
    <circle cx="94" cy="70" r="4" fill="#3e2723"/><circle cx="106" cy="70" r="4" fill="#3e2723"/>
    <circle cx="93" cy="68.5" r="1.6" fill="#fff"/><circle cx="105" cy="68.5" r="1.6" fill="#fff"/>
    <path d="M97 79l3 6 3-6Z" fill="#ff6f00" stroke="#e65100" stroke-width="1.3" stroke-linejoin="round"/>
    <path d="M97 56c-1.5-6 0-10 3-14 3 3 4.5 7.5 3.5 14" fill="#ff8a65" stroke="#e65100" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M90 145c-1.5 4-3 7-5.5 9" fill="none" stroke="#bf360c" stroke-width="2" stroke-linecap="round"/>
    <path d="M110 145c1.5 4 3 7 5.5 9" fill="none" stroke="#bf360c" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
};

/* ===== INGREDIENT DEFINITIONS ===== */
const ingredientDefinitions = [
  {
    id: "watermelon", name: "Watermelon Bounce", selector: ".ingredient--watermelon",
    pattern: [0, 4, 8, 12],
    play(time, context, masterGain) { playWatermelonBounce(time, context, masterGain); },
  },
  {
    id: "lemonade", name: "Lemonade Sparkle", selector: ".ingredient--lemonade",
    pattern: [1, 3, 5, 7, 9, 11, 13, 15],
    play(time, context, masterGain, stepIndex) { playLemonadeSparkle(time, context, masterGain, stepIndex); },
  },
  {
    id: "strawberry", name: "Strawberry Melody", selector: ".ingredient--strawberry",
    pattern: [2, 5, 7, 10, 12, 14],
    play(time, context, masterGain, stepIndex) { playStrawberryMelody(time, context, masterGain, stepIndex); },
  },
  {
    id: "cheese", name: "Cheesy Harmony", selector: ".ingredient--cheese",
    pattern: [0, 4, 8, 12],
    play(time, context, masterGain, stepIndex) { playCheesyHarmony(time, context, masterGain, stepIndex); },
  },
  {
    id: "grape", name: "Grape Shaker", selector: ".ingredient--grape",
    pattern: [1, 3, 5, 7, 9, 11, 13, 15],
    play(time, context, masterGain) { playGrapeShaker(time, context, masterGain); },
  },
  {
    id: "cupcake", name: "Cupcake Whistle", selector: ".ingredient--cupcake",
    pattern: [4, 6, 8, 11, 14],
    play(time, context, masterGain, stepIndex) { playCupcakeWhistle(time, context, masterGain, stepIndex); },
  },
];

/* ===== RECIPE DEFINITIONS ===== */
const recipeDefinitions = [
  {
    id: "sunrise-basket", name: "Sunrise Basket", mood: "Bright and bubbly",
    description: "A cheerful starter recipe with bass, sparkle, and fruit melody.",
    steps: [
      { ingredientId: "watermelon", note: "Start with the grounding bounce." },
      { ingredientId: "lemonade", note: "Add a sparkling glass of light." },
      { ingredientId: "strawberry", note: "Stir in a sweet little tune." },
      { ingredientId: "grape", note: "Shake in a soft picnic rhythm." },
    ],
  },
  {
    id: "soft-meadow-waltz", name: "Soft Meadow Waltz", mood: "Warm and glowy",
    description: "A dreamy picnic recipe built around harmony and a gentle whistle.",
    steps: [
      { ingredientId: "cheese", note: "Lay down the warm harmony first." },
      { ingredientId: "cupcake", note: "Float in the sweet lead line." },
      { ingredientId: "strawberry", note: "Add a dancing melody on top." },
      { ingredientId: "watermelon", note: "Anchor the whole basket with a bounce." },
    ],
  },
  {
    id: "sparkling-feast", name: "Sparkling Feast", mood: "Playful and full",
    description: "A fuller recipe with bright percussion, melody, and glowing chords.",
    steps: [
      { ingredientId: "grape", note: "Begin with the shaker texture." },
      { ingredientId: "lemonade", note: "Let the bells sprinkle above it." },
      { ingredientId: "cheese", note: "Fold in the creamy chord bed." },
      { ingredientId: "cupcake", note: "Finish with a charming whistle." },
      { ingredientId: "strawberry", note: "Top it off with a fruity melody." },
    ],
  },
];

/* ===== APP STATE ===== */
const state = {
  screen: "welcome", // welcome | guideSelect | game
  selectedGuide: null,
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
  selectedRecipeId: null,
  recipeStepIndex: 0,
  recommendedIngredientId: null,
};

/* ===== DOM ELEMENTS ===== */
const elements = {
  // Screens
  welcomeScreen: document.getElementById("welcomeScreen"),
  guideSelectScreen: document.getElementById("guideSelectScreen"),
  appShell: document.getElementById("appShell"),

  // Welcome
  toGuideSelectBtn: document.getElementById("toGuideSelectBtn"),

  // Guide selection
  guideCards: document.querySelectorAll(".guide-card"),
  startPicnicBtn: document.getElementById("startPicnicBtn"),

  // Game
  playPauseButton: document.getElementById("playPauseButton"),
  clearButton: document.getElementById("clearButton"),
  helpButton: null,
  volumeSlider: document.getElementById("volumeSlider"),
  activeLayerCount: document.getElementById("activeLayerCount"),
  beatLabel: document.getElementById("beatLabel"),
  recipeStrip: document.getElementById("recipeStrip"),
  recipeCards: document.getElementById("recipeCards"),
  selectedRecipeName: document.getElementById("selectedRecipeName"),
  recipeStepPrompt: document.getElementById("recipeStepPrompt"),
  recipeSteps: document.getElementById("recipeSteps"),
  recipeResetButton: document.getElementById("recipeResetButton"),
  guideSpeech: document.getElementById("guideSpeech"),
  guideArtMain: document.getElementById("guideArtMain"),
  guideTraveler: document.getElementById("guideTraveler"),
  guideTravelerArt: document.getElementById("guideTravelerArt"),
  meadowScene: document.querySelector(".meadow-scene"),
  recipeLab: document.querySelector(".recipe-lab"),
  ingredientButtons: Array.from(document.querySelectorAll(".ingredient")),
};

const ingredientById = new Map(ingredientDefinitions.map((d) => [d.id, d]));
const visualByIngredient = new Map();

/* ===== INITIALIZATION ===== */
cacheIngredientButtons();
renderRecipeCards();
bindEvents();

function bindEvents() {
  // Welcome screen
  elements.toGuideSelectBtn.addEventListener("click", showGuideSelection);

  // Guide selection
  for (const card of elements.guideCards) {
    card.addEventListener("click", () => selectGuide(card.dataset.guide));
  }
  elements.startPicnicBtn.addEventListener("click", startGame);

  // Game controls
  elements.playPauseButton.addEventListener("click", togglePlayback);
  elements.clearButton.addEventListener("click", clearMix);
  elements.volumeSlider.addEventListener("input", handleVolumeChange);
  elements.recipeResetButton.addEventListener("click", clearRecipeSelection);

  // Use event delegation for recipe cards (they are dynamically rendered)
  elements.recipeCards.addEventListener("click", (event) => {
    const card = event.target.closest("[data-recipe-id]");
    if (card) handleRecipeSelect(card.dataset.recipeId);
  });

  for (const button of elements.ingredientButtons) {
    button.addEventListener("click", () => toggleIngredient(button.dataset.ingredient));
  }
}

function cacheIngredientButtons() {
  for (const button of elements.ingredientButtons) {
    visualByIngredient.set(button.dataset.ingredient, button);
  }
}

/* ===== SCREEN TRANSITIONS ===== */
function showGuideSelection() {
  elements.welcomeScreen.classList.add("is-leaving");
  setTimeout(() => {
    elements.welcomeScreen.hidden = true;
    elements.welcomeScreen.classList.remove("is-leaving");
    elements.guideSelectScreen.hidden = false;
    elements.guideSelectScreen.classList.add("is-entering");
    setTimeout(() => elements.guideSelectScreen.classList.remove("is-entering"), 600);
  }, 500);
}

function selectGuide(guideId) {
  state.selectedGuide = guideId;

  for (const card of elements.guideCards) {
    const isSelected = card.dataset.guide === guideId;
    card.setAttribute("aria-checked", String(isSelected));
  }

  elements.startPicnicBtn.disabled = false;
}

async function startGame() {
  if (!state.selectedGuide) return;

  // Set up guide art in game
  const svg = guideSvgTemplates[state.selectedGuide];
  if (elements.guideArtMain) elements.guideArtMain.innerHTML = svg;
  if (elements.guideTravelerArt) elements.guideTravelerArt.innerHTML = svg;

  // Transition out guide select
  elements.guideSelectScreen.classList.add("is-leaving");

  setTimeout(async () => {
    elements.guideSelectScreen.hidden = true;
    elements.guideSelectScreen.classList.remove("is-leaving");
    elements.appShell.hidden = false;
    state.screen = "game";
    state.started = true;

    // Create audio
    if (!state.context) createAudioGraph();
    setControlsEnabled(true);
    updateInterface();

    await state.context.resume();
    startTransport();
  }, 500);
}

/* ===== AUDIO ENGINE ===== */
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
  elements.volumeSlider.disabled = !enabled;
  for (const button of elements.ingredientButtons) {
    button.disabled = !enabled;
  }
}

/* ===== TRANSPORT ===== */
function startTransport() {
  if (state.playing) return;
  state.playing = true;
  state.nextNoteTime = state.context.currentTime + 0.05;
  state.timerId = window.setInterval(schedulerTick, SCHEDULE_INTERVAL_MS);
  elements.playPauseButton.textContent = "Pause";
}

function stopTransport() {
  if (!state.playing) return;
  state.playing = false;
  if (state.timerId !== null) {
    window.clearInterval(state.timerId);
    state.timerId = null;
  }
  cancelVisualTimers();
  elements.playPauseButton.textContent = "Play";
}

function togglePlayback() {
  if (!state.started) return;
  if (state.playing) { stopTransport(); return; }
  state.context.resume().then(() => startTransport());
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

  for (const definition of ingredientDefinitions) {
    if (!state.activeLayers.has(definition.id)) continue;
    if (!definition.pattern.includes(stepIndex)) continue;
    definition.play(time, state.context, state.masterGain, stepIndex);
    queueIngredientVisual(definition.id, delayMs, getVisualDuration(definition.id));
  }
}

function queueIngredientVisual(id, delayMs, durationMs) {
  const timerId = window.setTimeout(() => {
    const button = visualByIngredient.get(id);
    if (!button) return;
    button.classList.add("is-playing");
    window.setTimeout(() => button.classList.remove("is-playing"), durationMs);
  }, delayMs);
  state.scheduledVisualTimers.push(timerId);
}

function getVisualDuration(id) {
  if (id === "cheese") return 520;
  if (id === "grape") return 240;
  return 300;
}

function cancelVisualTimers() {
  for (const t of state.scheduledVisualTimers) window.clearTimeout(t);
  state.scheduledVisualTimers = [];
  for (const button of elements.ingredientButtons) button.classList.remove("is-playing");
}

/* ===== INGREDIENT INTERACTION ===== */
function toggleIngredient(id) {
  if (!state.started) return;
  const button = visualByIngredient.get(id);
  if (!button) return;

  if (state.activeLayers.has(id)) {
    state.activeLayers.delete(id);
    button.classList.remove("is-selected");
    button.setAttribute("aria-pressed", "false");
  } else {
    state.activeLayers.add(id);
    button.classList.add("is-selected");
    button.setAttribute("aria-pressed", "true");
    button.classList.add("is-playing");
    window.setTimeout(() => button.classList.remove("is-playing"), 260);
    triggerIngredientPreview(id);
    advanceRecipeIfMatched(id);
  }

  state.clearMessageActive = false;
  updateInterface();
}

function triggerIngredientPreview(id) {
  if (!state.context || !state.masterGain) return;
  const definition = ingredientDefinitions.find((e) => e.id === id);
  if (!definition) return;
  definition.play(state.context.currentTime + 0.015, state.context, state.masterGain, state.currentStep);
}

/* ===== RECIPES ===== */
function handleRecipeSelect(recipeId) {
  // Clear all active sounds so user starts the recipe fresh
  state.activeLayers.clear();
  for (const button of elements.ingredientButtons) {
    button.classList.remove("is-selected", "is-playing");
    button.setAttribute("aria-pressed", "false");
  }
  cancelVisualTimers();

  state.selectedRecipeId = recipeId;
  state.recipeStepIndex = 0;
  state.clearMessageActive = false;
  updateInterface();
}

function clearRecipeSelection() {
  state.selectedRecipeId = null;
  state.recipeStepIndex = 0;
  updateInterface();
}

function getSelectedRecipe() {
  return recipeDefinitions.find((r) => r.id === state.selectedRecipeId) || null;
}

function getCurrentRecipeStep() {
  const recipe = getSelectedRecipe();
  if (!recipe) return null;
  return recipe.steps[state.recipeStepIndex] || null;
}

function advanceRecipeIfMatched(ingredientId) {
  const recipe = getSelectedRecipe();
  if (!recipe) return;
  const currentStep = recipe.steps[state.recipeStepIndex];
  if (!currentStep || currentStep.ingredientId !== ingredientId) return;
  window.setTimeout(() => {
    state.recipeStepIndex = Math.min(state.recipeStepIndex + 1, recipe.steps.length);
    updateInterface();
  }, 180);
}

function clearMix() {
  state.clearMessageActive = true;
  state.activeLayers.clear();
  state.recipeStepIndex = 0;
  for (const button of elements.ingredientButtons) {
    button.classList.remove("is-selected", "is-playing");
    button.setAttribute("aria-pressed", "false");
  }
  cancelVisualTimers();
  updateInterface();
}

function showHelpMessage() {
  if (!state.started) return;
  const guide = guideDefinitions[state.selectedGuide];
  const helpText = "Tap any picnic treat to turn its sound on or off. Play or pause anytime, clear the mix for a fresh basket, and use the volume slider to keep things gentle.";
  setGuideSpeech(helpText);
  if (state.helpTimerId !== null) window.clearTimeout(state.helpTimerId);
  state.helpTimerId = window.setTimeout(() => { state.helpTimerId = null; updateInterface(); }, 6000);
}

function handleVolumeChange(event) {
  const value = Number(event.currentTarget.value) / 100;
  state.volume = value;
  if (state.masterGain) {
    state.masterGain.gain.setTargetAtTime(value, state.context.currentTime, 0.02);
  }
}

/* ===== UI UPDATE ===== */
function updateInterface() {
  updateActiveLayerSummary();
  updateRecipeStrip();
  renderRecipeGuide();
  updateRecipeLabState();
  updateSceneMood();
  updateGuideMessage();
  updateGuidePosition();
  updateTransportLabel();
}

function updateTransportLabel() {
  if (!state.started || !state.playing) {
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
    if (!state.activeLayers.has(definition.id)) continue;
    const chip = document.createElement("span");
    chip.className = "recipe-chip";
    chip.textContent = definition.name;
    elements.recipeStrip.appendChild(chip);
  }
}

function renderRecipeCards() {
  elements.recipeCards.innerHTML = "";
  for (const recipe of recipeDefinitions) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "recipe-card";
    card.dataset.recipeId = recipe.id;
    card.setAttribute("aria-pressed", "false");
    card.innerHTML = `
      <span class="recipe-card__kicker">${recipe.mood}</span>
      <strong class="recipe-card__title">${recipe.name}</strong>
      <span class="recipe-card__copy">${recipe.description}</span>
      <span class="recipe-card__steps">${recipe.steps.length} steps</span>
    `;
    elements.recipeCards.appendChild(card);
  }
}

function renderRecipeGuide() {
  const recipe = getSelectedRecipe();
  const cards = Array.from(elements.recipeCards.querySelectorAll(".recipe-card"));

  for (const card of cards) {
    const isSelected = card.dataset.recipeId === state.selectedRecipeId;
    card.classList.toggle("is-selected", isSelected);
    card.setAttribute("aria-pressed", String(isSelected));
  }

  if (!recipe) {
    elements.selectedRecipeName.textContent = "Choose a recipe";
    elements.recipeStepPrompt.textContent = "Pick a recipe card above to begin.";
    elements.recipeSteps.innerHTML = "";
    elements.recipeResetButton.hidden = true;
    updateRecommendedIngredient(null);
    return;
  }

  const currentStep = getCurrentRecipeStep();
  const totalSteps = recipe.steps.length;

  elements.selectedRecipeName.textContent = recipe.name;
  elements.recipeResetButton.hidden = false;

  if (currentStep) {
    elements.recipeStepPrompt.textContent = `Step ${state.recipeStepIndex + 1} of ${totalSteps}: ${currentStep.note}`;
  } else {
    elements.recipeStepPrompt.textContent = `Recipe complete! You built ${recipe.name}. Add extra layers or try a new recipe.`;
  }

  elements.recipeSteps.innerHTML = "";
  recipe.steps.forEach((step, index) => {
    const item = document.createElement("li");
    item.className = "recipe-step";
    item.textContent = ingredientById.get(step.ingredientId)?.name || step.ingredientId;
    item.classList.toggle("is-complete", index < state.recipeStepIndex);
    item.classList.toggle("is-current", index === state.recipeStepIndex && Boolean(currentStep));
    elements.recipeSteps.appendChild(item);
  });

  updateRecommendedIngredient(currentStep?.ingredientId || null);
}

function updateRecipeLabState() {
  elements.recipeLab.classList.toggle("is-active", Boolean(getSelectedRecipe()));
}

function updateRecommendedIngredient(ingredientId) {
  state.recommendedIngredientId = ingredientId;
  for (const button of elements.ingredientButtons) {
    button.classList.toggle("is-recommended", button.dataset.ingredient === ingredientId);
  }
}

/* ===== GUIDE MESSAGES ===== */
function updateGuideMessage() {
  if (state.helpTimerId !== null) return;

  const guide = guideDefinitions[state.selectedGuide];
  if (!guide) return;

  const msgs = guide.messages;
  const recipe = getSelectedRecipe();
  const count = state.activeLayers.size;
  let message = msgs.welcome;

  if (state.started) {
    if (recipe) {
      const currentStep = getCurrentRecipeStep();
      if (currentStep) {
        const ingredientName = ingredientById.get(currentStep.ingredientId)?.name || currentStep.ingredientId;
        message = msgs.recipeStep(ingredientName, state.recipeStepIndex + 1, recipe.steps.length);
      } else {
        message = msgs.recipeDone(recipe.name);
      }
    } else if (count === 0 && state.clearMessageActive) {
      message = msgs.cleared;
      state.clearMessageActive = false;
    } else if (count === 0) {
      message = msgs.idle;
    } else if (count === 1) {
      message = msgs.firstAdd;
    } else if (count === 3) {
      message = msgs.threeActive;
    } else if (count >= 5) {
      message = msgs.fullMix;
    } else {
      message = msgs.firstAdd;
    }
  }

  setGuideSpeech(message);
}

function setGuideSpeech(message) {
  elements.guideSpeech.textContent = message;
}

/* ===== GUIDE POSITION ===== */
function updateGuidePosition() {
  const traveler = elements.guideTraveler;
  const meadow = elements.meadowScene;
  if (!traveler || !meadow) return;

  // Hide traveler when there's no active recommendation
  if (!state.recommendedIngredientId) {
    traveler.style.opacity = "0";
    traveler.style.pointerEvents = "none";
    elements.beatLabel.textContent = "Pick a recipe to get started";
    return;
  }

  traveler.style.opacity = "1";
  const meadowRect = meadow.getBoundingClientRect();
  if (meadowRect.width === 0 || meadowRect.height === 0) return;

  let x = 0.5;
  let y = 0.15;

  const button = visualByIngredient.get(state.recommendedIngredientId);
  if (button) {
    const buttonRect = button.getBoundingClientRect();
    x = ((buttonRect.left + buttonRect.width / 2) - meadowRect.left) / meadowRect.width;
    // Position fairy ABOVE the ingredient, not on top
    y = ((buttonRect.top - 50) - meadowRect.top) / meadowRect.height;
  }

  const clampedX = Math.min(0.85, Math.max(0.1, x));
  const clampedY = Math.min(0.65, Math.max(0.05, y));

  meadow.style.setProperty("--guide-x", `${clampedX * 100}%`);
  meadow.style.setProperty("--guide-y", `${clampedY * 100}%`);

  // Update beat label
  const recommended = ingredientById.get(state.recommendedIngredientId);
  if (recommended) {
    elements.beatLabel.textContent = `Your fairy points to ${recommended.name}`;
  }
}

/* ===== SCENE MOOD ===== */
function updateSceneMood() {
  const count = state.activeLayers.size;
  const scene = elements.meadowScene;
  if (!scene) return;
  scene.classList.remove("is-calm", "is-gentle", "is-bloom", "is-notes", "is-full");

  if (count === 0) scene.classList.add("is-calm");
  else if (count === 1) scene.classList.add("is-gentle");
  else if (count <= 3) scene.classList.add("is-bloom");
  else if (count === 4) scene.classList.add("is-notes");
  else scene.classList.add("is-full");
}

/* ===== SOUND SYNTHESIS ===== */
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
    [60, 64, 67], [57, 60, 64], [65, 69, 72], [55, 59, 62],
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

/* ===== UTILITIES ===== */
function createNoiseBuffer(context, lengthSeconds) {
  const sampleRate = context.sampleRate;
  const frameCount = Math.max(1, Math.floor(lengthSeconds * sampleRate));
  const buffer = context.createBuffer(1, frameCount, sampleRate);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = (Math.random() * 2 - 1) * (1 - i / frameCount);
  }
  return buffer;
}

function midiToFrequency(midi) {
  return 440 * (2 ** ((midi - 69) / 12));
}


/* ===== CURSOR SPARKLE TRAIL (拖尾效果) ===== */
(function initCursorTrail() {
  const TRAIL_COUNT = 12;
  const trail = [];

  for (let i = 0; i < TRAIL_COUNT; i++) {
    const dot = document.createElement("div");
    dot.className = "cursor-trail-dot";
    dot.style.cssText = `
      position: fixed;
      width: ${8 - i * 0.4}px;
      height: ${8 - i * 0.4}px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      opacity: ${1 - i * 0.07};
      background: radial-gradient(circle, rgba(125,188,106,${0.7 - i*0.04}), rgba(255,213,79,${0.5 - i*0.03}));
      box-shadow: 0 0 ${6 - i*0.3}px rgba(125,188,106,${0.4 - i*0.025});
      transition: transform ${50 + i * 30}ms ease;
      transform: translate(-50%, -50%) scale(0);
    `;
    document.body.appendChild(dot);
    trail.push({ el: dot, x: 0, y: 0 });
  }

  let mouseX = 0;
  let mouseY = 0;
  let isMoving = false;
  let hideTimer = null;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMoving = true;

    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      isMoving = false;
      for (const dot of trail) {
        dot.el.style.transform = `translate(-50%, -50%) scale(0)`;
      }
    }, 150);
  });

  function animate() {
    let prevX = mouseX;
    let prevY = mouseY;

    for (let i = 0; i < trail.length; i++) {
      const dot = trail[i];
      const speed = 0.35 - i * 0.015;
      dot.x += (prevX - dot.x) * speed;
      dot.y += (prevY - dot.y) * speed;

      if (isMoving) {
        dot.el.style.transform = `translate(${dot.x - 4}px, ${dot.y - 4}px) scale(1)`;
      }

      prevX = dot.x;
      prevY = dot.y;
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
