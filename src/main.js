/**
 * main.js — Application entry point.
 * Initializes state, router, theme, i18n, and binds all events.
 */

import { state, loadPersistedState, setState, SCREENS, MODES } from './state.js';
import { initRouter, navigateTo } from './router.js';
import { applyTranslations, setLanguage, t } from './i18n.js';
import { initTheme, setTheme, getEffectiveTheme } from './theme.js';
import { spiritDefinitions } from './spirits.js';
import { ingredientDefinitions, ingredientById } from './ingredients.js';
import { recipeDefinitions, recipeById, isRecipeUnlocked } from './recipes.js';
import {
  createAudioGraph, resumeAudio, startTransport, stopTransport, toggleTransport,
  setMusicVolume, setAmbienceVolume, toggleAmbienceMute, updateAmbienceDucking,
  setTempo, previewIngredient, clearAllLayers, onVisualHit, startAmbience,
} from './audio.js';
import { startTutorial, bindTutorial } from './tutorial.js';
import { initParticles } from './particles.js';

// ─── Bootstrap ───────────────────────────────────────────────────────────────

loadPersistedState();
initTheme();

document.addEventListener('DOMContentLoaded', () => {
  initRouter();
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

// ─── Global Controls (language, theme — present on all screens) ──────────────

function bindGlobalControls() {
  // Language toggle
  document.querySelectorAll('[data-action="toggle-lang"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const next = state.lang === 'en' ? 'zh' : 'en';
      setLanguage(next);
    });
  });

  // Theme buttons
  document.querySelectorAll('[data-action="set-theme"]').forEach(btn => {
    btn.addEventListener('click', () => {
      setTheme(btn.dataset.theme);
      updateThemeButtons();
    });
  });

  updateThemeButtons();
}

function updateThemeButtons() {
  document.querySelectorAll('[data-action="set-theme"]').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.theme === state.theme);
  });
}

// ─── Welcome Screen ──────────────────────────────────────────────────────────

function bindWelcome() {
  const enterBtn = document.querySelector('[data-action="enter-meadow"]');
  const howBtn = document.querySelector('[data-action="how-it-works"]');

  if (enterBtn) {
    enterBtn.addEventListener('click', async () => {
      await resumeAudio();
      startAmbience();
      navigateTo(SCREENS.SPIRITS);
    });
  }

  if (howBtn) {
    howBtn.addEventListener('click', () => {
      // Navigate to studio first so targets exist, then launch tutorial
      startTutorial();
    });
  }
}

// ─── Spirit Selection ────────────────────────────────────────────────────────

function bindSpirits() {
  const container = document.querySelector('[data-screen="spirits"]');
  if (!container) return;

  const grid = container.querySelector('.spirit-grid');
  const continueBtn = container.querySelector('[data-action="spirit-continue"]');

  if (grid) {
    grid.addEventListener('click', (e) => {
      const card = e.target.closest('[data-spirit]');
      if (!card) return;
      selectSpirit(card.dataset.spirit);
    });
  }

  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      if (!state.spirit) return;
      navigateTo(SCREENS.MODE_SELECT);
    });
  }
}

function selectSpirit(id) {
  setState({ spirit: id }, true);
  // Update UI selection state
  document.querySelectorAll('[data-spirit]').forEach(card => {
    card.classList.toggle('is-selected', card.dataset.spirit === id);
    card.setAttribute('aria-checked', card.dataset.spirit === id ? 'true' : 'false');
  });
  // Enable continue button
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

  // Transport
  container.querySelector('[data-action="play-pause"]')?.addEventListener('click', () => {
    toggleTransport();
    updateTransportUI();
  });

  container.querySelector('[data-action="clear-mix"]')?.addEventListener('click', () => {
    clearAllLayers();
    for (const btn of document.querySelectorAll('.ingredient-btn')) {
      btn.classList.remove('is-active');
      btn.setAttribute('aria-pressed', 'false');
    }
    updateStudioUI();
  });

  container.querySelector('[data-action="surprise"]')?.addEventListener('click', surpriseBasket);

  // Volume
  container.querySelector('[data-action="music-volume"]')?.addEventListener('input', (e) => {
    setMusicVolume(Number(e.target.value) / 100);
  });

  container.querySelector('[data-action="ambience-volume"]')?.addEventListener('input', (e) => {
    setAmbienceVolume(Number(e.target.value) / 100);
  });

  // Tempo
  container.querySelector('[data-action="tempo"]')?.addEventListener('input', (e) => {
    setTempo(Number(e.target.value));
    updateTempoDisplay();
  });

  // Ingredient grid (event delegation)
  container.querySelector('.ingredient-grid')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.ingredient-btn');
    if (!btn) return;
    toggleIngredient(btn.dataset.ingredient);
  });

  // Finish
  container.querySelector('[data-action="finish"]')?.addEventListener('click', () => {
    navigateTo(SCREENS.POSTCARD);
  });

  // Recipe book link
  container.querySelector('[data-action="recipe-book"]')?.addEventListener('click', () => {
    navigateTo(SCREENS.RECIPES);
  });

  // Visual hit feedback
  onVisualHit((id) => {
    const btn = container.querySelector(`[data-ingredient="${id}"]`);
    if (!btn) return;
    btn.classList.add('is-playing');
    setTimeout(() => btn.classList.remove('is-playing'), 250);
  });
}

function enterStudio() {
  if (!state.context) createAudioGraph();

  // Populate spirit portrait in sidebar
  const spiritArtEl = document.getElementById('studio-spirit-art');
  if (spiritArtEl && state.spirit) {
    const spirit = spiritDefinitions[state.spirit];
    if (spirit) {
      const img = document.createElement('img');
      img.src = spirit.image;
      img.alt = t(spirit.nameKey);
      img.className = 'spirit-panel__img';
      img.onerror = () => {
        img.remove();
        spiritArtEl.innerHTML = `<div class="spirit-portrait__fallback is-visible" style="--spirit-color:${spirit.fallbackColor}"><span class="spirit-portrait__symbol">${spirit.fallbackSymbol}</span></div>`;
      };
      spiritArtEl.innerHTML = '';
      spiritArtEl.appendChild(img);
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
    state.activeLayers.delete(id);
    btn.classList.remove('is-active');
    btn.setAttribute('aria-pressed', 'false');
  } else {
    state.activeLayers.add(id);
    btn.classList.add('is-active');
    btn.setAttribute('aria-pressed', 'true');
    previewIngredient(id);

    // Advance recipe if this was the recommended ingredient
    if (state.selectedRecipeId && state.recommendedIngredientId === id) {
      advanceRecipeStep();
    }
  }

  updateAmbienceDucking();
  updateStudioUI();
}

function advanceRecipeStep() {
  const recipe = recipeById.get(state.selectedRecipeId);
  if (!recipe) return;

  state.recipeStepIndex++;

  // Check if recipe is complete
  if (state.recipeStepIndex >= recipe.steps.length) {
    // Recipe complete!
    if (!state.completedRecipes.includes(state.selectedRecipeId)) {
      state.completedRecipes.push(state.selectedRecipeId);
      setState({ completedRecipes: state.completedRecipes }, true);
    }
  }
}

function surpriseBasket() {
  clearAllLayers();
  const shuffled = [...ingredientDefinitions].sort(() => Math.random() - 0.5);
  const count = 3 + Math.floor(Math.random() * 4); // 3–6 random ingredients
  for (let i = 0; i < count; i++) {
    state.activeLayers.add(shuffled[i].id);
  }
  // Update buttons
  for (const btn of document.querySelectorAll('.ingredient-btn')) {
    const isActive = state.activeLayers.has(btn.dataset.ingredient);
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  }
  updateAmbienceDucking();
  updateStudioUI();
}

function updateTransportUI() {
  const btn = document.querySelector('[data-action="play-pause"]');
  if (btn) btn.textContent = state.playing ? t('studio.pause') : t('studio.play');
}

function updateTempoDisplay() {
  const el = document.querySelector('[data-display="tempo"]');
  if (el) el.textContent = `${state.bpm} BPM`;
}

function updateStudioUI() {
  // Layer count
  const countEl = document.querySelector('[data-display="layer-count"]');
  if (countEl) countEl.textContent = t('studio.layerCount', { n: state.activeLayers.size });

  // Beat label — shows recipe step if in recipe mode
  const beatEl = document.querySelector('[data-display="beat-label"]');
  if (beatEl) {
    if (state.selectedRecipeId) {
      const recipe = recipeById.get(state.selectedRecipeId);
      if (recipe && state.recipeStepIndex < recipe.steps.length) {
        const step = recipe.steps[state.recipeStepIndex];
        const name = t(ingredientById.get(step.ingredientId)?.nameKey || step.ingredientId);
        beatEl.textContent = `Step ${state.recipeStepIndex + 1}/${recipe.steps.length}: ${name}`;
        // Highlight recommended ingredient
        highlightRecommended(step.ingredientId);
      } else if (recipe) {
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

function highlightRecommended(ingredientId) {
  for (const btn of document.querySelectorAll('.ingredient-btn')) {
    btn.classList.toggle('is-recommended', btn.dataset.ingredient === ingredientId);
  }
  state.recommendedIngredientId = ingredientId;
}

function updateSpiritMessage() {
  const el = document.querySelector('[data-display="spirit-speech"]');
  if (!el || !state.spirit) return;

  const spirit = spiritDefinitions[state.spirit];
  if (!spirit) return;

  const count = state.activeLayers.size;
  let msgKey;
  let vars = {};

  // Recipe mode messages
  if (state.selectedRecipeId) {
    const recipe = recipeById.get(state.selectedRecipeId);
    if (recipe && state.recipeStepIndex < recipe.steps.length) {
      const step = recipe.steps[state.recipeStepIndex];
      const name = t(ingredientById.get(step.ingredientId)?.nameKey || step.ingredientId);
      msgKey = spirit.messages.recipeStep;
      vars = { step: state.recipeStepIndex + 1, total: recipe.steps.length, name };
    } else if (recipe) {
      msgKey = spirit.messages.recipeDone;
      vars = { name: t(recipe.nameKey) };
    } else {
      msgKey = spirit.messages.idle;
    }
  } else {
    // Free mix messages
    if (count === 0) msgKey = spirit.messages.idle;
    else if (count === 1) msgKey = spirit.messages.firstAdd;
    else if (count >= 3 && count < 6) msgKey = spirit.messages.threeActive;
    else if (count >= 6) msgKey = spirit.messages.fullMix;
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
    const locked = !isRecipeUnlocked(recipe, state.completedRecipes);
    const card = document.createElement('div');
    card.className = `recipe-grid-card${locked ? ' is-locked' : ''}`;
    card.dataset.recipe = recipe.id;
    card.setAttribute('role', 'listitem');
    card.innerHTML = `
      <span class="recipe-grid-card__mood" data-i18n="${recipe.moodKey}">${t(recipe.moodKey)}</span>
      <strong class="recipe-grid-card__name" data-i18n="${recipe.nameKey}">${t(recipe.nameKey)}</strong>
      <span class="recipe-grid-card__desc" data-i18n="${recipe.descKey}">${t(recipe.descKey)}</span>
      <span class="recipe-grid-card__meta">${t('recipes.steps', { n: recipe.steps.length })}${locked ? ' 🔒' : ''}</span>
    `;
    grid.appendChild(card);
  }
}

function startRecipe(recipeId) {
  const recipe = recipeById.get(recipeId);
  if (!recipe) return;
  if (!isRecipeUnlocked(recipe, state.completedRecipes)) return;

  setState({
    selectedRecipeId: recipeId,
    recipeStepIndex: 0,
    mode: MODES.RECIPE,
  });

  clearAllLayers();
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

  // Use the visible canvas on the postcard screen
  const canvas = document.getElementById('postcard-canvas') || document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 500;
  const ctx = canvas.getContext('2d');

  // --- Background with soft gradient ---
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 500);
  if (isNight) {
    bgGrad.addColorStop(0, '#0f1b2e');
    bgGrad.addColorStop(0.5, '#1a3050');
    bgGrad.addColorStop(1, '#1f3a5a');
  } else {
    bgGrad.addColorStop(0, '#fef9ec');
    bgGrad.addColorStop(0.4, '#f5f0e0');
    bgGrad.addColorStop(1, '#e8f5dc');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 800, 500);

  // --- Decorative border ---
  ctx.strokeStyle = isNight ? 'rgba(126,203,161,0.3)' : 'rgba(125,172,104,0.3)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 4]);
  ctx.strokeRect(20, 20, 760, 460);
  ctx.setLineDash([]);

  // --- Title ---
  ctx.fillStyle = isNight ? '#e8e4dc' : '#2e5a3a';
  ctx.font = 'bold 36px Mali, Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(t('welcome.title'), 400, 70);

  // --- Subtitle / mix name ---
  const mixName = document.querySelector('.postcard-name-input')?.value || t('welcome.subtitle');
  ctx.font = '20px Nunito, sans-serif';
  ctx.fillStyle = isNight ? '#a0ddb8' : '#5e9a4f';
  ctx.fillText(`"${mixName}"`, 400, 105);

  // --- Spirit name ---
  ctx.font = '16px Nunito, sans-serif';
  ctx.fillStyle = isNight ? '#ccc' : '#5f6d5f';
  const spiritName = state.spirit ? t(spiritDefinitions[state.spirit].nameKey) : '';
  if (spiritName) ctx.fillText(`Guide: ${spiritName}`, 400, 140);

  // --- Date & theme ---
  ctx.font = '14px Nunito, sans-serif';
  ctx.fillText(`${new Date().toLocaleDateString()} · ${isNight ? 'Night' : 'Day'} mode`, 400, 165);

  // --- Ingredients list in a grid ---
  const activeIds = [...state.activeLayers];
  const cols = 3;
  const startX = 120;
  const startY = 210;
  const cellW = 200;
  const cellH = 36;

  ctx.font = '15px Nunito, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = isNight ? '#e8e4dc' : '#3b4a3e';

  activeIds.forEach((id, i) => {
    const def = ingredientById.get(id);
    if (!def) return;
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = startX + col * cellW;
    const y = startY + row * cellH;

    // Small color dot
    ctx.beginPath();
    ctx.arc(x, y - 4, 5, 0, Math.PI * 2);
    ctx.fillStyle = def.color;
    ctx.fill();

    // Name
    ctx.fillStyle = isNight ? '#e8e4dc' : '#3b4a3e';
    ctx.fillText(t(def.nameKey), x + 14, y);
  });

  // --- Recipe info if applicable ---
  if (state.selectedRecipeId) {
    const recipe = recipeById.get(state.selectedRecipeId);
    if (recipe) {
      ctx.textAlign = 'center';
      ctx.font = 'italic 14px Nunito, sans-serif';
      ctx.fillStyle = isNight ? '#a8b4a8' : '#5f6d5f';
      ctx.fillText(`Recipe: ${t(recipe.nameKey)}`, 400, 420);
    }
  }

  // --- Footer ---
  ctx.textAlign = 'center';
  ctx.font = '12px Nunito, sans-serif';
  ctx.fillStyle = isNight ? '#6a7a6a' : '#9aab9a';
  ctx.fillText('Made with Picnic Symphony ♪', 400, 470);

  // --- Download ---
  const link = document.createElement('a');
  link.download = 'picnic-symphony-postcard.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
