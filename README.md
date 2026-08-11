# Picnic Symphony

## About the Game

Picnic Symphony is a whimsical interactive music-making website set at a magical summer picnic. Click the illustrated picnic treats to turn synchronized layers on and off while Mimi the fairy guides the scene.

## Features

- Original watercolor-style HTML, CSS, and SVG artwork
- Six synchronized procedural sound layers using the native Web Audio API
- Start, play/pause, clear mix, help, and master volume controls
- Active layer counter, beat indicator, and musical recipe strip
- Responsive layout for desktop and mobile
- Keyboard-operable ingredient buttons with visible focus states
- Prefers-reduced-motion fallback

## How the Sound Works

The music runs from one shared 110 BPM sequencer clock. Each ingredient owns a repeating 16-step pattern, and clicking a button only toggles that layer on or off without resetting the other layers. All audio is generated live in the browser with oscillators, filtered noise, and short envelopes, then routed through a shared master gain stage to keep the mix gentle and prevent clipping.

## File Structure

- [index.html](index.html)
- [styles.css](styles.css)
- [app.js](app.js)
- [README.md](README.md)

## Run Locally

Use a simple local web server:

```bash
python3 -m http.server 5500
```

Then open [http://localhost:5500](http://localhost:5500/).

The artwork and procedural sounds are original and generated inside this project. No API key or installation is required.

