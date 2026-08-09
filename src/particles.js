/**
 * particles.js — Spirit-specific cursor trails.
 * Pollen (bee), feathers (bird), ripples (dragonfly), petals (butterfly).
 * Disabled on touch devices and prefers-reduced-motion.
 */

import { state } from './state.js';

const MAX_PARTICLES = 20;
const THROTTLE_MS = 40;

let particles = [];
let container = null;
let lastEmit = 0;
let animId = null;
let enabled = false;

const TRAIL_CONFIG = {
  pollen: {
    colors: ['#ffd54f', '#ffe082', '#fff8e1', '#ffb300'],
    sizeRange: [4, 8],
    lifetime: 600,
    shape: 'circle',
  },
  feather: {
    colors: ['#ffcc80', '#ffe0b2', '#fff3e0', '#ffab40'],
    sizeRange: [6, 12],
    lifetime: 800,
    shape: 'feather',
  },
  ripple: {
    colors: ['#4dd0e1', '#80deea', '#b2ebf2', '#26c6da'],
    sizeRange: [6, 14],
    lifetime: 700,
    shape: 'ripple',
  },
  petal: {
    colors: ['#ce93d8', '#f3e5f5', '#e1bee7', '#ba68c8'],
    sizeRange: [5, 10],
    lifetime: 750,
    shape: 'petal',
  },
};

/** Initialize the particle system */
function initParticles() {
  // Don't run on touch-only devices
  if (window.matchMedia('(pointer: coarse)').matches) return;
  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  container = document.createElement('div');
  container.className = 'particle-container';
  container.setAttribute('aria-hidden', 'true');
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9990;overflow:hidden;';
  document.body.appendChild(container);

  enabled = true;
  document.addEventListener('mousemove', onMouseMove, { passive: true });
  animate();
}

function onMouseMove(e) {
  if (!enabled) return;
  const now = performance.now();
  if (now - lastEmit < THROTTLE_MS) return;
  lastEmit = now;

  emitParticle(e.clientX, e.clientY);
}

function emitParticle(x, y) {
  if (particles.length >= MAX_PARTICLES) return;

  const spiritDef = state.spirit ? TRAIL_CONFIG[getTrailType()] : TRAIL_CONFIG.pollen;
  const config = spiritDef || TRAIL_CONFIG.pollen;

  const size = config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]);
  const color = config.colors[Math.floor(Math.random() * config.colors.length)];

  const el = document.createElement('span');
  el.className = `particle particle--${config.shape}`;
  el.style.cssText = `
    position: absolute;
    left: ${x}px; top: ${y}px;
    width: ${size}px; height: ${size}px;
    background: ${color};
    border-radius: ${config.shape === 'petal' ? '50% 0 50% 50%' : config.shape === 'feather' ? '50% 50% 50% 0' : '50%'};
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1) rotate(${Math.random() * 360}deg);
    pointer-events: none;
    transition: none;
  `;

  if (config.shape === 'ripple') {
    el.style.background = 'transparent';
    el.style.border = `1.5px solid ${color}`;
    el.style.borderRadius = '50%';
  }

  container.appendChild(el);

  const particle = {
    el,
    x, y,
    vx: (Math.random() - 0.5) * 1.2,
    vy: -0.5 - Math.random() * 0.8,
    life: config.lifetime,
    maxLife: config.lifetime,
    size,
    shape: config.shape,
  };

  particles.push(particle);
}

function getTrailType() {
  const spiritId = state.spirit;
  if (!spiritId) return 'pollen';
  const map = { bee: 'pollen', bird: 'feather', dragonfly: 'ripple', butterfly: 'petal' };
  return map[spiritId] || 'pollen';
}

function animate() {
  const dt = 16; // ~60fps frame budget

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= dt;

    if (p.life <= 0) {
      p.el.remove();
      particles.splice(i, 1);
      continue;
    }

    const progress = 1 - p.life / p.maxLife;
    p.x += p.vx;
    p.y += p.vy;

    const scale = p.shape === 'ripple' ? 1 + progress * 2 : 1 - progress * 0.5;
    const opacity = 0.8 * (1 - progress);

    p.el.style.left = `${p.x}px`;
    p.el.style.top = `${p.y}px`;
    p.el.style.opacity = opacity;
    p.el.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${progress * 120}deg)`;
  }

  animId = requestAnimationFrame(animate);
}

/** Clean up */
function destroyParticles() {
  enabled = false;
  document.removeEventListener('mousemove', onMouseMove);
  if (animId) cancelAnimationFrame(animId);
  if (container) container.remove();
  particles = [];
}

export { initParticles, destroyParticles };
