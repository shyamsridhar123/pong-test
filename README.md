# Pong Game with Sound Effects 🏓🔊

A classic Pong game implementation with retro-style sound effects using the Web Audio API.

## Features

✅ **Sound Effects**
- 🎵 Paddle hit sound (square wave beep)
- 🎵 Wall bounce sound (sine wave beep)
- 🎵 Score sound (ascending melody)
- 🎵 Game over sound (descending melody)
- 🎵 Win sound (triumphant melody)

✅ **Gameplay**
- Single-player vs AI
- Collision detection for paddles and walls
- Score tracking (first to 5 wins)
- Progressive ball speed increase
- Paddle spin mechanics

✅ **Controls**
- **W / Arrow Up**: Move paddle up
- **S / Arrow Down**: Move paddle down
- **SPACE**: Start/restart game
- **M**: Toggle mute/unmute sound

## Technical Implementation

### Web Audio API
All sounds are generated programmatically using the Web Audio API for low-latency playback:
- **Oscillators**: Generate tones at specific frequencies
- **Gain Nodes**: Control volume and create envelopes
- **No audio files required**: All sounds are synthesized in real-time

### Sound Design
- **Paddle Hit**: 440Hz square wave, 0.1s duration (retro beep)
- **Wall Bounce**: 220Hz sine wave, 0.1s duration (softer beep)
- **Score**: C-E-G ascending arpeggio (262-330-392 Hz)
- **Game Over**: G-E-C descending melody (sad trombone effect)
- **Win**: C-E-G-C ascending melody with longer final note (triumphant)

### Collision Detection
Accurate AABB (Axis-Aligned Bounding Box) collision detection:
- Paddle collision with velocity checks to prevent double-hits
- Wall collision with boundary correction
- Hit position affects ball trajectory (spin mechanics)

### AI Opponent
Simple but challenging AI:
- Tracks ball Y position
- Moves at 70% of player speed for fairness
- Has dead zone to prevent perfect tracking

## How to Play

1. Open `index.html` in a modern web browser
2. Press **SPACE** to start the game
3. Use **W/S** or **Arrow Keys** to move your paddle
4. First player to score 5 points wins!
5. Press **M** to mute/unmute sound effects

## Browser Compatibility

Requires a modern browser with Web Audio API support:
- Chrome 35+
- Firefox 25+
- Safari 14.1+
- Edge 12+

## File Structure

```
pong-test/
├── index.html          # Game HTML structure and styles
├── game.js             # Main game logic, collision detection, scoring
├── audioManager.js     # Web Audio API sound generation
└── README.md          # This file
```

## Development

No build process required! Just open `index.html` in a browser.

The game uses ES6 modules, so it must be served over HTTP (not `file://`) for module imports to work. You can use:

```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server

# VS Code Live Server extension
```

Then navigate to `http://localhost:8000`

## License

MIT

## Credits

Created with ❤️ using vanilla JavaScript and Web Audio API
