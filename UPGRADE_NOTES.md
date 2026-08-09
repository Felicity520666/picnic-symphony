# Picnic Symphony — Upgrade Notes

## Bugs Found in Pre-Upgrade Codebase

1. **Only 6 ingredients** — spec requires 12 distinct synchronized instruments
2. **Only 3 recipes** — spec requires 8+ with genuinely different moods/combos
3. **Recipes too similar** — all 3 share heavy ingredient overlap
4. **No i18n** — all strings hardcoded in English
5. **No day/night mode** — only one visual theme
6. **No tutorial system** — no onboarding spotlight
7. **No ambience bus** — only a single music master gain node
8. **No postcard/save** — no way to export a creation
9. **No tempo control** — fixed 110 BPM
10. **Spirit art is primitive SVG** — spec wants PNG asset system with fallbacks
11. **Cursor trail not spirit-specific** — same green dots for all spirits
12. **No localStorage persistence** — language, theme, completed recipes not saved
13. **Dead code** — `showHelpMessage()` still present after help button removal
14. **No manifest.webmanifest** — no PWA metadata
15. **No separate ambience volume** — user cannot mute ambience independently

## Working Features Preserved

- Web Audio look-ahead scheduler (16-step, shared clock)
- 6 working synthesized instrument voices (kick, bell arp, melody, chords, shaker, whistle)
- Recipe walkthrough with step tracking and ingredient recommendation
- Guide spirit selection with personality-specific messages
- Screen transitions (welcome → spirit select → game)
- Scene mood states that respond to active layer count
- Responsive layout with mobile breakpoints
- Accessible: semantic buttons, aria-pressed, aria-live, sr-only, focus rings
- Favicon (SVG)

## Architecture Plan

### File Structure (post-upgrade)

```
/
├── index.html              Single HTML shell
├── styles.css              All styles (tokens, screens, components, responsive, themes)
├── favicon.svg             App icon
├── manifest.webmanifest    PWA manifest
├── ASSET_GUIDE.md          How to replace artwork
├── UPGRADE_NOTES.md        This file
├── assets/
│   └── spirits/            PNG placeholders (bee, bird, dragonfly, butterfly)
└── src/
    ├── main.js             Entry: router, init, event binding
    ├── state.js            Central app state + localStorage persistence
    ├── router.js           Screen state machine + transitions
    ├── i18n.js             Translation dictionary (EN + ZH) + live switcher
    ├── audio.js            Audio engine: context, buses, scheduler, 12 instruments
    ├── ingredients.js      Ingredient definitions (id, name, pattern, synth fn, role)
    ├── recipes.js          8 recipe definitions
    ├── spirits.js          Spirit definitions + asset manifest
    ├── tutorial.js         Spotlight onboarding system
    ├── theme.js            Day/night mode logic
    ├── particles.js        Spirit-specific cursor trails
    ├── postcard.js         Canvas postcard generator
    └── ui.js               DOM helpers, render functions, component updates
```

### Implementation Phases

**Phase 1 — Core Architecture**
- State machine with screen enum
- Router with hash-based navigation
- i18n dictionary + live language switch
- Asset manifest for spirit PNGs
- localStorage persistence layer

**Phase 2 — Welcome + Spirit Selection + Theme**
- Welcome screen with EN/ZH copy
- Spirit selection with PNG fallback frames
- Day/night toggle (auto/day/night)
- Language switch component
- Smooth screen transitions

**Phase 3 — Audio Engine**
- Dual bus: music master + ambience master
- 12 ingredient synth functions
- Tempo control (80–140 BPM)
- Ambience layer with ducking
- Proper cleanup on clear/navigate

**Phase 4 — Picnic Studio**
- 12-ingredient grid (4×3)
- Transport controls: play/pause, clear, undo, surprise basket
- Per-ingredient volume or mute
- Spirit guide panel with speech bubble
- Spirit traveler in meadow
- Beat indicator

**Phase 5 — Recipe System**
- 8 distinct recipes with unique moods
- Free Mix vs Recipe Trails mode selection
- Recipe book screen
- Completion celebration + sticker
- Recipe progress persistence

**Phase 6 — Tutorial**
- Spotlight overlay with dimming
- Step-by-step with Next/Back/Skip
- Spirit positioned near target
- Resize-safe positioning
- Persisted completion state

**Phase 7 — Polish**
- Spirit-specific cursor trails
- Postcard generator (canvas → PNG download)
- Manifest + metadata
- Final responsive pass
- Performance audit (particle caps, node cleanup)

## Features Deferred (stretch)

- Audio recording/export
- Additional collectible stickers beyond recipe completion
- Advanced spirit movement AI
- Offline PWA caching (service worker)

## Manual Test Checklist

- [ ] Welcome screen renders in EN and ZH
- [ ] Language switch updates all text live
- [ ] Spirit selection works, PNG fallback shows gracefully
- [ ] Day/night toggle changes visuals smoothly
- [ ] Tutorial runs start-to-finish without misalignment
- [ ] All 12 ingredients produce distinct audible sound
- [ ] Multiple ingredients stay synchronized
- [ ] Pause/resume maintains sync
- [ ] Clear mix stops all audio nodes
- [ ] Tempo slider changes BPM without desync
- [ ] Ambience plays softly, ducks when music active
- [ ] Ambience mute works independently
- [ ] All 8 recipes have meaningfully different combinations
- [ ] Recipe completion triggers celebration
- [ ] Postcard generates and downloads as PNG
- [ ] Responsive: no overflow at 360px, 768px, 1440px
- [ ] Keyboard navigation works throughout
- [ ] prefers-reduced-motion disables animations
- [ ] No console errors on any screen
- [ ] localStorage persists language, theme, completed recipes
- [ ] Missing spirit PNGs show elegant fallback (not broken image)
