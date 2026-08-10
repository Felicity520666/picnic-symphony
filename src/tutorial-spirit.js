/**
 * tutorial-spirit.js — Viewport-level tutorial guide with redesigned bubble.
 *
 * Manages: dim overlay, spotlight on target, spirit image, speech bubble.
 * Direction rule: spirit on RIGHT → guide-left; spirit on LEFT → guide-right.
 * Bubble shows title, body, progress dots, and contextual action buttons.
 */

import { state } from './state.js';
import { t } from './i18n.js';
import { spiritDefinitions } from './spirits.js';

const SPIRIT_SIZE = 80;
const MARGIN = 12;
const GAP = 22;

let portalEl = null;
let imgEl = null;
let overlayEl = null;
let bubbleEl = null;
let currentTarget = null;
let _spiritId = null;
let _visible = false;
let _initialized = false;

// ─── Build DOM ────────────────────────────────────────────────────────────────

function initTutorialSpirit() {
  if (_initialized) return;
  _initialized = true;

  portalEl = document.getElementById('tutorial-spirit-portal');
  if (!portalEl) {
    portalEl = document.createElement('div');
    portalEl.id = 'tutorial-spirit-portal';
    portalEl.className = 'tutorial-spirit-portal';
    portalEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(portalEl);
  }

  // Spirit image
  imgEl = document.createElement('img');
  imgEl.className = 'tut-spirit';
  imgEl.alt = '';
  imgEl.draggable = false;
  portalEl.appendChild(imgEl);

  // Overlay (dim layer)
  overlayEl = document.createElement('div');
  overlayEl.className = 'tut-overlay';
  document.body.appendChild(overlayEl);

  // Bubble
  bubbleEl = document.createElement('div');
  bubbleEl.className = 'tut-bubble';
  bubbleEl.setAttribute('role', 'dialog');
  bubbleEl.setAttribute('aria-live', 'polite');
  bubbleEl.innerHTML = `
    <div class="tut-bubble__progress"></div>
    <h3 class="tut-bubble__title"></h3>
    <p class="tut-bubble__body"></p>
    <div class="tut-bubble__actions">
      <button class="tut-btn tut-btn--skip" type="button" data-action="tutorial-skip"></button>
      <div class="tut-bubble__right">
        <button class="tut-btn tut-btn--back" type="button" data-action="tutorial-back"></button>
        <button class="tut-btn tut-btn--next" type="button" data-action="tutorial-next"></button>
      </div>
    </div>
  `;
  document.body.appendChild(bubbleEl);
}

// ─── Show / Hide ──────────────────────────────────────────────────────────────

function show(spiritId) {
  if (!_initialized) initTutorialSpirit();
  _spiritId = spiritId || state.spirit || 'bee';
  _visible = true;

  overlayEl.classList.add('is-active');
  portalEl.style.display = 'block';
  imgEl.style.display = 'block';
  bubbleEl.style.display = 'block';

  window.addEventListener('resize', _onResize);
}

function hide() {
  _visible = false;
  if (currentTarget) {
    currentTarget.removeAttribute('data-tutorial-highlighted');
    currentTarget = null;
  }
  if (overlayEl) overlayEl.classList.remove('is-active');
  if (portalEl) portalEl.style.display = 'none';
  if (imgEl) imgEl.style.display = 'none';
  if (bubbleEl) { bubbleEl.classList.remove('is-visible'); bubbleEl.style.display = 'none'; }
  window.removeEventListener('resize', _onResize);
}

function setSpiritId(id) { _spiritId = id; }

// ─── Fly to target ───────────────────────────────────────────────────────────

/**
 * @param {HTMLElement} targetEl
 * @param {object} content - { title, body, stepNum, totalSteps, showBack, showNext, nextLabel }
 */
function flyToTarget(targetEl, content = {}) {
  if (!_visible || !imgEl) return;

  // Unhighlight previous
  if (currentTarget && currentTarget !== targetEl) {
    currentTarget.removeAttribute('data-tutorial-highlighted');
  }
  currentTarget = targetEl;
  targetEl.setAttribute('data-tutorial-highlighted', 'true');

  const placement = computePlacement(targetEl);
  setSpiritAsset(placement.side);
  positionSpirit(placement);
  renderBubble(content, placement);
}

function setSpiritAsset(side) {
  const def = spiritDefinitions[_spiritId];
  if (!def) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    imgEl.src = side === 'right' ? def.assets.guideLeft : def.assets.guideRight;
  } else {
    imgEl.src = side === 'right' ? def.assets.hoverLeft : def.assets.hoverRight;
    setTimeout(() => {
      if (!_visible) return;
      imgEl.src = side === 'right' ? def.assets.guideLeft : def.assets.guideRight;
    }, 750);
  }
}

function positionSpirit(p) {
  imgEl.style.left = `${p.spiritX}px`;
  imgEl.style.top = `${p.spiritY}px`;
}

// ─── Placement ────────────────────────────────────────────────────────────────

function computePlacement(el) {
  const rect = el.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const needed = SPIRIT_SIZE + GAP + MARGIN;
  const spaceRight = vw - rect.right;
  const spaceLeft = rect.left;

  let side, spiritX;
  if (spaceRight >= needed) {
    side = 'right'; spiritX = rect.right + GAP;
  } else if (spaceLeft >= needed) {
    side = 'left'; spiritX = rect.left - GAP - SPIRIT_SIZE;
  } else {
    side = spaceRight >= spaceLeft ? 'right' : 'left';
    spiritX = side === 'right'
      ? Math.min(rect.right + GAP, vw - SPIRIT_SIZE - MARGIN)
      : Math.max(MARGIN, rect.left - GAP - SPIRIT_SIZE);
  }

  let spiritY = rect.top + rect.height / 2 - SPIRIT_SIZE / 2;
  spiritX = Math.max(MARGIN, Math.min(vw - SPIRIT_SIZE - MARGIN, spiritX));
  spiritY = Math.max(MARGIN, Math.min(vh - SPIRIT_SIZE - MARGIN, spiritY));

  return { side, spiritX, spiritY, targetRect: rect };
}

// ─── Bubble rendering ─────────────────────────────────────────────────────────

function renderBubble(content, placement) {
  if (!bubbleEl) return;

  // Progress
  const progEl = bubbleEl.querySelector('.tut-bubble__progress');
  if (progEl && content.stepNum != null) {
    let dots = '';
    for (let i = 1; i <= content.totalSteps; i++) {
      dots += `<span class="tut-dot${i === content.stepNum ? ' is-active' : i < content.stepNum ? ' is-done' : ''}"></span>`;
    }
    progEl.innerHTML = `${dots}<span class="tut-bubble__step-label">${t('tutorial.step', { current: content.stepNum, total: content.totalSteps })}</span>`;
  }

  // Title and body
  const titleEl = bubbleEl.querySelector('.tut-bubble__title');
  const bodyEl = bubbleEl.querySelector('.tut-bubble__body');
  if (titleEl) titleEl.textContent = content.title || '';
  if (bodyEl) bodyEl.textContent = content.body || '';

  // Buttons
  const backBtn = bubbleEl.querySelector('[data-action="tutorial-back"]');
  const skipBtn = bubbleEl.querySelector('[data-action="tutorial-skip"]');
  const nextBtn = bubbleEl.querySelector('[data-action="tutorial-next"]');

  if (backBtn) {
    backBtn.textContent = t('tutorial.back');
    backBtn.style.display = content.showBack !== false && content.stepNum > 1 ? '' : 'none';
  }
  if (skipBtn) skipBtn.textContent = t('tutorial.skip');
  if (nextBtn) {
    nextBtn.textContent = content.nextLabel || (content.stepNum >= content.totalSteps ? t('tutorial.finish') : t('tutorial.next'));
    nextBtn.style.display = content.showNext !== false ? '' : 'none';
  }

  // Position bubble below spirit, avoiding target overlap
  const bw = Math.min(440, window.innerWidth - 24);
  let bTop = placement.spiritY + SPIRIT_SIZE + 14;
  let bLeft = placement.spiritX + SPIRIT_SIZE / 2 - bw / 2;

  // Don't cover target
  const tRect = placement.targetRect;
  if (bTop < tRect.bottom + 8 && bTop + 180 > tRect.top) {
    bTop = Math.max(tRect.bottom + 12, placement.spiritY + SPIRIT_SIZE + 14);
  }

  bTop = Math.max(MARGIN, Math.min(window.innerHeight - 200, bTop));
  bLeft = Math.max(MARGIN, Math.min(window.innerWidth - bw - MARGIN, bLeft));

  bubbleEl.style.top = `${bTop}px`;
  bubbleEl.style.left = `${bLeft}px`;
  bubbleEl.style.width = `${bw}px`;

  requestAnimationFrame(() => bubbleEl.classList.add('is-visible'));
}

// ─── Resize ───────────────────────────────────────────────────────────────────

function _onResize() {
  if (!_visible || !currentTarget) return;
  const p = computePlacement(currentTarget);
  positionSpirit(p);
  // Reposition bubble with existing content
  const titleEl = bubbleEl.querySelector('.tut-bubble__title');
  const bodyEl = bubbleEl.querySelector('.tut-bubble__body');
  renderBubble({
    title: titleEl?.textContent,
    body: bodyEl?.textContent,
  }, p);
}

export { initTutorialSpirit, show, hide, flyToTarget, setSpiritId };
