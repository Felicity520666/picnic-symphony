/**
 * spirits.js — Four guiding spirit definitions + GuideSpiritLayer.
 * Manages IDLE, FLYING, GUIDING, and CELEBRATING animation states.
 * Uses Web Animations API for smooth curved flight paths.
 * One persistent layer survives route changes.
 */

import { state, subscribe } from './state.js';

// ─── Spirit Definitions ──────────────────────────────────────────────────────

/**
 * Spirit folder mapping:
 *   bee       → assets/spirits/aurelia/
 *   bird      → assets/spirits/lark/
 *   dragonfly → assets/spirits/rill/
 *   butterfly → assets/spirits/iris/
 *
 * Each folder contains:
 *   idle-left.png, idle-right.png
 *   flutter-left.png, flutter-right.png
 *   guide-left.png, guide-right.png
 *   hover-left.webp, hover-right.webp
 */

const SPIRIT_FOLDERS = {
  bee: 'aurelia',
  bird: 'lark',
  dragonfly: 'rill',
  butterfly: 'iris',
};

/** Build all asset paths for a spirit */
function spiritAssets(spiritId) {
  const folder = SPIRIT_FOLDERS[spiritId];
  const base = `assets/spirits/${folder}`;
  return {
    idleLeft: `${base}/idle-left.png`,
    idleRight: `${base}/idle-right.png`,
    flutterLeft: `${base}/flutter-left.png`,
    flutterRight: `${base}/flutter-right.png`,
    guideLeft: `${base}/guide-left.png`,
    guideRight: `${base}/guide-right.png`,
    hoverLeft: `${base}/hover-left.webp`,
    hoverRight: `${base}/hover-right.webp`,
  };
}

const spiritDefinitions = {
  bee: {
    id: 'bee',
    name: 'Aurelia',
    folder: 'aurelia',
    nameKey: 'spirit.bee.name',
    personalityKey: 'spirit.bee.personality',
    image: 'assets/spirits/aurelia/idle-right.png',
    assets: spiritAssets('bee'),
    fallbackColor: '#F4D77D',
    trailType: 'pollen',
    association: 'rhythm',
    messages: {
      welcome: 'spirit.bee.welcome',
      idle: 'spirit.bee.idle',
      firstAdd: 'spirit.bee.firstAdd',
      threeActive: 'spirit.bee.threeActive',
      fullMix: 'spirit.bee.fullMix',
      cleared: 'spirit.bee.cleared',
      recipeStep: 'spirit.bee.recipeStep',
      recipeDone: 'spirit.bee.recipeDone',
    },
  },
  bird: {
    id: 'bird',
    name: 'Lark',
    folder: 'lark',
    nameKey: 'spirit.bird.name',
    personalityKey: 'spirit.bird.personality',
    image: 'assets/spirits/lark/idle-right.png',
    assets: spiritAssets('bird'),
    fallbackColor: '#E97B70',
    trailType: 'feather',
    association: 'melody',
    messages: {
      welcome: 'spirit.bird.welcome',
      idle: 'spirit.bird.idle',
      firstAdd: 'spirit.bird.firstAdd',
      threeActive: 'spirit.bird.threeActive',
      fullMix: 'spirit.bird.fullMix',
      cleared: 'spirit.bird.cleared',
      recipeStep: 'spirit.bird.recipeStep',
      recipeDone: 'spirit.bird.recipeDone',
    },
  },
  dragonfly: {
    id: 'dragonfly',
    name: 'Rill',
    folder: 'rill',
    nameKey: 'spirit.dragonfly.name',
    personalityKey: 'spirit.dragonfly.personality',
    image: 'assets/spirits/rill/idle-right.png',
    assets: spiritAssets('dragonfly'),
    fallbackColor: '#9CCDDD',
    trailType: 'ripple',
    association: 'texture',
    messages: {
      welcome: 'spirit.dragonfly.welcome',
      idle: 'spirit.dragonfly.idle',
      firstAdd: 'spirit.dragonfly.firstAdd',
      threeActive: 'spirit.dragonfly.threeActive',
      fullMix: 'spirit.dragonfly.fullMix',
      cleared: 'spirit.dragonfly.cleared',
      recipeStep: 'spirit.dragonfly.recipeStep',
      recipeDone: 'spirit.dragonfly.recipeDone',
    },
  },
  butterfly: {
    id: 'butterfly',
    name: 'Iris',
    folder: 'iris',
    nameKey: 'spirit.butterfly.name',
    personalityKey: 'spirit.butterfly.personality',
    image: 'assets/spirits/iris/idle-right.png',
    assets: spiritAssets('butterfly'),
    fallbackColor: '#9A8EB8',
    trailType: 'petal',
    association: 'harmony',
    messages: {
      welcome: 'spirit.butterfly.welcome',
      idle: 'spirit.butterfly.idle',
      firstAdd: 'spirit.butterfly.firstAdd',
      threeActive: 'spirit.butterfly.threeActive',
      fullMix: 'spirit.butterfly.fullMix',
      cleared: 'spirit.butterfly.cleared',
      recipeStep: 'spirit.butterfly.recipeStep',
      recipeDone: 'spirit.butterfly.recipeDone',
    },
  },
};

/** Preload hover and guide assets for the selected spirit */
function preloadSpiritAssets(spiritId) {
  const def = spiritDefinitions[spiritId];
  if (!def) return;
  const urls = [
    def.assets.hoverLeft, def.assets.hoverRight,
    def.assets.guideLeft, def.assets.guideRight,
  ];
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
}

// ─── Placeholder generators (unchanged) ──────────────────────────────────────

function getSpiritPlaceholder(spiritId) {
  const spirit = spiritDefinitions[spiritId];
  if (!spirit) return '';
  const color = spirit.fallbackColor;
  const shapes = {
    bee: `<ellipse cx="50" cy="42" rx="14" ry="16" fill="${color}" opacity="0.6"/><ellipse cx="50" cy="42" rx="10" ry="12" fill="${color}" opacity="0.3"/><path d="M38 30 Q50 18 62 30" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.5"/>`,
    bird: `<path d="M35 50 Q50 30 65 50 Q50 45 35 50Z" fill="${color}" opacity="0.5"/><circle cx="50" cy="42" r="8" fill="${color}" opacity="0.6"/>`,
    dragonfly: `<ellipse cx="50" cy="50" rx="4" ry="18" fill="${color}" opacity="0.5"/><ellipse cx="38" cy="40" rx="12" ry="5" fill="${color}" opacity="0.3" transform="rotate(-15 38 40)"/><ellipse cx="62" cy="40" rx="12" ry="5" fill="${color}" opacity="0.3" transform="rotate(15 62 40)"/>`,
    butterfly: `<path d="M50 55 Q35 35 30 45 Q35 55 50 50Z" fill="${color}" opacity="0.4"/><path d="M50 55 Q65 35 70 45 Q65 55 50 50Z" fill="${color}" opacity="0.4"/><line x1="50" y1="35" x2="50" y2="55" stroke="${color}" stroke-width="1.5" opacity="0.6"/>`,
  };
  const shape = shapes[spiritId] || shapes.butterfly;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200">
    <rect width="100" height="100" rx="50" fill="${color}" opacity="0.08"/>
    <circle cx="50" cy="50" r="38" fill="none" stroke="${color}" stroke-width="0.8" stroke-dasharray="3 3" opacity="0.4"/>
    ${shape}
    <text x="50" y="78" text-anchor="middle" font-family="serif" font-size="8" fill="${color}" opacity="0.7">${spirit.name}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function getIngredientPlaceholder(ingredientId, color, name) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="120" height="120">
    <rect width="100" height="100" rx="16" fill="${color}" opacity="0.08"/>
    <circle cx="50" cy="44" r="22" fill="${color}" opacity="0.15"/>
    <circle cx="50" cy="44" r="16" fill="${color}" opacity="0.1"/>
    <text x="50" y="82" text-anchor="middle" font-family="sans-serif" font-size="7" fill="${color}" opacity="0.8">${name}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// ─── Reduced motion detection ────────────────────────────────────────────────

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ─── GuideSpiritLayer ────────────────────────────────────────────────────────

const STATES = { IDLE: 'idle', FLYING: 'flying', GUIDING: 'guiding', CELEBRATING: 'celebrating' };

class GuideSpiritLayer {
  constructor() {
    this.layer = null;        // The #guide-spirit-layer element
    this.el = null;           // The spirit DOM element
    this.imgEl = null;        // The <img> inside
    this.haloEl = null;       // Watercolor halo
    this.spiritId = null;     // Current spirit id
    this.currentState = null;
    this.position = { x: 0, y: 0 };
    this.flyAnimation = null;
    this._trailTimer = null;
    this._celebrateTimeout = null;

    // Guiding elements
    this.overlayEl = null;
    this.spotlightEl = null;
    this.dialogueEl = null;
  }

  /** Initialize the layer. Call once on DOMContentLoaded. */
  init() {
    this.layer = document.getElementById('guide-spirit-layer');
    if (!this.layer) return;

    // Create guiding overlay elements (hidden by default)
    this.overlayEl = document.createElement('div');
    this.overlayEl.className = 'guide-overlay';
    document.body.insertBefore(this.overlayEl, this.layer);

    this.spotlightEl = document.createElement('div');
    this.spotlightEl.className = 'guide-spotlight';
    this.spotlightEl.style.display = 'none';
    document.body.insertBefore(this.spotlightEl, this.layer);

    this.dialogueEl = document.createElement('div');
    this.dialogueEl.className = 'guide-dialogue';
    this.dialogueEl.setAttribute('role', 'status');
    this.dialogueEl.setAttribute('aria-live', 'polite');
    this.layer.appendChild(this.dialogueEl);

    // Listen for route changes to fly the spirit
    subscribe((s, key) => {
      if (key === 'screen' && this.spiritId && this.el) {
        this._onRouteChange(s.screen);
      }
    });
  }

  /** Set the active spirit and show it (called after selection) */
  setSpirit(spiritId) {
    if (!this.layer) return;
    const def = spiritDefinitions[spiritId];
    if (!def) return;

    this.spiritId = spiritId;

    // Remove old spirit element if any
    if (this.el) {
      this.el.remove();
      this.el = null;
    }

    // Preload hover/guide assets
    preloadSpiritAssets(spiritId);

    // Build spirit element
    this.el = document.createElement('div');
    this.el.className = 'guide-spirit';
    this.el.dataset.spiritId = spiritId;

    this.haloEl = document.createElement('div');
    this.haloEl.className = 'guide-spirit__halo';
    this.el.appendChild(this.haloEl);

    this.imgEl = document.createElement('img');
    this.imgEl.className = 'guide-spirit__img';
    this.imgEl.src = def.assets.idleRight;
    this.imgEl.alt = '';
    this.imgEl.draggable = false;
    this.imgEl.onerror = () => {
      this.imgEl.src = getSpiritPlaceholder(spiritId);
      this.imgEl.onerror = null;
    };
    this.el.appendChild(this.imgEl);

    this.layer.appendChild(this.el);

    // Start at center-bottom
    this._setPosition(window.innerWidth / 2 - 32, window.innerHeight - 100);
    this._direction = 'right'; // currently facing right
    this.toIdle();
  }

  /** Remove spirit from layer */
  remove() {
    this._clearTrail();
    if (this.flyAnimation) { this.flyAnimation.cancel(); this.flyAnimation = null; }
    if (this.el) { this.el.remove(); this.el = null; }
    this.spiritId = null;
    this.currentState = null;
    this._hideGuiding();
  }

  // ─── State transitions ───────────────────────────

  toIdle() {
    if (!this.el) return;
    this.currentState = STATES.IDLE;
    this.el.className = 'guide-spirit guide-spirit--idle';
    this.el.dataset.spiritId = this.spiritId;

    // Set the correct idle image based on current direction
    const def = spiritDefinitions[this.spiritId];
    if (def && this.imgEl) {
      const dir = this._direction || 'right';
      this.imgEl.src = dir === 'left' ? def.assets.idleLeft : def.assets.idleRight;
    }
    this._hideGuiding();
  }

  /** Fly to (x, y) on screen with a smooth curve. Returns a Promise that resolves when done. */
  flyTo(x, y, duration = 800) {
    if (!this.el) return Promise.resolve();
    if (prefersReducedMotion()) {
      this._setPosition(x, y);
      this.toIdle();
      return Promise.resolve();
    }

    this.currentState = STATES.FLYING;
    this.el.className = 'guide-spirit guide-spirit--flying';
    this.el.dataset.spiritId = this.spiritId;

    // Determine direction of travel and use the correct hover asset
    const dx = x - this.position.x;
    const def = spiritDefinitions[this.spiritId];
    if (def && this.imgEl) {
      if (dx < -5) {
        this.imgEl.src = def.assets.hoverLeft;
        this._direction = 'left';
      } else {
        this.imgEl.src = def.assets.hoverRight;
        this._direction = 'right';
      }
    }

    // Calculate a control point for a smooth bezier curve
    const startX = this.position.x;
    const startY = this.position.y;
    const midX = (startX + x) / 2;
    const midY = Math.min(startY, y) - 30 - Math.random() * 20; // arc upward

    // Tilt in direction of travel
    const tiltDeg = Math.max(-8, Math.min(8, dx * 0.03));

    // Use Web Animations API with keyframes for curved motion
    const keyframes = [
      { transform: `translate(${startX}px, ${startY}px) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${midX}px, ${midY}px) rotate(${tiltDeg}deg)`, opacity: 1, offset: 0.5 },
      { transform: `translate(${x}px, ${y}px) rotate(0deg)`, opacity: 1 },
    ];

    if (this.flyAnimation) this.flyAnimation.cancel();

    this.flyAnimation = this.el.animate(keyframes, {
      duration: Math.max(650, Math.min(950, duration)),
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'forwards',
    });

    return new Promise(resolve => {
      this.flyAnimation.onfinish = () => {
        this.flyAnimation = null;
        this._setPosition(x, y);
        this.el.style.transform = '';
        this.toIdle();
        resolve();
      };
    });
  }

  /** Enter GUIDING state: hover beside target, show overlay/spotlight/dialogue */
  toGuiding(targetEl, text, position = 'right') {
    if (!this.el || !targetEl) return;

    this.currentState = STATES.GUIDING;
    this.el.className = 'guide-spirit guide-spirit--guiding';
    this.el.dataset.spiritId = this.spiritId;

    const rect = targetEl.getBoundingClientRect();
    const def = spiritDefinitions[this.spiritId];

    // Show overlay
    this.overlayEl.classList.add('guide-overlay--active');

    // Position spotlight on target
    const pad = 8;
    this.spotlightEl.style.display = 'block';
    this.spotlightEl.style.top = `${rect.top - pad}px`;
    this.spotlightEl.style.left = `${rect.left - pad}px`;
    this.spotlightEl.style.width = `${rect.width + pad * 2}px`;
    this.spotlightEl.style.height = `${rect.height + pad * 2}px`;

    // Position spirit beside target using CORRECT directional asset:
    // Spirit on RIGHT of target → use guide-LEFT (looks back at target)
    // Spirit on LEFT of target → use guide-RIGHT (looks toward target)
    let spiritX, spiritY;
    if (position === 'left') {
      spiritX = rect.left - 80;
      spiritY = rect.top + rect.height / 2 - 32;
      this._direction = 'right'; // facing right (toward target)
      if (def && this.imgEl) this.imgEl.src = def.assets.guideRight;
    } else {
      spiritX = rect.right + 16;
      spiritY = rect.top + rect.height / 2 - 32;
      this._direction = 'left'; // facing left (toward target)
      if (def && this.imgEl) this.imgEl.src = def.assets.guideLeft;
    }
    spiritX = Math.max(8, Math.min(window.innerWidth - 72, spiritX));
    spiritY = Math.max(8, Math.min(window.innerHeight - 72, spiritY));
    this._setPosition(spiritX, spiritY);

    // Show dialogue card
    if (text) {
      this.dialogueEl.textContent = text;
      const dialogueTop = spiritY + 72;
      const dialogueLeft = Math.max(8, Math.min(window.innerWidth - 296, spiritX - 40));
      this.dialogueEl.style.top = `${dialogueTop}px`;
      this.dialogueEl.style.left = `${dialogueLeft}px`;
      this.dialogueEl.classList.add('guide-dialogue--visible');
    }
  }

  /** Exit guiding state */
  exitGuiding() {
    this._hideGuiding();
    this.toIdle();
  }

  /** Celebrate: small upward arc + trail, then return to idle */
  celebrate() {
    if (!this.el || prefersReducedMotion()) return;

    this.currentState = STATES.CELEBRATING;
    this.el.className = 'guide-spirit guide-spirit--celebrating';
    this.el.dataset.spiritId = this.spiritId;

    // Spawn trail particles
    this._spawnTrail();

    // Return to idle after animation
    if (this._celebrateTimeout) clearTimeout(this._celebrateTimeout);
    this._celebrateTimeout = setTimeout(() => {
      this.toIdle();
      this._celebrateTimeout = null;
    }, 700);
  }

  // ─── Selection screen behavior ───────────────────

  /** Fly from a card to a target position (e.g. beside Continue button) */
  flyFromCard(cardEl, targetEl) {
    if (!this.el || !cardEl || !targetEl) return Promise.resolve();

    const cardRect = cardEl.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    // Start position: center of card
    this._setPosition(
      cardRect.left + cardRect.width / 2 - 32,
      cardRect.top + cardRect.height / 2 - 32
    );
    this.el.style.opacity = '1';

    // Fly to beside the target
    const destX = targetRect.left - 72;
    const destY = targetRect.top + targetRect.height / 2 - 32;

    return this.flyTo(destX, destY, 800);
  }

  // ─── Route change behavior ───────────────────────

  _onRouteChange(newScreen) {
    if (!this.el) return;

    // Compute a destination near the top-center of the viewport
    const destX = window.innerWidth / 2 - 32;
    const destY = 60;

    // Fly there quickly ahead of the content transition
    this.flyTo(destX, destY, 600);
  }

  // ─── Internal helpers ────────────────────────────

  _setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
    if (this.el && this.currentState !== STATES.FLYING) {
      this.el.style.left = `${x}px`;
      this.el.style.top = `${y}px`;
    }
  }

  _hideGuiding() {
    if (this.overlayEl) this.overlayEl.classList.remove('guide-overlay--active');
    if (this.spotlightEl) this.spotlightEl.style.display = 'none';
    if (this.dialogueEl) this.dialogueEl.classList.remove('guide-dialogue--visible');
  }

  _spawnTrail() {
    if (!this.el || !this.layer) return;
    const def = spiritDefinitions[this.spiritId];
    if (!def) return;

    const trailClass = `spirit-trail spirit-trail--${def.trailType}`;
    const count = def.trailType === 'feather' ? 3 : def.trailType === 'ripple' ? 2 : 5;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = trailClass;

      const startX = this.position.x + 24 + (Math.random() - 0.5) * 20;
      const startY = this.position.y + 48;
      p.style.left = `${startX}px`;
      p.style.top = `${startY}px`;

      this.layer.appendChild(p);

      // Animate each particle with slight delay
      const angle = (Math.random() - 0.5) * 60;
      const dist = 20 + Math.random() * 30;
      const endX = startX + Math.sin(angle * Math.PI / 180) * dist;
      const endY = startY + dist * 0.6;

      const keyframes = [
        { transform: 'translate(0, 0) scale(1)', opacity: 0.9 },
        { transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0.4)`, opacity: 0 },
      ];

      const anim = p.animate(keyframes, {
        duration: 500 + Math.random() * 300,
        delay: i * 80,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        fill: 'forwards',
      });

      anim.onfinish = () => p.remove();
    }
  }

  _clearTrail() {
    if (this._trailTimer) { clearInterval(this._trailTimer); this._trailTimer = null; }
  }
}

// ─── Singleton instance ──────────────────────────────────────────────────────

const guideSpiritLayer = new GuideSpiritLayer();

// ─── Selection screen integration ────────────────────────────────────────────

/**
 * Enhanced spirit selection: idle hovering on cards, hover-closer effect,
 * fly-out on selection, dimming of unselected cards.
 * Call from main.js bindSpirits after the grid is wired up.
 */
function initSpiritSelectionAnimations() {
  const grid = document.querySelector('.spirit-grid');
  const continueBtn = document.querySelector('[data-action="spirit-continue"]');
  if (!grid) return;

  // The idle floating is handled purely by CSS (spiritFloat on .spirit-portrait__img)

  // On selection: fly the spirit out of its card to beside Continue button
  function onSpiritSelected(spiritId) {
    // Dim unselected cards
    grid.querySelectorAll('.spirit-option').forEach(card => {
      if (card.dataset.spirit === spiritId) {
        card.classList.remove('is-dimmed');
      } else {
        card.classList.add('is-dimmed');
      }
    });

    // Create/update the guide spirit in the layer
    guideSpiritLayer.setSpirit(spiritId);

    // Fly from the selected card to beside Continue
    const selectedCard = grid.querySelector(`[data-spirit="${spiritId}"]`);
    if (selectedCard && continueBtn) {
      guideSpiritLayer.flyFromCard(selectedCard, continueBtn);
    }
  }

  // Listen for selection changes via subscribe
  subscribe((s, key) => {
    if (key === 'spirit' && s.spirit) {
      onSpiritSelected(s.spirit);
    }
  });
}

export {
  spiritDefinitions,
  getSpiritPlaceholder,
  getIngredientPlaceholder,
  guideSpiritLayer,
  GuideSpiritLayer,
  initSpiritSelectionAnimations,
  preloadSpiritAssets,
  SPIRIT_FOLDERS,
  STATES as SPIRIT_STATES,
};
