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
      idle: "Tap any treat to get the buzz started!",
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
      idle: "The meadow is listening. Choose a recipe and add the first treat!",
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
      idle: "Tap a treat and let's see what sound it makes!",
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
  bee: `<svg viewBox="0 0 200 200">
    <defs>
      <linearGradient id="gbBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffd54f"/><stop offset="100%" stop-color="#f9a825"/></linearGradient>
      <linearGradient id="gbWing" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fff" stop-opacity="0.9"/><stop offset="100%" stop-color="#e3f2fd" stop-opacity="0.5"/></linearGradient>
    </defs>
    <ellipse cx="100" cy="172" rx="40" ry="10" fill="#c8dfbe" opacity="0.3"/>
    <ellipse cx="78" cy="82" rx="26" ry="36" fill="url(#gbWing)" stroke="#90caf9" stroke-width="2" transform="rotate(-20 78 82)"/>
    <ellipse cx="122" cy="82" rx="26" ry="36" fill="url(#gbWing)" stroke="#90caf9" stroke-width="2" transform="rotate(20 122 82)"/>
    <ellipse cx="100" cy="115" rx="28" ry="38" fill="url(#gbBody)" stroke="#e65100" stroke-width="3"/>
    <path d="M74 105h52" stroke="#4e342e" stroke-width="5" stroke-linecap="round"/>
    <path d="M76 118h48" stroke="#4e342e" stroke-width="5" stroke-linecap="round"/>
    <path d="M78 131h44" stroke="#4e342e" stroke-width="5" stroke-linecap="round"/>
    <circle cx="100" cy="88" r="20" fill="#fff8e1" stroke="#f9a825" stroke-width="3"/>
    <circle cx="93" cy="85" r="4" fill="#3e2723"/><circle cx="107" cy="85" r="4" fill="#3e2723"/>
    <circle cx="92" cy="83" r="1.5" fill="#fff"/><circle cx="106" cy="83" r="1.5" fill="#fff"/>
    <path d="M95 94c3 3 7 3 10 0" fill="none" stroke="#5d4037" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M93 70c-4-10-8-16-12-18" fill="none" stroke="#5d4037" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="81" cy="52" r="4" fill="#ffd54f" stroke="#5d4037" stroke-width="2"/>
    <path d="M107 70c4-10 8-16 12-18" fill="none" stroke="#5d4037" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="119" cy="52" r="4" fill="#ffd54f" stroke="#5d4037" stroke-width="2"/>
  </svg>`,

  butterfly: `<svg viewBox="0 0 200 200">
    <defs>
      <linearGradient id="gbfWL" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fff8cf"/><stop offset="45%" stop-color="#f5c1ee"/><stop offset="100%" stop-color="#82d7e6"/></linearGradient>
      <linearGradient id="gbfWR" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fdf2ff"/><stop offset="55%" stop-color="#8fd8ec"/><stop offset="100%" stop-color="#6abf88"/></linearGradient>
    </defs>
    <ellipse cx="100" cy="172" rx="40" ry="10" fill="#c8dfbe" opacity="0.3"/>
    <path d="M98 100c-14-32-44-52-70-47-10 25-1 55 25 74 17 12 37 15 50 6 8-5 8-18-5-33Z" fill="url(#gbfWL)" stroke="#6e6d8a" stroke-width="3" stroke-linejoin="round"/>
    <path d="M102 100c14-32 44-52 70-47 10 25 1 55-25 74-17 12-37 15-50 6-8-5-8-18 5-33Z" fill="url(#gbfWR)" stroke="#6e6d8a" stroke-width="3" stroke-linejoin="round"/>
    <path d="M90 112c-20-15-39-16-52-7 6 16 18 28 33 32 13 2 26-3 29-15 1-4-1-6-10-10Z" fill="#fff" fill-opacity="0.35"/>
    <path d="M110 112c20-15 39-16 52-7-6 16-18 28-33 32-13 2-26-3-29-15-1-4 1-6 10-10Z" fill="#fff" fill-opacity="0.35"/>
    <path d="M96 82c-6-18-20-32-36-37 0 14 7 27 18 36" fill="none" stroke="#b7de83" stroke-width="5" stroke-linecap="round"/>
    <path d="M104 82c6-18 20-32 36-37 0 14-7 27-18 36" fill="none" stroke="#b7de83" stroke-width="5" stroke-linecap="round"/>
    <path d="M100 108v38" fill="none" stroke="#6a4f53" stroke-width="6" stroke-linecap="round"/>
    <circle cx="96" cy="104" r="5" fill="#3d2a25"/><circle cx="104" cy="104" r="5" fill="#3d2a25"/>
    <circle cx="95" cy="102" r="1.8" fill="#fff8f2"/><circle cx="103" cy="102" r="1.8" fill="#fff8f2"/>
    <path d="M97 112c3 3 6 3 9 0" fill="none" stroke="#d86b87" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,

  dragonfly: `<svg viewBox="0 0 200 200">
    <defs>
      <linearGradient id="gdfB" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4dd0e1"/><stop offset="100%" stop-color="#00897b"/></linearGradient>
      <linearGradient id="gdfW" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e0f7fa" stop-opacity="0.9"/><stop offset="100%" stop-color="#b2ebf2" stop-opacity="0.4"/></linearGradient>
    </defs>
    <ellipse cx="100" cy="178" rx="30" ry="8" fill="#c8dfbe" opacity="0.3"/>
    <ellipse cx="66" cy="78" rx="32" ry="16" fill="url(#gdfW)" stroke="#4dd0e1" stroke-width="2" transform="rotate(-25 66 78)"/>
    <ellipse cx="134" cy="78" rx="32" ry="16" fill="url(#gdfW)" stroke="#4dd0e1" stroke-width="2" transform="rotate(25 134 78)"/>
    <ellipse cx="70" cy="100" rx="28" ry="12" fill="url(#gdfW)" stroke="#4dd0e1" stroke-width="1.5" transform="rotate(-15 70 100)"/>
    <ellipse cx="130" cy="100" rx="28" ry="12" fill="url(#gdfW)" stroke="#4dd0e1" stroke-width="1.5" transform="rotate(15 130 100)"/>
    <path d="M100 95v70" stroke="url(#gdfB)" stroke-width="6" stroke-linecap="round"/>
    <circle cx="100" cy="110" r="4" fill="#26a69a" stroke="#00695c" stroke-width="1.5"/>
    <circle cx="100" cy="125" r="3.5" fill="#26a69a" stroke="#00695c" stroke-width="1.5"/>
    <circle cx="100" cy="139" r="3" fill="#26a69a" stroke="#00695c" stroke-width="1.5"/>
    <circle cx="100" cy="152" r="2.5" fill="#26a69a" stroke="#00695c" stroke-width="1.5"/>
    <circle cx="100" cy="80" r="16" fill="#e0f7fa" stroke="#00897b" stroke-width="3"/>
    <circle cx="92" cy="77" r="7" fill="#00695c"/><circle cx="108" cy="77" r="7" fill="#00695c"/>
    <circle cx="90" cy="75" r="2.5" fill="#e0f7fa"/><circle cx="106" cy="75" r="2.5" fill="#e0f7fa"/>
    <path d="M95 89c3 2 7 2 10 0" fill="none" stroke="#00695c" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  bird: `<svg viewBox="0 0 200 200">
    <defs>
      <linearGradient id="gbiB" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffcc80"/><stop offset="100%" stop-color="#ff8a65"/></linearGradient>
      <linearGradient id="gbiBe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff8e1"/><stop offset="100%" stop-color="#ffecb3"/></linearGradient>
    </defs>
    <ellipse cx="100" cy="172" rx="30" ry="8" fill="#c8dfbe" opacity="0.3"/>
    <path d="M120 140c10 8 18 18 22 28" fill="none" stroke="#ff8a65" stroke-width="4" stroke-linecap="round"/>
    <path d="M115 138c12 6 22 14 30 24" fill="none" stroke="#ffab91" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="100" cy="120" rx="34" ry="38" fill="url(#gbiB)" stroke="#e65100" stroke-width="3"/>
    <ellipse cx="100" cy="130" rx="22" ry="24" fill="url(#gbiBe)" stroke="#ffcc80" stroke-width="1.5"/>
    <path d="M68 110c-12-4-22 2-26 14 8 10 18 14 28 12 8-2 14-8 14-16 0-4-4-7-16-10Z" fill="#ffe0b2" stroke="#e65100" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="100" cy="74" r="22" fill="url(#gbiB)" stroke="#e65100" stroke-width="3"/>
    <circle cx="86" cy="80" r="6" fill="#ffab91" opacity="0.5"/><circle cx="114" cy="80" r="6" fill="#ffab91" opacity="0.5"/>
    <circle cx="92" cy="72" r="5" fill="#3e2723"/><circle cx="108" cy="72" r="5" fill="#3e2723"/>
    <circle cx="91" cy="70" r="2" fill="#fff"/><circle cx="107" cy="70" r="2" fill="#fff"/>
    <path d="M96 82l4 8 4-8Z" fill="#ff6f00" stroke="#e65100" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M96 54c-2-8 0-14 4-18 4 4 6 10 4 18" fill="#ff8a65" stroke="#e65100" stroke-width="2" stroke-linejoin="round"/>
    <path d="M90 156c-2 6-4 10-8 12" fill="none" stroke="#bf360c" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M110 156c2 6 4 10 8 12" fill="none" stroke="#bf360c" stroke-width="2.5" stroke-linecap="round"/>
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
  helpButton: document.getElementById("helpButton"),
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
  elements.helpButton.addEventListener("click", showHelpMessage);
  elements.volumeSlider.addEventListener("input", handleVolumeChange);
  elements.recipeResetButton.addEventListener("click", clearRecipeSelection);

  for (const card of Array.from(elements.recipeCards.querySelectorAll("[data-recipe-id]"))) {
    card.addEventListener("click", () => handleRecipeSelect(card.dataset.recipeId));
  }

  for (const button of elements.ingredientButtons) {
    button.addEventListener("click", () => toggleIngredient(button.dataset.ingredient));
  }
}

function cacheIngredientButtons() {
  for (const button of elements.ingredientButtons) {
    visualByIngredient.set(button.dataset.ingredient, button);
  }
}
