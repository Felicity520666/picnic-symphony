/**
 * state.js — Central application state with localStorage persistence.
 */

const STORAGE_KEY = 'picnic-symphony-state';

const SCREENS = Object.freeze({
  WELCOME: 'welcome',
  SPIRITS: 'spirits',
  TUTORIAL: 'tutorial',
  MODE_SELECT: 'mode-select',
  STUDIO: 'studio',
  RECIPES: 'recipes',
  POSTCARD: 'postcard',
});

const THEMES = Object.freeze({
  AUTO: 'auto',
  DAY: 'day',
  NIGHT: 'night',
});

const MODES = Object.freeze({
  FREE: 'free',
  RECIPE: 'recipe',
});

function createDefaultState() {
  return {
    // Navigation
    screen: SCREENS.WELCOME,
    previousScreen: null,

    // Preferences (persisted)
    lang: 'en',
    theme: THEMES.AUTO,
    spirit: null,
    tutorialCompleted: false,
    completedRecipes: [],
    savedMixes: [],

    // Session (not persisted)
    started: false,
    playing: false,
    mode: null,
    currentStep: 0,
    bpm: 110,
    volume: 0.7,
    ambienceVolume: 0.3,
    ambienceMuted: false,
    activeLayers: new Set(),
    selectedRecipeId: null,
    recipeStepIndex: 0,
    recommendedIngredientId: null,
    mixName: '',

    // Audio internals (not persisted)
    context: null,
    masterGain: null,
    ambienceGain: null,
    compressor: null,
    timerId: null,
    nextNoteTime: 0,
    scheduledVisualTimers: [],
  };
}

let state = createDefaultState();

/** Load persisted preferences from localStorage */
function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved.lang) state.lang = saved.lang;
    if (saved.theme) state.theme = saved.theme;
    if (saved.spirit) state.spirit = saved.spirit;
    if (typeof saved.tutorialCompleted === 'boolean') state.tutorialCompleted = saved.tutorialCompleted;
    if (Array.isArray(saved.completedRecipes)) state.completedRecipes = saved.completedRecipes;
    if (Array.isArray(saved.savedMixes)) state.savedMixes = saved.savedMixes;
    if (typeof saved.volume === 'number') state.volume = saved.volume;
    if (typeof saved.ambienceVolume === 'number') state.ambienceVolume = saved.ambienceVolume;
    if (typeof saved.ambienceMuted === 'boolean') state.ambienceMuted = saved.ambienceMuted;
    if (typeof saved.bpm === 'number') state.bpm = saved.bpm;
  } catch (e) {
    console.warn('Failed to load persisted state:', e);
  }
}

/** Save persistable preferences to localStorage */
function persistState() {
  try {
    const toSave = {
      lang: state.lang,
      theme: state.theme,
      spirit: state.spirit,
      tutorialCompleted: state.tutorialCompleted,
      completedRecipes: state.completedRecipes,
      savedMixes: state.savedMixes,
      volume: state.volume,
      ambienceVolume: state.ambienceVolume,
      ambienceMuted: state.ambienceMuted,
      bpm: state.bpm,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.warn('Failed to persist state:', e);
  }
}

/** Subscribe pattern for state changes */
const listeners = new Set();

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify(changeKey) {
  for (const fn of listeners) {
    try { fn(state, changeKey); } catch (e) { console.error(e); }
  }
}

/** Update state and notify */
function setState(updates, persist = false) {
  Object.assign(state, updates);
  if (persist) persistState();
  notify(Object.keys(updates)[0]);
}

export {
  state,
  SCREENS,
  THEMES,
  MODES,
  createDefaultState,
  loadPersistedState,
  persistState,
  subscribe,
  notify,
  setState,
};
