/**
 * tutorial.js — Spotlight-style onboarding tutorial.
 * Dims the interface, highlights one target at a time, shows a speech bubble.
 */

import { state, setState } from './state.js';
import { t } from './i18n.js';

const STEPS = [
  {
    targetSelector: '.lang-toggle',
    textKey: 'tutorial.step1',
    position: 'below',
  },
  {
    targetSelector: '.theme-toggle',
    textKey: 'tutorial.step2',
    position: 'below',
  },
  {
    targetSelector: '[data-action="select-mode"]',
    textKey: 'tutorial.step3',
    position: 'below',
  },
  {
    targetSelector: '.ingredient-btn[data-ingredient="watermelon"]',
    textKey: 'tutorial.step4',
    position: 'above',
  },
  {
    targetSelector: '.ingredient-grid',
    textKey: 'tutorial.step5',
    position: 'above',
  },
  {
    targetSelector: '[data-action="play-pause"]',
    textKey: 'tutorial.step6',
    position: 'below',
  },
  {
    targetSelector: '[data-action="recipe-book"]',
    textKey: 'tutorial.step7',
    position: 'above',
  },
  {
    targetSelector: '[data-action="finish"]',
    textKey: 'tutorial.step8',
    position: 'above',
  },
];

// Tutorial-specific translations (added to i18n externally or inline here for simplicity)
const tutorialTexts = {
  en: {
    'tutorial.step1': "See this little switch? The meadow can speak English or Chinese whenever you like.",
    'tutorial.step2': "You can change the time of day here. Try Auto—it follows your clock!",
    'tutorial.step3': "Choose Free Mix to experiment freely, or Recipe Trails for guided challenges.",
    'tutorial.step4': "Every treat carries a different part of the song. Try the watermelon first—it keeps the picnic bouncing.",
    'tutorial.step5': "Each ingredient has a unique sound and role. Mix different types to build a full song.",
    'tutorial.step6': "Play and pause your mix anytime. Your music and ambience have separate controls.",
    'tutorial.step7': "Open the Recipe Book to try guided picnic challenges with different moods.",
    'tutorial.step8': "When you're happy with your mix, finish your picnic to create a downloadable postcard!",
  },
  zh: {
    'tutorial.step1': "看到这个小开关了吗？草地随时可以切换中英文。",
    'tutorial.step2': "你可以在这里切换白天和夜晚模式。试试「自动」——它会跟着你的时钟！",
    'tutorial.step3': "选择「自由混音」自由实验，或「食谱挑战」跟着引导玩。",
    'tutorial.step4': "每个食材承载着歌曲的不同部分。先试试西瓜——它是野餐的节拍基础。",
    'tutorial.step5': "每种食材都有独特的声音和角色。混合不同类型来构建完整的歌曲。",
    'tutorial.step6': "随时播放或暂停你的混音。音乐和环境音有独立的控制。",
    'tutorial.step7': "打开食谱书，尝试不同氛围的野餐挑战。",
    'tutorial.step8': "满意你的混音后，完成野餐就能生成一张可下载的明信片！",
  },
};

let currentStep = 0;
let isActive = false;
let resizeHandler = null;

/** Get tutorial text for current language */
function getTutorialText(key) {
  const lang = state.lang || 'en';
  return (tutorialTexts[lang] && tutorialTexts[lang][key]) || tutorialTexts.en[key] || key;
}

/** Start the tutorial */
function startTutorial() {
  currentStep = 0;
  isActive = true;
  showTutorialOverlay();
  renderStep();
}

/** Show the tutorial overlay elements */
function showTutorialOverlay() {
  const overlay = document.querySelector('[data-screen="tutorial"]');
  if (overlay) {
    overlay.hidden = false;
    overlay.style.display = '';
  }
}

/** Hide the tutorial overlay */
function hideTutorialOverlay() {
  const overlay = document.querySelector('[data-screen="tutorial"]');
  if (overlay) overlay.hidden = true;
  isActive = false;
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }
}

/** Render the current tutorial step */
function renderStep() {
  if (!isActive || currentStep < 0 || currentStep >= STEPS.length) {
    finishTutorial();
    return;
  }

  const step = STEPS[currentStep];
  const target = document.querySelector(step.targetSelector);

  // Update spotlight position
  positionSpotlight(target);

  // Update bubble text
  const textEl = document.querySelector('.tutorial-bubble__text');
  if (textEl) textEl.textContent = getTutorialText(step.textKey);

  // Update progress
  const progressEl = document.querySelector('[data-display="tutorial-progress"]');
  if (progressEl) progressEl.textContent = t('tutorial.step', { current: currentStep + 1, total: STEPS.length });

  // Update button states
  const backBtn = document.querySelector('[data-action="tutorial-back"]');
  if (backBtn) backBtn.disabled = currentStep === 0;

  const nextBtn = document.querySelector('[data-action="tutorial-next"]');
  if (nextBtn) nextBtn.textContent = currentStep === STEPS.length - 1 ? t('tutorial.finish') : t('tutorial.next');

  // Listen for resize to reposition
  if (!resizeHandler) {
    resizeHandler = () => {
      if (isActive) positionSpotlight(document.querySelector(STEPS[currentStep]?.targetSelector));
    };
    window.addEventListener('resize', resizeHandler);
  }
}

/** Position the spotlight cutout around a target element */
function positionSpotlight(target) {
  const spotlight = document.querySelector('.tutorial-spotlight');
  const dim = document.querySelector('.tutorial-dim');
  if (!spotlight) return;

  if (!target) {
    // No target found (element not visible on current screen) — center spotlight
    spotlight.style.cssText = 'display: none;';
    if (dim) dim.style.background = 'rgba(0, 0, 0, 0.5)';
    return;
  }

  const rect = target.getBoundingClientRect();
  const pad = 8;

  spotlight.style.cssText = `
    display: block;
    top: ${rect.top - pad}px;
    left: ${rect.left - pad}px;
    width: ${rect.width + pad * 2}px;
    height: ${rect.height + pad * 2}px;
    border-radius: ${Math.min(rect.height / 2, 16)}px;
  `;

  // Position bubble near target
  positionBubble(rect, STEPS[currentStep]?.position || 'below');
}

/** Position the tutorial bubble relative to the spotlight */
function positionBubble(targetRect, position) {
  const bubble = document.querySelector('.tutorial-bubble');
  if (!bubble) return;

  const bw = bubble.offsetWidth || 360;
  const bh = bubble.offsetHeight || 160;
  const margin = 16;

  let top, left;

  if (position === 'above') {
    top = targetRect.top - bh - margin;
    left = targetRect.left + targetRect.width / 2 - bw / 2;
  } else {
    top = targetRect.bottom + margin;
    left = targetRect.left + targetRect.width / 2 - bw / 2;
  }

  // Clamp to viewport
  top = Math.max(12, Math.min(window.innerHeight - bh - 12, top));
  left = Math.max(12, Math.min(window.innerWidth - bw - 12, left));

  bubble.style.position = 'fixed';
  bubble.style.top = `${top}px`;
  bubble.style.left = `${left}px`;
}

/** Go to next step */
function nextStep() {
  currentStep++;
  if (currentStep >= STEPS.length) {
    finishTutorial();
  } else {
    renderStep();
  }
}

/** Go to previous step */
function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    renderStep();
  }
}

/** Skip / finish the tutorial */
function finishTutorial() {
  isActive = false;
  hideTutorialOverlay();
  setState({ tutorialCompleted: true }, true);
}

/** Check if tutorial should auto-start */
function shouldAutoStart() {
  return !state.tutorialCompleted;
}

/** Bind tutorial button events */
function bindTutorial() {
  document.querySelector('[data-action="tutorial-next"]')?.addEventListener('click', nextStep);
  document.querySelector('[data-action="tutorial-back"]')?.addEventListener('click', prevStep);
  document.querySelector('[data-action="tutorial-skip"]')?.addEventListener('click', finishTutorial);
}

export { startTutorial, finishTutorial, bindTutorial, shouldAutoStart, isActive };
