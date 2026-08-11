/**
 * composition.js — Dynamic ingredient composition with picnic basket.
 * Renders ingredients inside a watercolor basket for preview and export.
 * Uses assets/postcard/picnic-basket.png as the container.
 */

// ─── Asset URL helper ─────────────────────────────────────────────────────────

export function assetUrl(relativePath) {
  return new URL(`assets/${relativePath}`, document.baseURI).href;
}

// ─── Ingredient ID to file path mapping ───────────────────────────────────────

const INGREDIENT_FILES = {
  watermelon: 'ingredients/watermelon.png',
  strawberry: 'ingredients/strawberry.png',
  cherry: 'ingredients/cherry.png',
  grape: 'ingredients/grapes.png',
  grapes: 'ingredients/grapes.png',
  blueberry: 'ingredients/blueberry.png',
  lemonade: 'ingredients/lemonade.png',
  peach: 'ingredients/peach.png',
  cupcake: 'ingredients/cupcake.png',
  cheese: 'ingredients/cheese.png',
  honey: 'ingredients/honey.png',
  mint: 'ingredients/mint.png',
  sandwich: 'ingredients/sandwich.png',
};

const ROTATIONS = {
  watermelon: -4, strawberry: 5, cherry: -3, grape: 4, grapes: 4,
  blueberry: -5, lemonade: 2, peach: -3, cupcake: 3, cheese: -4,
  honey: 2, mint: 5, sandwich: -2,
};

// ─── Image loading ────────────────────────────────────────────────────────────

export async function loadImage(src) {
  const image = new Image();
  image.src = src;
  if (image.decode) {
    await image.decode();
  } else {
    await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; });
  }
  return image;
}

// ─── Basket-relative layout ───────────────────────────────────────────────────

// Normalized positions within basket interior [x%, y%] — center of each item
const LAYOUT_POSITIONS = {
  1: [[0.50, 0.50]],
  2: [[0.34, 0.50], [0.66, 0.50]],
  3: [[0.34, 0.36], [0.66, 0.36], [0.50, 0.68]],
  4: [[0.32, 0.34], [0.68, 0.34], [0.32, 0.68], [0.68, 0.68]],
  5: [[0.25, 0.34], [0.50, 0.30], [0.75, 0.34], [0.36, 0.70], [0.64, 0.70]],
  6: [[0.24, 0.33], [0.50, 0.29], [0.76, 0.33], [0.24, 0.69], [0.50, 0.73], [0.76, 0.69]],
};

// Size as fraction of interior width — much larger than before
const SIZE_RATIO = { 1: 0.44, 2: 0.34, 3: 0.30, 4: 0.28, 5: 0.24, 6: 0.22 };

/**
 * Compute ingredient positions relative to a basket bounding box.
 * Items fill 55-70% of the usable basket interior.
 */
export function getBasketIngredientLayout(ids, basketBounds) {
  const count = ids.length;
  if (count === 0) return [];

  // Basket interior — the usable area inside the basket
  const interior = {
    x: basketBounds.x + basketBounds.w * 0.16,
    y: basketBounds.y + basketBounds.h * 0.25,
    w: basketBounds.w * 0.68,
    h: basketBounds.h * 0.48,
  };

  const ratio = SIZE_RATIO[Math.min(count, 6)] || 0.22;
  const size = interior.w * ratio;
  const positions = LAYOUT_POSITIONS[Math.min(count, 6)] || LAYOUT_POSITIONS[6];

  return ids.slice(0, 6).map((id, i) => {
    const [px, py] = positions[i] || [0.5, 0.5];
    return {
      x: interior.x + interior.w * px - size / 2,
      y: interior.y + interior.h * py - size / 2,
      width: size,
      height: size,
      rotation: ROTATIONS[id] || 0,
    };
  });
}

// ─── Canvas drawing ───────────────────────────────────────────────────────────

function drawImageContained(ctx, image, box, rotation = 0) {
  const scale = Math.min(box.width / image.naturalWidth, box.height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;

  ctx.save();
  ctx.translate(box.x + box.width / 2, box.y + box.height / 2);
  if (rotation) ctx.rotate((rotation * Math.PI) / 180);

  ctx.shadowColor = 'rgba(80, 60, 40, 0.1)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 3;

  ctx.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
  ctx.restore();
}

/**
 * Render the full postcard composition with basket.
 * Hierarchy: background → brand → title → basket+ingredients → ingredient names
 */
export async function renderFullComposition(canvas, ingredientIds, options = {}) {
  const { isNight = false, title = '', spiritName = '' } = options;
  const W = canvas.width;
  const H = canvas.height;
  const ctx = canvas.getContext('2d');

  // Background
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  if (isNight) { bg.addColorStop(0, '#26324A'); bg.addColorStop(1, '#1c2e3e'); }
  else { bg.addColorStop(0, '#FFF8E8'); bg.addColorStop(1, '#f5f0dc'); }
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Soft border
  ctx.strokeStyle = isNight ? 'rgba(154,142,184,0.2)' : 'rgba(127,163,107,0.2)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(24, 24, W - 48, H - 48);
  ctx.setLineDash([]);

  // Brand label (small, top)
  ctx.fillStyle = isNight ? 'rgba(200,195,180,0.5)' : 'rgba(90,110,80,0.5)';
  ctx.font = '500 14px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '2px';
  ctx.fillText('PICNIC SYMPHONY', W / 2, 70);

  // Spirit badge (beside brand)
  if (spiritName) {
    ctx.font = '400 13px Nunito, sans-serif';
    ctx.fillStyle = isNight ? 'rgba(154,142,184,0.6)' : 'rgba(127,163,107,0.6)';
    ctx.fillText(spiritName, W / 2, 92);
  }

  // Main title (large)
  if (title) {
    ctx.fillStyle = isNight ? '#e8e4dc' : '#34423E';
    ctx.font = '600 38px Nunito, sans-serif';
    ctx.fillText(title, W / 2, 145);
  }

  // Load basket image
  let basketImg;
  try {
    basketImg = await loadImage(assetUrl('postcard/picnic-basket.png'));
  } catch (e) {
    console.error('Failed to load basket image');
  }

  // Basket bounds (centered, takes up middle portion)
  const basketW = W * 0.55;
  const basketH = basketW * (basketImg ? basketImg.naturalHeight / basketImg.naturalWidth : 0.75);
  const basketX = (W - basketW) / 2;
  const basketY = 180;
  const basketBounds = { x: basketX, y: basketY, w: basketW, h: basketH };

  // Draw basket base
  if (basketImg) {
    ctx.drawImage(basketImg, basketX, basketY, basketW, basketH);
  }

  // Draw ingredients inside basket
  if (ingredientIds.length > 0) {
    const layout = getBasketIngredientLayout(ingredientIds, basketBounds);
    const images = await Promise.all(
      ingredientIds.map(async id => {
        const file = INGREDIENT_FILES[id];
        if (!file) return null;
        try { return { id, image: await loadImage(assetUrl(file)) }; }
        catch (e) { return null; }
      })
    );
    const valid = images.filter(Boolean);
    valid.forEach((item, i) => {
      if (layout[i]) drawImageContained(ctx, item.image, layout[i], layout[i].rotation);
    });
  }

  // Draw basket front rim (bottom 36% clipped)
  if (basketImg) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(basketX, basketY + basketH * 0.64, basketW, basketH * 0.36);
    ctx.clip();
    ctx.drawImage(basketImg, basketX, basketY, basketW, basketH);
    ctx.restore();
  }

  // Ingredient names at bottom
  ctx.textAlign = 'center';
  ctx.font = '600 22px Nunito, Noto Sans, sans-serif';
  ctx.fillStyle = isNight ? '#b8c4b8' : '#4a5e4a';
  const nameStr = ingredientIds.map(id => {
    const cap = id.charAt(0).toUpperCase() + id.slice(1);
    return cap === 'Grape' ? 'Grapes' : cap;
  }).join(' · ');
  const nameY = basketY + basketH + 50;
  ctx.fillText(nameStr, W / 2, Math.min(nameY, H - 40));
}

// Keep backward compat exports
export { getBasketIngredientLayout as getIngredientLayout };
export async function renderIngredientComposition(ctx, ids, opts) {
  // Legacy — now handled inside renderFullComposition
  const layout = getBasketIngredientLayout(ids, { x: 0, y: 0, w: opts.width, h: opts.height });
  const images = await Promise.all(ids.map(async id => {
    const file = INGREDIENT_FILES[id];
    if (!file) return null;
    try { return { id, image: await loadImage(assetUrl(file)) }; } catch (e) { return null; }
  }));
  images.filter(Boolean).forEach((item, i) => {
    if (layout[i]) drawImageContained(ctx, item.image, layout[i], layout[i].rotation);
  });
}
