# Picnic Symphony 🧺

## About

Picnic Symphony is an interactive music-making website set at a cozy summer picnic. Select picnic ingredients to layer synchronized sound loops, follow guided recipes, and let your chosen spirit guide the experience.

## Features

- Original watercolor-style artwork (PNG, WebP)
- Twelve ingredients, each with a unique synthesized sound, supporting up to six simultaneous layers
- Procedural audio powered by the native Web Audio API
- Four spirit guides: Aurelia (honeybee), Lark (songbird), Rill (dragonfly), Iris (butterfly)
- Nine guided recipes with illustrated cards and real-time validation
- Day, Night, Dawn, and Dusk backgrounds (Auto mode follows local time)
- Downloadable postcard with dynamic ingredient illustrations and PNG export
- Downloadable WAV audio export with configurable tempo, volume, and loop count
- Nine languages: English, 简体中文, Español, Français, Deutsch, 日本語, हिन्दी, العربية, 한국어
- Responsive layout for desktop, tablet, and mobile
- Keyboard-accessible controls with visible focus states
- Reduced-motion support for users who prefer less animation

## How the Sound Works

The music is driven by a shared sequencer clock running at 96 BPM by default. Each ingredient has a repeating 16-step pattern, and clicking a card toggles that layer on or off without interrupting the others. All audio is generated live in the browser using oscillators, filtered noise, and short envelopes, then routed through per-bus gains and a master compressor to keep the mix balanced. The same synthesis engine powers both live playback and offline WAV export.

## File Structure

```
index.html          — Main page
styles.css          — All styles
src/
  main.js           — Application entry point
  audio.js          — Audio engine and sequencer
  audio-export.js   — Offline WAV rendering and export
  ingredients.js    — 12 ingredient definitions with synthesis
  recipes.js        — 9 recipe definitions
  spirits.js        — Spirit guide system and artwork states
  composition.js    — Postcard canvas renderer
  i18n.js           — Translations (9 languages)
  i18n-recipes.js   — Recipe translations
  state.js          — Application state management
  router.js         — Screen navigation
  theme.js          — Day/Night/Dawn/Dusk theme logic
  particles.js      — Decorative particles
assets/
  ingredients/      — 12 ingredient PNGs (512×512, transparent)
  recipes/          — 9 recipe illustration PNGs (640×640)
  spirits/          — Spirit guide directional assets (8 per spirit)
  backgrounds/      — 4 meadow scene backgrounds (WebP)
  overlays/         — Foreground grass, night lantern
  postcard/         — Picnic basket PNG for composition export
```

## Run Locally

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000/).

All artwork and sounds are included in this project. No API keys, external services, or package installation are required.

## Play Online

This project is hosted on GitHub Pages:  
[https://felicity520666.github.io/picnic-symphony/](https://felicity520666.github.io/picnic-symphony/)

## Screenshots

![Picnic Symphony Screenshot](assets/screenshots/1.png)
![Picnic Symphony Screenshot](assets/screenshots/2.png)
![Picnic Symphony Screenshot](assets/screenshots/3.png)

## Creator

- Felicity Yan — [github.com/Felicity520666](https://github.com/Felicity520666)

### How I Used ChatGPT and Kiro as Development Assistants

Picnic Symphony is my original game concept. I developed its central idea: turning picnic ingredients into musical layers so that composing a song feels like packing a picnic basket. I also designed the overall user journey, the four guiding spirits and their musical roles, the Free Composition and Guided Recipe modes, the visual atmosphere, the multilingual experience, and the postcard and audio-export features.

I used ChatGPT and Kiro as development assistants to help turn these ideas into a fully functional web application.

#### How I Used ChatGPT

I used ChatGPT primarily for brainstorming, writing natural-sounding translations, refining interface copy, and debugging specific technical questions during development.

#### How I Used Kiro

I used Kiro as an AI-powered coding partner inside my IDE. It helped me translate detailed feature specifications into working code, implement responsive layouts, build the audio engine, create the localization system, and iterate on bug fixes. I made the creative and design decisions, reviewed all generated changes, tested edge cases, and refined the final experience.
