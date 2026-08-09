/**
 * spirits.js — Four guiding spirit definitions.
 * Names: Aurelia (bee), Lark (songbird), Rill (dragonfly), Iris (butterfly).
 * PNG asset paths with elegant SVG silhouette fallback (no emoji).
 */

const spiritDefinitions = {
  bee: {
    id: 'bee',
    name: 'Aurelia',
    nameKey: 'spirit.bee.name',
    personalityKey: 'spirit.bee.personality',
    image: 'assets/spirits/aurelia-bee.png',
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
    nameKey: 'spirit.bird.name',
    personalityKey: 'spirit.bird.personality',
    image: 'assets/spirits/lark-songbird.png',
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
    nameKey: 'spirit.dragonfly.name',
    personalityKey: 'spirit.dragonfly.personality',
    image: 'assets/spirits/rill-dragonfly.png',
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
    nameKey: 'spirit.butterfly.name',
    personalityKey: 'spirit.butterfly.personality',
    image: 'assets/spirits/iris-butterfly.png',
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

/**
 * Create an elegant placeholder SVG for a missing spirit image.
 * Returns an SVG data URI showing a tinted botanical silhouette with name.
 */
function getSpiritPlaceholder(spiritId) {
  const spirit = spiritDefinitions[spiritId];
  if (!spirit) return '';
  const color = spirit.fallbackColor;
  // Silhouette shapes per spirit type
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

/**
 * Get ingredient placeholder SVG (no emoji, tinted silhouette with name).
 */
function getIngredientPlaceholder(ingredientId, color, name) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="120" height="120">
    <rect width="100" height="100" rx="16" fill="${color}" opacity="0.08"/>
    <circle cx="50" cy="44" r="22" fill="${color}" opacity="0.15"/>
    <circle cx="50" cy="44" r="16" fill="${color}" opacity="0.1"/>
    <text x="50" y="82" text-anchor="middle" font-family="sans-serif" font-size="7" fill="${color}" opacity="0.8">${name}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export { spiritDefinitions, getSpiritPlaceholder, getIngredientPlaceholder };
