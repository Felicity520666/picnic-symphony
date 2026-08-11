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

const SCALE_BY_COUNT = { 1: 0.52, 2: 0.4, 3: 0.34, 4: 0.29, 5: 0.26, 6: 0.23 };

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

/**
 * Compute ingredient positions relative to a basket bounding box.
 * Basket interior is roughly the central 70% width and 50% height of the image.
 */
export function getBasketIngredientLayout(ids, basketBounds) {
  const count = ids.length;
  if (count === 0) return [];

  // Interior of basket (centered, upper portion)
  const interior = {
    x: basketBounds.x + basketBounds.w * 0.15,
    y: basketBounds.y + basketBounds.h * 0.12,
    w: basketBounds.w * 0.7,
    h: basketBounds.h * 0.52,
  };

  const scale = SCALE_BY_COUNT[count] || 0.23;
  const size = Math.min(interior.w, interior.h) * scale;
  const cx = interior.x + interior.w / 2;
  const cy = interior.y + interior.h / 2;

  const layouts = [];

  if (count === 1) {
    layouts.push({ x: cx - size / 2, y: cy - size / 2, width: size, height: size, rotation: ROTATIONS[ids[0]] || 0 });
  } else if (count === 2) {
    const gap = size * 0.6;
    layouts.push(
      { x: cx - size - gap / 2 + size / 2, y: cy - size / 2, width: size, height: size, rotation: ROTATIONS[ids[0]] || 0 },
      { x: cx + gap / 2 - size / 2 + size / 2, y: cy - size / 2 + size * 0.08, width: size, height: size, rotation: ROTATIONS[ids[1]] || 0 },
    );
  } else if (count === 3) {
    layouts.push(
      { x: cx - size / 2, y: cy - size * 0.7, width: size, height: size, rotation: ROTATIONS[ids[0]] || 0 },
      { x: cx - size * 1.0, y: cy + size * 0.05, width: size, height: size, rotation: ROTATIONS[ids[1]] || 0 },
      { x: cx + size * 0.1, y: cy + size * 0.1, width: size, height: size, rotation: ROTATIONS[ids[2]] || 0 },
    );
  } else if (count === 4) {
    const gapX = size * 0.35;
    const gapY = size * 0.3;
    layouts.push(
      { x: cx - size - gapX / 2, y: cy - size / 2 - gapY / 2, width: size, height: size, rotation: ROTATIONS[ids[0]] || 0 },
      { x: cx + gapX / 2, y: cy - size / 2 - gapY / 2 + size * 0.06, width: size, height: size, rotation: ROTATIONS[ids[1]] || 0 },
      { x: cx - size - gapX / 2 + size * 0.08, y: cy + gapY / 2, width: size, height: size, rotation: ROTATIONS[ids[2]] || 0 },
      { x: cx + gapX / 2 - size * 0.05, y: cy + gapY / 2 + size * 0.06, width: size, height: size, rotation: ROTATIONS[ids[3]] || 0 },
    );
  } else if (count === 5) {
    const row1Y = cy - size * 0.6;
    const row2Y = cy + size * 0.25;
    const spread = size * 1.1;
    layouts.push(
      { x: cx - spread, y: row1Y, width: size, height: size, rotation: ROTATIONS[ids[0]] || 0 },
      { x: cx - size / 2, y: row1Y - size * 0.1, width: size, height: size, rotation: ROTATIONS[ids[1]] || 0 },
      { x: cx + spread - size, y: row1Y + size * 0.05, width: size, height: size, rotation: ROTATIONS[ids[2]] || 0 },
      { x: cx - size * 0.8, y: row2Y, width: size, height: size, rotation: ROTATIONS[ids[3]] || 0 },
      { x: cx + size * 0.0, y: row2Y + size * 0.05, width: size, height: size, rotation: ROTATIONS[ids[4]] || 0 },
    );
  } else {
    // 6: 3×2
    const gapX = size * 0.25;
    const gapY = size * 0.2;
    const totalW = size * 3 + gapX * 2;
    const startX = cx - totalW / 2;
    const startY = cy - size - gapY / 2;
    for (let i = 0; i < Math.min(count, 6); i++) {
      const col = i % 3;
      const row = Math.floor(i / 3);
      layouts.push({
        x: startX + col * (size + gapX),
        y: startY + row * (size + gapY) + (col === 1 ? size * 0.06 : 0),
        width: size, height: size,
        rotation: ROTATIONS[ids[i]] || 0,
      });
    }
  }

  return layouts;
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
  ctx.font = '500 16px Nunito, sans-serif';
  ctx.fillStyle = isNight ? '#a8b4a8' : '#5f6d5f';
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
