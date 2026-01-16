# Pong Game

A classic Pong game implementation using HTML5, CSS, and JavaScript.

## Features

- 🎮 Canvas-based rendering with smooth 60fps animation
- 🤖 AI opponent with adjustable difficulty
- ⚡ Progressive ball speed increase
- ⌨️ Dual control schemes (W/S or Arrow keys)
- 🏆 First to 10 points wins
- ⏸️ Pause/Resume with Space bar
- 🔄 Game reset functionality
- 📱 Responsive design

## How to Play

1. Open `index.html` in any modern web browser
2. Use **W/S** or **Arrow Up/Down** keys to move your paddle
3. Press **Space** to pause/resume
4. First player to reach 10 points wins!

## Technical Details

- **Single file**: All code is contained in `index.html`
- **No dependencies**: Pure HTML5, CSS3, and vanilla JavaScript
- **Animation**: Uses `requestAnimationFrame` for smooth 60fps gameplay
- **Physics**: Realistic ball bouncing with angle variation based on paddle hit position

## Game Mechanics

- Ball speed increases with each paddle hit (capped at maximum speed)
- AI difficulty: 70% of player paddle speed
- Ball angle varies based on where it hits the paddle
- Scores reset after each round

## Development

```bash
# Install dependencies (optional, for local server)
npm install

# Run tests (placeholder for manual testing)
npm test

# Start local server (requires http-server)
npm start
```

## Screenshots

See the game in action in the [Pull Request](../../pulls).

## License

MIT
