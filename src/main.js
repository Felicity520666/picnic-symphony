/**
 * main.js — Application entry point.
 * Wires all modules together: router, i18n, theme, audio, studio, recipes, tutorial, particles.
 */

import { state, loadPersistedState, setState, SCREENS, MODES } from './state.js';
import { initRouter, navigateTo } from './router.js';
import { applyTranslations, setLanguage, t, detectLanguage, SUPPORTED_LANGS } from './i18n.js';
import { initTheme, setTheme, getEffectiveTheme } from './theme.js';
import { spiritDefinitions, getSpiritPlaceholder } from './spirits.js';
import { ingredientDefinitions, ingredientById, MAX_LAYERS } from './ingredients.js';
import { recipeDefinitions, recipeById, isRecipeUnlocked } from './recipes.js';
import {
  createAudioGraph, resumeAudio, startTransport, stopTransport, toggleTransport,
  setMusicVolume, setAmbienceVolume, toggleAmbienceMute, updateAmbienceDucking,
  setTempo, previewIngredient, clearAllLayers, canAddLayer, onVisualHit,
  startAmbience, DEFAULT_BPM,
} from './audio.js';
import { startTutorial, bindTutorial } from './tutorial.js';
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
  document.documentElement.lang = state.lang;
  applyTranslations();
  bindGlobalControls();
  bindWelcome();
  bindSpirits();
  bindModeSelect();
  bindStudio();
  bindRecipes();
  bindPostcard();
  bindTutorial();
  initParticles();
});

// ─── Global Controls ─────────────────────────────────────────────────────────

function bindGlobalControls() {
  // Language cycling (en → zh → fr → es → en)
  document.querySelectorAll('[data-action="cycle-lang"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = SUPPORTED_LANGS.indexOf(state.lang);
      const next = SUPPORTED_LANGS[(idx + 1) % SUPPORTED_LANGS.length];
      setLanguage(next);
      updateLangButtonLabel();
    });
  });
  updateLangButtonLabel();

  // Theme buttons
  document.querySelectorAll('[data-action="set-theme"]').forEach(btn => {
    btn.addEventListener('click', () => {
      setTheme(btn.dataset.theme);
      updateThemeButtons();
    });
  });
  updateThemeButtons();
}

function updateLangButtonLabel() {
  const labels = { en: 'EN', zh: '中文', fr: 'FR', es: 'ES' };
  document.querySelectorAll('[data-action="cycle-lang"]').forEach(btn => {
    btn.textContent = labels[state.lang] || 'EN';
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
  document.querySelector('[data-action="how-it-works"]')?.addEventListener('click', () => {
    startTutorial();
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
}

function selectSpirit(id) {
  setState({ spirit: id }, true);
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
}

// ─── Studio ──────────────────────────────────────────────────────────────────

function bindStudio() {
  const container = document.querySelector('[data-screen="studio"]');
  if (!container) return;

  container.querySelector('[data-action="play-pause"]')?.addEventListener('click', () => {
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

  container.querySelector('[data-action="finish"]')?.addEventListener('click', () => navigateTo(SCREENS.POSTCARD));
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
  });
}

function toggleIngredient(id) {
  const btn = document.querySelector(`[data-ingredient="${id}"]`);
  if (!btn) return;

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
  clearAllLayers();
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
    card.innerHTML = `
      <span class="recipe-grid-card__mood">${t(recipe.moodKey)}</span>
      <strong class="recipe-grid-card__name">${t(recipe.nameKey)}</strong>
      <span class="recipe-grid-card__desc">${t(recipe.descKey)}</span>
      <span class="recipe-grid-card__meta">${t('recipes.steps', { n: recipe.ingredients.length })}</span>
    `;
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
  document.querySelector('[data-action="download-postcard"]')?.addEventListener('click', generatePostcard);
  document.querySelector('[data-action="new-picnic"]')?.addEventListener('click', () => {
    clearAllLayers();
    setState({ selectedRecipeId: null, recipeStepIndex: 0 });
    navigateTo(SCREENS.WELCOME);
  });
  document.querySelector('[data-action="back-to-studio-from-postcard"]')?.addEventListener('click', () => {
    navigateTo(SCREENS.STUDIO);
  });
}

function generatePostcard() {
  const isNight = getEffectiveTheme() === 'night';
  const canvas = document.getElementById('postcard-canvas') || document.createElement('canvas');
  canvas.width = 800; canvas.height = 500;
  const ctx = canvas.getContext('2d');

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, 0, 500);
  if (isNight) { bg.addColorStop(0, '#26324A'); bg.addColorStop(1, '#1a2a3a'); }
  else { bg.addColorStop(0, '#FFF8E8'); bg.addColorStop(1, '#f0eed8'); }
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 800, 500);

  // Border
  ctx.strokeStyle = isNight ? 'rgba(154,142,184,0.3)' : 'rgba(127,163,107,0.3)';
  ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]);
  ctx.strokeRect(24, 24, 752, 452); ctx.setLineDash([]);

  // Title
  ctx.fillStyle = isNight ? '#e8e4dc' : '#34423E';
  ctx.font = '600 32px Mali, serif'; ctx.textAlign = 'center';
  ctx.fillText('Picnic Symphony', 400, 64);

  // Mix name
  const name = document.querySelector('.postcard-name-input')?.value || '';
  if (name) { ctx.font = '18px Nunito, sans-serif'; ctx.fillStyle = isNight ? '#9A8EB8' : '#7FA36B'; ctx.fillText(name, 400, 100); }

  // Spirit + date
  ctx.font = '14px Nunito, sans-serif'; ctx.fillStyle = isNight ? '#a8b4a8' : '#5f6d5f';
  const spiritName = state.spirit ? t(spiritDefinitions[state.spirit].nameKey) : '';
  ctx.fillText(`${spiritName} · ${new Date().toLocaleDateString()}`, 400, 130);

  // Ingredients
  const active = [...state.activeLayers];
  ctx.textAlign = 'left'; ctx.font = '15px Nunito, sans-serif';
  active.forEach((id, i) => {
    const def = ingredientById.get(id); if (!def) return;
    const col = i % 3; const row = Math.floor(i / 3);
    const x = 140 + col * 190; const y = 180 + row * 36;
    ctx.fillStyle = def.color; ctx.beginPath(); ctx.arc(x, y - 3, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = isNight ? '#e8e4dc' : '#34423E'; ctx.fillText(t(def.nameKey), x + 14, y);
  });

  // Footer
  ctx.textAlign = 'center'; ctx.font = '11px Nunito, sans-serif';
  ctx.fillStyle = isNight ? '#596783' : '#A9BE91';
  ctx.fillText('picnicsymphony.app', 400, 468);

  // Download
  const link = document.createElement('a');
  link.download = 'picnic-symphony.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
