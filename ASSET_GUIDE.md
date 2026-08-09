# Asset Guide — Picnic Symphony

## Spirit Character Artwork

### Required Files

Place transparent PNG illustrations at these paths:

```
assets/spirits/bee-guide.png
assets/spirits/bird-guide.png
assets/spirits/dragonfly-guide.png
assets/spirits/butterfly-guide.png
```

### Specifications

| Property | Value |
|----------|-------|
| Format | PNG with transparency |
| Dimensions | 400×480 px (portrait) |
| Style | Hand-painted watercolor storybook |
| Background | Transparent |
| DPI | 72 (screen) |
| Max file size | 200 KB each |

### Style Notes

- Characters should look like illustrations from a children's picture book
- Warm, soft colors matching the app palette (cream, meadow green, lemon, pink)
- Friendly expressions, large eyes, rounded forms
- No photorealism, no 3D rendering, no pixel art
- Consistent style across all four characters

### Fallback Behavior

If a PNG is missing, the app displays a decorative botanical frame with the spirit's name and a small symbolic icon. No broken image indicators will appear.

### How to Replace

1. Place the PNG at the correct path listed above
2. The app reads paths from `src/spirits.js` — the asset manifest
3. No code changes needed; the fallback automatically yields to the real image
4. Clear browser cache if the old fallback still shows

## Ingredient Artwork (optional future upgrade)

The current ingredients use inline SVG illustrations. To replace with painted PNGs:

1. Create 180×160 px transparent PNGs
2. Update `src/ingredients.js` to reference image paths instead of inline SVG
3. Use `<img>` with `loading="lazy"` and meaningful `alt` text

## Compression

- Use tools like TinyPNG or Squoosh
- Target under 150 KB per spirit PNG
- SVGs should be minified (remove editor metadata)

## Attribution

If using externally created artwork, add credits to a `CREDITS.md` file in the project root.
