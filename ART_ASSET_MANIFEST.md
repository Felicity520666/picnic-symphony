# Art Asset Manifest

## Spirit Guide Artwork

Each spirit has a dedicated folder with eight state files:

```
assets/spirits/aurelia/     (Aurelia — golden honeybee, rhythm)
assets/spirits/lark/        (Lark — blue-cream songbird, melody)
assets/spirits/rill/        (Rill — icy-blue dragonfly, texture)
assets/spirits/iris/        (Iris — coral-pink butterfly, harmony)
```

### Files per spirit folder

| File | Usage |
|------|-------|
| `idle-left.png` | Resting, facing left |
| `idle-right.png` | Resting, facing right |
| `hover-left.webp` | Flying/moving, facing left |
| `hover-right.webp` | Flying/moving, facing right |
| `flutter-left.png` | Celebrating/excited, facing left |
| `flutter-right.png` | Celebrating/excited, facing right |
| `guide-left.png` | Guiding/pointing, facing left |
| `guide-right.png` | Guiding/pointing, facing right |

### Visual state mapping

| State | Asset used |
|-------|-----------|
| Idle/resting | `idle-{direction}.png` |
| Flying between targets | `hover-{direction}.webp` |
| Guiding/pointing at a control | `guide-{direction}.png` |
| Celebrating correct selection | `flutter-{direction}.png` |

### Direction rules

- Spirit on the RIGHT side of target → uses LEFT-facing asset (looks at target)
- Spirit on the LEFT side of target → uses RIGHT-facing asset (looks at target)
- Moving left → left-facing hover asset
- Moving right → right-facing hover asset

### Obsolete paths (DO NOT USE)

These flat paths no longer exist:
- ~~`assets/spirits/aurelia-bee.png`~~
- ~~`assets/spirits/lark-songbird.png`~~
- ~~`assets/spirits/rill-dragonfly.png`~~
- ~~`assets/spirits/iris-butterfly.png`~~

## Ingredients

```
assets/ingredients/{id}.png    (512×512, transparent RGBA)
```

IDs: watermelon, strawberry, cherry, grapes, blueberry, lemonade, peach, cupcake, cheese, honey, mint, sandwich

## Recipes

```
assets/recipes/{recipe-id}.png    (640×640)
```

## Backgrounds

```
assets/backgrounds/meadow-dawn.webp
assets/backgrounds/meadow-day.webp
assets/backgrounds/meadow-dusk.webp
assets/backgrounds/meadow-night.webp
```

## Overlays

```
assets/overlays/foreground-grass.png
assets/overlays/night-lantern.png
```

## Postcard

```
assets/postcard/picnic-basket.png
```
