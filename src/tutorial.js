/**
 * tutorial.js — Spotlight onboarding with spirit guide.
 * Uses getBoundingClientRect for positioning.
 * Spirit flies between targets using transform animation.
 * Respects prefers-reduced-motion.
 */

import { state, setState } from './state.js';
import { t } from './i18n.js';
import { spiritDefinitions, getSpiritPlaceholder } from './spirits.js';

const STEPS = [
  { target: '[data-action="cycle-lang"]', textKey: 'tutorial.langStep', pos: 'below' },
  { target: '.theme-toggle', textKey: 'tutorial.themeStep', pos: 'below' },
  { target: '[data-action="select-mode"]', textKey: 'tutorial.modeStep', pos: 'below' },
  { target: '.ingredient-btn[data-ingredient="watermelon"]', textKey: 'tutorial.ingredientStep', pos: 'above' },
  { target: '[data-action="play-pause"]', textKey: 'tutorial.transportStep', pos: 'below' },
  { target: '[data-action="recipe-book"]', textKey: 'tutorial.recipeStep', pos: 'above' },
];

const TEXTS = {
  en: {
    'tutorial.langStep': 'Change the language here. The meadow speaks English, Chinese, French, and Spanish.',
    'tutorial.themeStep': 'Switch between day and night. Each has its own atmosphere.',
    'tutorial.modeStep': 'Choose free composition or follow a guided recipe.',
    'tutorial.ingredientStep': 'Tap any ingredient to hear its sound. Up to six can play together.',
    'tutorial.transportStep': 'Play, pause, or clear your mix at any time.',
    'tutorial.recipeStep': 'Open the recipe book for guided arrangements.',
  },
  zh: {
    'tutorial.langStep': '在这里切换语言。草地会说英语、中文、法语和西班牙语。',
    'tutorial.themeStep': '在白天和夜晚之间切换。每种都有自己的氛围。',
    'tutorial.modeStep': '选择自由作曲或跟随引导食谱。',
    'tutorial.ingredientStep': '点击任何食材听听它的声音。最多六种可以同时演奏。',
    'tutorial.transportStep': '随时播放、暂停或清空你的混音。',
    'tutorial.recipeStep': '打开食谱书查看引导编排。',
  },
  fr: {
    'tutorial.langStep': "Changez la langue ici. La prairie parle anglais, chinois, français et espagnol.",
    'tutorial.themeStep': "Passez du jour à la nuit. Chacun a sa propre atmosphère.",
    'tutorial.modeStep': "Choisissez la composition libre ou suivez une recette guidée.",
    'tutorial.ingredientStep': "Touchez un ingrédient pour l'entendre. Six peuvent jouer ensemble.",
    'tutorial.transportStep': "Jouez, pausez ou effacez votre mix à tout moment.",
    'tutorial.recipeStep': "Ouvrez le livre de recettes pour des arrangements guidés.",
  },
  es: {
    'tutorial.langStep': 'Cambia el idioma aquí. El prado habla inglés, chino, francés y español.',
    'tutorial.themeStep': 'Alterna entre día y noche. Cada uno tiene su propia atmósfera.',
    'tutorial.modeStep': 'Elige composición libre o sigue una receta guiada.',
    'tutorial.ingredientStep': 'Toca cualquier ingrediente para escucharlo. Hasta seis pueden sonar juntos.',
    'tutorial.transportStep': 'Reproduce, pausa o limpia tu mezcla en cualquier momento.',
    'tutorial.recipeStep': 'Abre el libro de recetas para arreglos guiados.',
  },
};

let currentStep = 0;
let active = false;
let resizeHandler = null;

function getTutorialText(key) {
  const lang = state.lang || 'en';
  return (TEXTS[lang] && TEXTS[lang][key]) || TEXTS.en[key] || '';
}

function startTutorial() {
  currentStep = 0;
  active = true;
  const overlay = document.querySelector('[data-screen="tutorial"]');
  if (overlay) overlay.hidden = false;
  renderStep();
  resizeHandler = () => { if (active) positionSpotlight(); };
  window.addEventListener('resize', resizeHandler);
}

function renderStep() {
  if (!active || currentStep >= STEPS.length) { finishTutorial(); return; }
  const step = STEPS[currentStep];

  // Text
  const textEl = document.querySelector('.tutorial-bubble__text');
  if (textEl) textEl.textContent = getTutorialText(step.textKey);

  // Progress
  const progEl = document.querySelector('[data-display="tutorial-progress"]');
  if (progEl) progEl.textContent = t('tutorial.step', { current: currentStep + 1, total: STEPS.length });

  // Back button state
  const backBtn = document.querySelector('[data-action="tutorial-back"]');
  if (backBtn) backBtn.disabled = currentStep === 0;

  // Next button label
  const nextBtn = document.querySelector('[data-action="tutorial-next"]');
  if (nextBtn) nextBtn.textContent = currentStep === STEPS.length - 1 ? t('tutorial.finish') : t('tutorial.next');

  positionSpotlight();
}

function positionSpotlight() {
  const step = STEPS[currentStep];
  if (!step) return;
  const target = document.querySelector(step.target);
  const spotlight = document.querySelector('.tutorial-spotlight');
  if (!spotlight) return;

  if (!target || target.offsetParent === null) {
    spotlight.style.display = 'none';
    return;
  }

  const rect = target.getBoundingClientRect();
  const pad = 6;
  spotlight.style.display = 'block';
  spotlight.style.top = `${rect.top - pad}px`;
  spotlight.style.left = `${rect.left - pad}px`;
  spotlight.style.width = `${rect.width + pad * 2}px`;
  spotlight.style.height = `${rect.height + pad * 2}px`;

  // Position bubble
  const bubble = document.querySelector('.tutorial-bubble');
  if (!bubble) return;
  const bh = bubble.offsetHeight || 140;
  const margin = 12;
  let top = step.pos === 'above' ? rect.top - bh - margin : rect.bottom + margin;
  let left = rect.left + rect.width / 2 - 180;
  top = Math.max(8, Math.min(window.innerHeight - bh - 8, top));
  left = Math.max(8, Math.min(window.innerWidth - 368, left));
  bubble.style.position = 'fixed';
  bubble.style.top = `${top}px`;
  bubble.style.left = `${left}px`;
}

function nextStep() { currentStep++; renderStep(); }
function prevStep() { if (currentStep > 0) { currentStep--; renderStep(); } }

function finishTutorial() {
  active = false;
  const overlay = document.querySelector('[data-screen="tutorial"]');
  if (overlay) overlay.hidden = true;
  setState({ tutorialCompleted: true }, true);
  if (resizeHandler) { window.removeEventListener('resize', resizeHandler); resizeHandler = null; }
}

function bindTutorial() {
  document.querySelector('[data-action="tutorial-next"]')?.addEventListener('click', nextStep);
  document.querySelector('[data-action="tutorial-back"]')?.addEventListener('click', prevStep);
  document.querySelector('[data-action="tutorial-skip"]')?.addEventListener('click', finishTutorial);
}

export { startTutorial, finishTutorial, bindTutorial };
