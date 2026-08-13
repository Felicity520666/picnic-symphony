/**
 * main.js — Application entry point.
 * Wires all modules together: router, i18n, theme, audio, studio, recipes, particles.
 */

import { state, loadPersistedState, setState, subscribe, SCREENS, MODES } from './state.js';
import { initRouter, navigateTo } from './router.js';
import { applyTranslations, setLanguage, t, detectLanguage, SUPPORTED_LANGS } from './i18n.js';
import { initTheme, setTheme, getEffectiveTheme } from './theme.js';
import { spiritDefinitions, getSpiritPlaceholder, guideSpiritLayer, initSpiritSelectionAnimations, preloadSpiritAssets, preloadAllSpiritsSelection, getSpiritAsset } from './spirits.js';
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

  // Home button
  const homeBtn = document.getElementById('home-btn');
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      overlayManager.close();
      // Stop audio cleanly so music doesn't continue on welcome screen
      if (state.playing) stopTransport();
      navigateTo(SCREENS.WELCOME);
    });
  }
  // Show/hide Home based on screen
  subscribe((s, key) => {
    if (key === 'screen' && homeBtn) {
      homeBtn.hidden = s.screen === SCREENS.WELCOME;
    }
  });
  // Initial state
  if (homeBtn) homeBtn.hidden = state.screen === SCREENS.WELCOME;

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

  // Preload idle + flutter for all four spirits on selection screen
  preloadAllSpiritsSelection();

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
  hideLayerMessage();

  // Render spirit portrait in sidebar — use state-aware asset
  const artEl = document.getElementById('studio-spirit-art');
  if (artEl && state.spirit) {
    const spirit = spiritDefinitions[state.spirit];
    if (spirit) {
      // Use guide asset if recipe is active, otherwise idle
      const visualState = state.selectedRecipeId ? 'guide' : 'idle';
      const imgSrc = getSpiritAsset(state.spirit, visualState, 'right');
      const img = document.createElement('img');
      img.src = imgSrc;
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

  // Brief flutter celebration on correct ingredient
  const artEl = document.getElementById('studio-spirit-art');
  if (artEl && state.spirit) {
    const flutterSrc = getSpiritAsset(state.spirit, 'flutter', 'right');
    const img = artEl.querySelector('img');
    if (img) {
      img.src = flutterSrc;
      setTimeout(() => {
        const nextState = state.recipeStepIndex < recipe.steps.length ? 'guide' : 'idle';
        img.src = getSpiritAsset(state.spirit, nextState, 'right');
      }, 600);
    }
  }

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
  // Hide layer-full message if we're below the limit
  if (state.activeLayers.size < 6) hideLayerMessage();

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
      // Free mode — show contextual message based on ingredient count
      if (state.activeLayers.size === 0) {
        beatEl.textContent = t('studio.pickRecipe');
      } else {
        beatEl.textContent = t('studio.keepBuilding');
      }
      highlightRecommended(null);
    }
  }

  updateTransportUI();
  updateTempoDisplay();
  updateSpiritMessage();
}

function highlightRecommended(id) {
  document.querySelectorAll('.ingredient-btn').forEach(btn => {
    const isNext = btn.dataset.ingredient === id;
    btn.classList.toggle('is-recommended', isNext);
    if (isNext) {
      btn.dataset.nextBadge = t('studio.nextBadge');
      btn.setAttribute('aria-description', t('studio.nextBadge') + ': ' + t(ingredientById.get(id)?.nameKey || id));
    } else {
      btn.dataset.nextBadge = '';
      btn.removeAttribute('aria-description');
    }
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
    if (hasExistingCreation()) {
      showClearConfirmDialog();
    } else {
      clearAndStartFresh();
    }
  });
  document.querySelector('[data-action="back-to-studio-from-postcard"]')?.addEventListener('click', () => {
    navigateTo(SCREENS.STUDIO);
  });

  // Name input: update preview on Enter and blur
  const nameInput = document.querySelector('.postcard-name-input');
  if (nameInput) {
    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        nameInput.blur();
        renderPostcardPreview();
      }
    });
    nameInput.addEventListener('blur', () => {
      renderPostcardPreview();
    });
  }
}

// ─── Clear confirmation ──────────────────────────────────────────────────────

function hasExistingCreation() {
  return state.activeLayers.size > 0 || state.selectedRecipeId;
}

function clearAndStartFresh() {
  clearAllLayers();
  setState({ selectedRecipeId: null, recipeStepIndex: 0, mode: null });
  const nameInput = document.querySelector('.postcard-name-input');
  if (nameInput) nameInput.value = '';
  document.querySelectorAll('.ingredient-btn').forEach(btn => {
    btn.classList.remove('is-active');
    btn.setAttribute('aria-pressed', 'false');
  });
  navigateTo(SCREENS.WELCOME);
}

function showClearConfirmDialog() {
  // Create dialog if not already present
  let dialog = document.getElementById('clear-confirm-dialog');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = 'clear-confirm-dialog';
    dialog.className = 'confirm-dialog';
    dialog.innerHTML = `
      <p class="confirm-dialog__message"></p>
      <div class="confirm-dialog__actions">
        <button class="btn btn--primary" type="button" data-action="confirm-clear"></button>
        <button class="btn btn--ghost" type="button" data-action="confirm-keep"></button>
      </div>
    `;
    document.body.appendChild(dialog);

    dialog.querySelector('[data-action="confirm-clear"]').addEventListener('click', () => {
      dialog.close();
      clearAndStartFresh();
    });
    dialog.querySelector('[data-action="confirm-keep"]').addEventListener('click', () => {
      dialog.close();
    });
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });
    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); dialog.close(); }
    });
  }

  // Set translated text
  dialog.querySelector('.confirm-dialog__message').textContent = t('confirm.clearMessage');
  dialog.querySelector('[data-action="confirm-clear"]').textContent = t('confirm.clearButton');
  dialog.querySelector('[data-action="confirm-keep"]').textContent = t('confirm.keepButton');
  dialog.showModal();
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

  // Find missing and extra ingredients
  const missing = [...required].filter(id => !active.has(id));
  const extra = [...active].filter(id => !required.has(id));

  // Highlight missing ingredients with soft red shake
  missing.forEach(id => {
    const btn = document.querySelector(`[data-ingredient="${id}"]`);
    if (btn) {
      btn.classList.add('is-recipe-missing');
      setTimeout(() => btn.classList.remove('is-recipe-missing'), 3500);
    }
  });

  // Highlight extra ingredients with soft amber shake
  extra.forEach(id => {
    const btn = document.querySelector(`[data-ingredient="${id}"]`);
    if (btn) {
      btn.classList.add('is-recipe-extra');
      setTimeout(() => btn.classList.remove('is-recipe-extra'), 3500);
    }
  });

  // Show spirit speech bubble with friendly message
  const speechEl = document.querySelector('[data-display="spirit-speech"]');
  if (speechEl) {
    speechEl.textContent = t('recipe.mismatch.message');
    speechEl.closest('.spirit-speech')?.classList.add('is-warning');
  }

  // Show the mismatch dialog with Fix / Make-it-my-own buttons
  showMismatchDialog(missing, extra);
}

function showMismatchDialog(missing, extra) {
  let dialog = document.getElementById('recipe-mismatch-dialog');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = 'recipe-mismatch-dialog';
    dialog.className = 'mismatch-dialog';
    dialog.innerHTML = `
      <div class="mismatch-dialog__spirit" aria-hidden="true"></div>
      <p class="mismatch-dialog__message"></p>
      <div class="mismatch-dialog__details"></div>
      <div class="mismatch-dialog__actions">
        <button class="btn btn--ghost" type="button" data-action="mismatch-fix"></button>
        <button class="btn btn--primary" type="button" data-action="mismatch-own"></button>
      </div>
    `;
    document.body.appendChild(dialog);

    dialog.querySelector('[data-action="mismatch-fix"]').addEventListener('click', () => {
      dialog.close();
      // Restore warning state on spirit
      const speechEl = document.querySelector('[data-display="spirit-speech"]');
      speechEl?.closest('.spirit-speech')?.classList.remove('is-warning');
      updateSpiritMessage();
    });

    dialog.querySelector('[data-action="mismatch-own"]').addEventListener('click', () => {
      dialog.close();
      // Clear recipe, treat as free composition, proceed to postcard
      setState({ selectedRecipeId: null, mode: MODES.FREE });
      const speechEl = document.querySelector('[data-display="spirit-speech"]');
      speechEl?.closest('.spirit-speech')?.classList.remove('is-warning');
      updateSpiritMessage();
      navigateTo(SCREENS.POSTCARD);
      setTimeout(() => renderPostcardPreview(), 200);
    });

    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });
  }

  // Populate content
  dialog.querySelector('.mismatch-dialog__message').textContent = t('recipe.mismatch.message');

  // Build details: show missing and extra
  const detailsEl = dialog.querySelector('.mismatch-dialog__details');
  let detailsHTML = '';
  if (missing.length > 0) {
    const names = missing.map(id => t(ingredientById.get(id)?.nameKey || id)).join(', ');
    detailsHTML += `<p class="mismatch-detail mismatch-detail--missing">${t('recipe.mismatch.missing', { names })}</p>`;
  }
  if (extra.length > 0) {
    const names = extra.map(id => t(ingredientById.get(id)?.nameKey || id)).join(', ');
    detailsHTML += `<p class="mismatch-detail mismatch-detail--extra">${t('recipe.mismatch.extra', { names })}</p>`;
  }
  detailsEl.innerHTML = detailsHTML;

  // Set button labels
  dialog.querySelector('[data-action="mismatch-fix"]').textContent = t('recipe.mismatch.fixButton');
  dialog.querySelector('[data-action="mismatch-own"]').textContent = t('recipe.mismatch.ownButton');

  dialog.showModal();
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

/** Get the user's actual custom title (never the placeholder) */
function getPostcardTitle() {
  const recipeMatches = ingredientsExactlyMatchRecipe();
  if (recipeMatches) {
    return t(recipeById.get(state.selectedRecipeId)?.nameKey || '');
  }
  const input = document.querySelector('.postcard-name-input');
  const raw = (input?.value || '').trim();
  // Return the user's typed name, or empty string — never the placeholder
  return raw;
}

/** Render preview when entering the postcard screen */
async function renderPostcardPreview() {
  const canvas = document.getElementById('postcard-canvas');
  if (!canvas) return;
  const active = [...state.activeLayers];
  if (!active.length) return;

  // Show/hide name section based on recipe match
  const recipeMatches = ingredientsExactlyMatchRecipe();
  const nameSection = document.getElementById('postcard-name-section');
  if (recipeMatches) {
    if (nameSection) nameSection.style.display = 'none';
  } else {
    if (nameSection) nameSection.style.display = '';
  }

  const title = getPostcardTitle();
  const spiritName = state.spirit ? t(spiritDefinitions[state.spirit].nameKey) : '';

  canvas.width = 1600; canvas.height = 1200;
  await renderFullComposition(canvas, active, {
    isNight: getEffectiveTheme() === 'night' || getEffectiveTheme() === 'dusk',
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

  const title = getPostcardTitle();
  const spiritName = state.spirit ? t(spiritDefinitions[state.spirit].nameKey) : '';

  await renderFullComposition(exportCanvas, active, {
    isNight: getEffectiveTheme() === 'night' || getEffectiveTheme() === 'dusk',
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
