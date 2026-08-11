/**
 * main.js — Application entry point.
 * Wires all modules together: router, i18n, theme, audio, studio, recipes, particles.
 */

import { state, loadPersistedState, setState, SCREENS, MODES } from './state.js';
import { initRouter, navigateTo } from './router.js';
import { applyTranslations, setLanguage, t, detectLanguage, SUPPORTED_LANGS } from './i18n.js';
import { initTheme, setTheme, getEffectiveTheme } from './theme.js';
import { spiritDefinitions, getSpiritPlaceholder, guideSpiritLayer, initSpiritSelectionAnimations, preloadSpiritAssets } from './spirits.js';
import { ingredientDefinitions, ingredientById, MAX_LAYERS } from './ingredients.js';
import { recipeDefinitions, recipeById, isRecipeUnlocked } from './recipes.js';
import { assetUrl, renderFullComposition, renderIngredientComposition } from './composition.js';
import {
  createAudioGraph, resumeAudio, startTransport, stopTransport, toggleTransport,
  setMusicVolume, setAmbienceVolume, toggleAmbienceMute, updateAmbienceDucking,
  setTempo, previewIngredient, clearAllLayers, canAddLayer, onVisualHit,
  startAmbience, DEFAULT_BPM,
} from './audio.js';
import { initParticles } from './particles.js';

// ─── Bootstrap ───────────────────────────────────────────────────────────────

loadPersistedState();

// Detect language on first visit
if (!localStorage.getItem('picnic-symphony-state')) {
  state.lang = detectLanguage();
  state.bpm = DEFAULT_BPM;
}

initTheme();

document.addEventListener('DOMContentLoaded', () => {
  initRouter();
  guideSpiritLayer.init();
  document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : state.lang;
  applyTranslations();
  bindGlobalControls();
  bindWelcome();
  bindSpirits();
  initSpiritSelectionAnimations();
  bindModeSelect();
  bindStudio();
  bindRecipes();
  bindPostcard();
  initParticles();
});

// ─── Overlay Manager ─────────────────────────────────────────────────────────
// Centralized control: only one popover/dropdown can be open at a time.

const overlayManager = {
  _openId: null,
  _openerEl: null,
  _closers: new Map(), // id → close function

  register(id, closeFn) {
    this._closers.set(id, closeFn);
  },

  open(id, openerEl) {
    // Close any currently open overlay
    if (this._openId && this._openId !== id) {
      this.close();
    }
    this._openId = id;
    this._openerEl = openerEl || null;
    const fn = this._closers.get(id);
    if (fn) fn(true);
  },

  close() {
    if (!this._openId) return;
    const fn = this._closers.get(this._openId);
    if (fn) fn(false);
    // Restore focus
    if (this._openerEl && typeof this._openerEl.focus === 'function') {
      this._openerEl.focus();
    }
    this._openId = null;
    this._openerEl = null;
  },

  get isOpen() { return this._openId !== null; },
  get currentId() { return this._openId; },
};

// Global Escape key handler
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlayManager.isOpen) {
    e.preventDefault();
    overlayManager.close();
  }
});

// Click outside handler
document.addEventListener('pointerdown', (e) => {
  if (!overlayManager.isOpen) return;
  const langMenu = document.getElementById('lang-menu');
  const langTrigger = document.getElementById('lang-trigger');
  if (langMenu && !langMenu.contains(e.target) && !langTrigger.contains(e.target)) {
    overlayManager.close();
  }
});

// ─── Global Controls ─────────────────────────────────────────────────────────

function bindGlobalControls() {
  // Language dropdown
  bindLangDropdown();

  // Theme buttons
  document.querySelectorAll('[data-action="set-theme"]').forEach(btn => {
    btn.addEventListener('click', () => {
      overlayManager.close();
      setTheme(btn.dataset.theme);
      updateThemeButtons();
    });
  });
  updateThemeButtons();

  // Set initial lang display
  updateLangDisplay();
}

// ─── Language Dropdown ───────────────────────────────────────────────────────

function bindLangDropdown() {
  const trigger = document.getElementById('lang-trigger');
  const menu = document.getElementById('lang-menu');
  if (!trigger || !menu) return;

  let focusedIndex = -1;
  const items = [...menu.querySelectorAll('.lang-dropdown__item')];

  // Register with overlay manager
  overlayManager.register('lang', (shouldOpen) => {
    if (shouldOpen) {
      menu.hidden = false;
      // Force reflow then add class for animation
      void menu.offsetHeight;
      menu.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      // Focus current language
      focusedIndex = items.findIndex(el => el.dataset.lang === state.lang);
      if (focusedIndex >= 0) items[focusedIndex].classList.add('is-focused');
    } else {
      menu.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      items.forEach(el => el.classList.remove('is-focused'));
      // Hide after animation
      setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 200);
    }
  });

  // Toggle on click
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (overlayManager.currentId === 'lang') {
      overlayManager.close();
    } else {
      overlayManager.open('lang', trigger);
    }
  });

  // Item selection
  menu.addEventListener('click', (e) => {
    const item = e.target.closest('.lang-dropdown__item');
    if (!item) return;
    selectLanguage(item.dataset.lang);
  });

  // Keyboard navigation
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (overlayManager.currentId !== 'lang') {
        overlayManager.open('lang', trigger);
      }
    }
  });

  menu.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveFocus(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveFocus(-1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (focusedIndex >= 0) selectLanguage(items[focusedIndex].dataset.lang);
    }
  });

  function moveFocus(dir) {
    items.forEach(el => el.classList.remove('is-focused'));
    focusedIndex = (focusedIndex + dir + items.length) % items.length;
    items[focusedIndex].classList.add('is-focused');
    items[focusedIndex].scrollIntoView({ block: 'nearest' });
  }

  function selectLanguage(lang) {
    setLanguage(lang);
    updateLangDisplay();
    updateLangMenuSelection();
    overlayManager.close();
    // Re-render dynamic content
    renderRecipeGrid();
    updateStudioUI();
  }
}

function updateLangDisplay() {
  const codeEl = document.getElementById('lang-code');
  const codes = { en: 'EN', zh: '中文', fr: 'FR', es: 'ES', de: 'DE', ja: '日本', hi: 'हिं', ar: 'عر', ko: '한' };
  if (codeEl) codeEl.textContent = codes[state.lang] || 'EN';
}

function updateLangMenuSelection() {
  const menu = document.getElementById('lang-menu');
  if (!menu) return;
  menu.querySelectorAll('.lang-dropdown__item').forEach(item => {
    item.setAttribute('aria-selected', String(item.dataset.lang === state.lang));
  });
}

function updateThemeButtons() {
  document.querySelectorAll('[data-action="set-theme"]').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.theme === state.theme);
  });
}

// ─── Welcome ─────────────────────────────────────────────────────────────────

function bindWelcome() {
  document.querySelector('[data-action="enter-meadow"]')?.addEventListener('click', async () => {
    await resumeAudio();
    startAmbience();
    navigateTo(SCREENS.SPIRITS);
  });
}

// ─── Spirit Selection ────────────────────────────────────────────────────────

function bindSpirits() {
  const grid = document.querySelector('.spirit-grid');
  const continueBtn = document.querySelector('[data-action="spirit-continue"]');

  grid?.addEventListener('click', (e) => {
    const card = e.target.closest('[data-spirit]');
    if (!card) return;
    selectSpirit(card.dataset.spirit);
  });

  continueBtn?.addEventListener('click', () => {
    if (!state.spirit) return;
    navigateTo(SCREENS.MODE_SELECT);
  });

  document.querySelector('[data-action="spirit-back"]')?.addEventListener('click', () => {
    navigateTo(SCREENS.WELCOME);
  });
}

function selectSpirit(id) {
  setState({ spirit: id }, true);
  preloadSpiritAssets(id);
  document.querySelectorAll('[data-spirit]').forEach(card => {
    card.classList.toggle('is-selected', card.dataset.spirit === id);
    card.setAttribute('aria-checked', String(card.dataset.spirit === id));
  });
  const btn = document.querySelector('[data-action="spirit-continue"]');
  if (btn) btn.disabled = false;
}

// ─── Mode Selection ──────────────────────────────────────────────────────────

function bindModeSelect() {
  document.querySelectorAll('[data-action="select-mode"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      setState({ mode });
      if (mode === MODES.RECIPE) {
        navigateTo(SCREENS.RECIPES);
      } else {
        navigateTo(SCREENS.STUDIO);
        enterStudio();
      }
    });
  });

  document.querySelector('[data-action="mode-back"]')?.addEventListener('click', () => {
    navigateTo(SCREENS.SPIRITS);
  });
}

// ─── Studio ──────────────────────────────────────────────────────────────────

function bindStudio() {
  const container = document.querySelector('[data-screen="studio"]');
  if (!container) return;

  container.querySelector('[data-action="play-pause"]')?.addEventListener('click', () => {
    if (!state.context) createAudioGraph();
    toggleTransport();
    updateTransportUI();
  });

  container.querySelector('[data-action="clear-mix"]')?.addEventListener('click', () => {
    clearAllLayers();
    document.querySelectorAll('.ingredient-btn').forEach(btn => {
      btn.classList.remove('is-active');
      btn.setAttribute('aria-pressed', 'false');
    });
    hideLayerMessage();
    updateStudioUI();
  });

  container.querySelector('[data-action="surprise"]')?.addEventListener('click', surpriseBasket);

  container.querySelector('[data-action="music-volume"]')?.addEventListener('input', (e) => {
    setMusicVolume(Number(e.target.value) / 100);
  });
  container.querySelector('[data-action="ambience-volume"]')?.addEventListener('input', (e) => {
    setAmbienceVolume(Number(e.target.value) / 100);
  });
  container.querySelector('[data-action="tempo"]')?.addEventListener('input', (e) => {
    setTempo(Number(e.target.value));
    updateTempoDisplay();
  });

  // Ingredient grid with 6-layer enforcement
  container.querySelector('.ingredient-grid')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.ingredient-btn');
    if (!btn) return;
    toggleIngredient(btn.dataset.ingredient);
  });

  container.querySelector('[data-action="finish"]')?.addEventListener('click', () => {
    // If recipe mode, validate ingredients match before using recipe name
    if (state.selectedRecipeId && !ingredientsExactlyMatchRecipe()) {
      showRecipeMismatchFeedback();
      return;
    }
    navigateTo(SCREENS.POSTCARD);
    setTimeout(() => renderPostcardPreview(), 200);
  });
  container.querySelector('[data-action="recipe-book"]')?.addEventListener('click', () => navigateTo(SCREENS.RECIPES));

  // Visual hit feedback
  onVisualHit((id) => {
    const btn = container.querySelector(`[data-ingredient="${id}"]`);
    if (!btn) return;
    btn.classList.add('is-playing');
    setTimeout(() => btn.classList.remove('is-playing'), 200);
  });
}

function enterStudio() {
  if (!state.context) createAudioGraph();

  // Render spirit portrait in sidebar
  const artEl = document.getElementById('studio-spirit-art');
  if (artEl && state.spirit) {
    const spirit = spiritDefinitions[state.spirit];
    if (spirit) {
      const img = document.createElement('img');
      img.src = spirit.image;
      img.alt = t(spirit.nameKey);
      img.className = 'spirit-panel__img';
      img.onerror = () => {
        img.src = getSpiritPlaceholder(state.spirit);
        img.onerror = null;
      };
      artEl.innerHTML = '';
      artEl.appendChild(img);
    }
  }

  resumeAudio().then(() => {
    if (!state.playing) startTransport();
    updateStudioUI();
  }).catch(() => {
    // Audio context may fail on some browsers — still update UI
    updateStudioUI();
  });
}

function toggleIngredient(id) {
  const btn = document.querySelector(`[data-ingredient="${id}"]`);
  if (!btn) return;

  // Ensure audio context is ready (user gesture)
  if (!state.context) createAudioGraph();
  if (state.context && state.context.state === 'suspended') {
    state.context.resume();
  }

  if (state.activeLayers.has(id)) {
    // Remove
    state.activeLayers.delete(id);
    btn.classList.remove('is-active');
    btn.setAttribute('aria-pressed', 'false');
    hideLayerMessage();
  } else {
    // Add — check 6-layer limit
    if (!canAddLayer()) {
      showLayerMessage();
      return;
    }
    state.activeLayers.add(id);
    btn.classList.add('is-active');
    btn.setAttribute('aria-pressed', 'true');
    previewIngredient(id);
    // Advance recipe if matched
    if (state.selectedRecipeId && state.recommendedIngredientId === id) {
      advanceRecipeStep();
    }
  }

  updateAmbienceDucking();
  updateStudioUI();
}

function showLayerMessage() {
  const el = document.querySelector('[data-display="layer-message"]');
  if (el) { el.textContent = t('studio.layerFull'); el.hidden = false; }
}

function hideLayerMessage() {
  const el = document.querySelector('[data-display="layer-message"]');
  if (el) el.hidden = true;
}

function advanceRecipeStep() {
  const recipe = recipeById.get(state.selectedRecipeId);
  if (!recipe) return;
  state.recipeStepIndex++;
  if (state.recipeStepIndex >= recipe.steps.length) {
    if (!state.completedRecipes.includes(state.selectedRecipeId)) {
      state.completedRecipes.push(state.selectedRecipeId);
      setState({ completedRecipes: state.completedRecipes }, true);
    }
  }
}

function surpriseBasket() {
  if (!state.context) createAudioGraph();
  if (state.context && state.context.state === 'suspended') state.context.resume();
  clearAllLayers();
  // Surprise cancels any active recipe
  setState({ selectedRecipeId: null, recipeStepIndex: 0, mode: MODES.FREE });
  const shuffled = [...ingredientDefinitions].sort(() => Math.random() - 0.5);
  const count = 3 + Math.floor(Math.random() * 3); // 3–5
  for (let i = 0; i < Math.min(count, MAX_LAYERS); i++) {
    state.activeLayers.add(shuffled[i].id);
  }
  document.querySelectorAll('.ingredient-btn').forEach(btn => {
    const active = state.activeLayers.has(btn.dataset.ingredient);
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
  updateAmbienceDucking();
  updateStudioUI();
  if (!state.playing) {
    resumeAudio().then(() => startTransport());
  }
}

function updateTransportUI() {
  const btn = document.querySelector('[data-action="play-pause"]');
  if (btn) btn.textContent = state.playing ? t('studio.pause') : t('studio.play');
}

function updateTempoDisplay() {
  const el = document.querySelector('[data-display="tempo"]');
  if (el) el.textContent = `${state.bpm}`;
}

function updateStudioUI() {
  const countEl = document.querySelector('[data-display="layer-count"]');
  if (countEl) countEl.textContent = t('studio.layerCount', { n: state.activeLayers.size });

  // Recipe step indicator
  const beatEl = document.querySelector('[data-display="beat-label"]');
  if (beatEl) {
    if (state.selectedRecipeId) {
      const recipe = recipeById.get(state.selectedRecipeId);
      if (recipe && state.recipeStepIndex < recipe.steps.length) {
        const step = recipe.steps[state.recipeStepIndex];
        const name = t(ingredientById.get(step.ingredientId)?.nameKey || step.ingredientId);
        beatEl.textContent = `${state.recipeStepIndex + 1}/${recipe.steps.length}: ${name}`;
        highlightRecommended(step.ingredientId);
      } else {
        beatEl.textContent = t('recipes.complete');
        highlightRecommended(null);
      }
    } else {
      beatEl.textContent = t('studio.pickRecipe');
      highlightRecommended(null);
    }
  }

  updateTransportUI();
  updateTempoDisplay();
  updateSpiritMessage();
}

function highlightRecommended(id) {
  document.querySelectorAll('.ingredient-btn').forEach(btn => {
    btn.classList.toggle('is-recommended', btn.dataset.ingredient === id);
  });
  state.recommendedIngredientId = id;
}

function updateSpiritMessage() {
  const el = document.querySelector('[data-display="spirit-speech"]');
  if (!el || !state.spirit) return;
  const spirit = spiritDefinitions[state.spirit];
  if (!spirit) return;

  const count = state.activeLayers.size;
  let msgKey;
  let vars = {};

  if (state.selectedRecipeId) {
    const recipe = recipeById.get(state.selectedRecipeId);
    if (recipe && state.recipeStepIndex < recipe.steps.length) {
      const step = recipe.steps[state.recipeStepIndex];
      msgKey = spirit.messages.recipeStep;
      vars = { name: t(ingredientById.get(step.ingredientId)?.nameKey || '') };
    } else if (recipe) {
      msgKey = spirit.messages.recipeDone;
    } else {
      msgKey = spirit.messages.idle;
    }
  } else {
    if (count === 0) msgKey = spirit.messages.idle;
    else if (count === 1) msgKey = spirit.messages.firstAdd;
    else if (count >= 3 && count < MAX_LAYERS) msgKey = spirit.messages.threeActive;
    else if (count >= MAX_LAYERS) msgKey = spirit.messages.fullMix;
    else msgKey = spirit.messages.firstAdd;
  }

  el.textContent = t(msgKey, vars);
}

// ─── Recipes ─────────────────────────────────────────────────────────────────

function bindRecipes() {
  const container = document.querySelector('[data-screen="recipes"]');
  if (!container) return;

  renderRecipeGrid();

  container.querySelector('[data-action="back-to-studio"]')?.addEventListener('click', () => {
    navigateTo(SCREENS.STUDIO);
    enterStudio();
  });

  container.querySelector('.recipe-grid')?.addEventListener('click', (e) => {
    const card = e.target.closest('[data-recipe]');
    if (!card) return;
    startRecipe(card.dataset.recipe);
  });
}

function renderRecipeGrid() {
  const grid = document.querySelector('.recipe-grid');
  if (!grid) return;
  grid.innerHTML = '';
  for (const recipe of recipeDefinitions) {
    const card = document.createElement('div');
    card.className = 'recipe-grid-card';
    card.dataset.recipe = recipe.id;
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    const imgSrc = assetUrl(`recipes/${recipe.id}.png`);
    card.innerHTML = `
      <img class="recipe-grid-card__img" src="${imgSrc}" alt="${t(recipe.nameKey)}">
      <div class="recipe-grid-card__body">
        <span class="recipe-grid-card__mood">${t(recipe.moodKey)}</span>
        <strong class="recipe-grid-card__name">${t(recipe.nameKey)}</strong>
        <span class="recipe-grid-card__desc">${t(recipe.descKey)}</span>
        <span class="recipe-grid-card__meta">${t('recipes.steps', { n: recipe.ingredients.length })}</span>
      </div>
    `;
    // Error logging for dev
    const img = card.querySelector('img');
    img.addEventListener('error', () => console.error('Missing Picnic Symphony asset:', img.src));
    grid.appendChild(card);
  }
}

function startRecipe(recipeId) {
  const recipe = recipeById.get(recipeId);
  if (!recipe) return;

  clearAllLayers();
  document.querySelectorAll('.ingredient-btn').forEach(btn => {
    btn.classList.remove('is-active');
    btn.setAttribute('aria-pressed', 'false');
  });

  setState({ selectedRecipeId: recipeId, recipeStepIndex: 0, mode: MODES.RECIPE });
  if (recipe.tempo) setTempo(recipe.tempo);

  navigateTo(SCREENS.STUDIO);
  enterStudio();
}

// ─── Postcard ────────────────────────────────────────────────────────────────

function bindPostcard() {
  document.querySelector('[data-action="download-postcard"]')?.addEventListener('click', handleDownload);
  document.querySelector('[data-action="new-picnic"]')?.addEventListener('click', () => {
    clearAllLayers();
    setState({ selectedRecipeId: null, recipeStepIndex: 0 });
    navigateTo(SCREENS.WELCOME);
  });
  document.querySelector('[data-action="back-to-studio-from-postcard"]')?.addEventListener('click', () => {
    navigateTo(SCREENS.STUDIO);
  });
}

// ─── Recipe match helper ─────────────────────────────────────────────────────

function ingredientsExactlyMatchRecipe() {
  if (!state.selectedRecipeId) return false;
  const recipe = recipeById.get(state.selectedRecipeId);
  if (!recipe) return false;
  const active = [...state.activeLayers].sort();
  const required = [...recipe.ingredients].sort();
  return active.length === required.length && active.every((id, i) => id === required[i]);
}

/** Show feedback when recipe ingredients don't match */
function showRecipeMismatchFeedback() {
  const recipe = recipeById.get(state.selectedRecipeId);
  if (!recipe) return;

  const active = new Set(state.activeLayers);
  const required = new Set(recipe.ingredients);

  // Find missing ingredients (in recipe but not active)
  const missing = [...required].filter(id => !active.has(id));
  // Find extra ingredients (active but not in recipe)
  const extra = [...active].filter(id => !required.has(id));

  // Highlight missing ingredients with soft red shake
  missing.forEach(id => {
    const btn = document.querySelector(`[data-ingredient="${id}"]`);
    if (btn) {
      btn.classList.add('is-recipe-missing');
      setTimeout(() => btn.classList.remove('is-recipe-missing'), 2000);
    }
  });

  // Highlight extra ingredients with soft amber
  extra.forEach(id => {
    const btn = document.querySelector(`[data-ingredient="${id}"]`);
    if (btn) {
      btn.classList.add('is-recipe-extra');
      setTimeout(() => btn.classList.remove('is-recipe-extra'), 2000);
    }
  });

  // Show spirit speech bubble
  const speechEl = document.querySelector('[data-display="spirit-speech"]');
  if (speechEl) {
    const missingNames = missing.map(id => t(ingredientById.get(id)?.nameKey || id)).join(', ');
    let msg = t('recipe.mismatch.message');
    if (missing.length > 0) {
      msg += ' ' + t('recipe.mismatch.missing', { names: missingNames });
    }
    speechEl.textContent = msg;
    speechEl.closest('.spirit-speech')?.classList.add('is-warning');
    setTimeout(() => {
      speechEl.closest('.spirit-speech')?.classList.remove('is-warning');
      updateSpiritMessage();
    }, 4000);
  }

  // User can still finish as free composition — offer that option
  // Show a brief message that they can tap Finish again to save as original
  const msgEl = document.querySelector('[data-display="layer-message"]');
  if (msgEl) {
    msgEl.textContent = t('recipe.mismatch.hint');
    msgEl.hidden = false;
    setTimeout(() => { msgEl.hidden = true; }, 4000);
  }

  // Clear selectedRecipeId so next Finish attempt treats it as free composition
  setState({ selectedRecipeId: null, mode: MODES.FREE });
}

/** Generate a creative name based on ingredient combination */
function generateCreativeName(ingredientIds) {
  if (!ingredientIds.length) return t('postcard.namePlaceholder');
  // Use the first ingredient as the base flavor
  const firstIngr = ingredientById.get(ingredientIds[0]);
  const firstName = firstIngr ? t(firstIngr.nameKey) : '';
  const count = ingredientIds.length;
  if (count === 1) return t('creative.solo', { name: firstName });
  if (count === 2) return t('creative.duo', { name: firstName });
  if (count <= 4) return t('creative.blend', { name: firstName });
  return t('creative.feast', { name: firstName });
}

/** Render preview when entering the postcard screen */
async function renderPostcardPreview() {
  const canvas = document.getElementById('postcard-canvas');
  if (!canvas) return;
  const active = [...state.activeLayers];
  if (!active.length) return;

  // Determine title: use recipe name ONLY if ingredients still exactly match
  const recipeMatches = ingredientsExactlyMatchRecipe();
  const nameSection = document.getElementById('postcard-name-section');

  let title;
  if (recipeMatches) {
    if (nameSection) nameSection.style.display = 'none';
    title = t(recipeById.get(state.selectedRecipeId)?.nameKey || '');
  } else {
    if (nameSection) nameSection.style.display = '';
    title = document.querySelector('.postcard-name-input')?.value || t('postcard.namePlaceholder');
  }

  const spiritName = state.spirit ? t(spiritDefinitions[state.spirit].nameKey) : '';

  canvas.width = 1600; canvas.height = 1200;
  await renderFullComposition(canvas, active, {
    isNight: getEffectiveTheme() === 'night',
    title,
    spiritName,
    ingredientNames: active.map(id => t(ingredientById.get(id)?.nameKey || id)).join(' · '),
  });
}

async function handleDownload() {
  const active = [...state.activeLayers];
  if (!active.length) return;

  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = 1600;
  exportCanvas.height = 1200;

  const recipeMatches = ingredientsExactlyMatchRecipe();
  let title;
  if (recipeMatches) {
    title = t(recipeById.get(state.selectedRecipeId)?.nameKey || '');
  } else {
    title = document.querySelector('.postcard-name-input')?.value || t('postcard.namePlaceholder');
  }
  const spiritName = state.spirit ? t(spiritDefinitions[state.spirit].nameKey) : '';

  await renderFullComposition(exportCanvas, active, {
    isNight: getEffectiveTheme() === 'night',
    title,
    spiritName,
    ingredientNames: active.map(id => t(ingredientById.get(id)?.nameKey || id)).join(' · '),
  });

  exportCanvas.toBlob(blob => {
    if (!blob) { console.error('Failed to create Picnic Symphony PNG.'); return; }
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `picnic-symphony-${new Date().toISOString().slice(0, 10)}.png`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, 'image/png');
}
