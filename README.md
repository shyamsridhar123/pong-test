# Pong Game

A classic Pong game built with HTML5, CSS3, and vanilla JavaScript.

## Features

- ✅ HTML5 Canvas-based game rendering
- ✅ Player paddle with keyboard controls (W/S or Arrow keys)
- ✅ AI opponent paddle
- ✅ Ball with realistic physics (movement, wall bouncing, paddle collision)
- ✅ Score tracking and display
- ✅ Game states (start screen, playing, pause, game over)
- ✅ First to 11 points wins
- ✅ Retro/classic Pong aesthetic
- ✅ Smooth 60fps rendering with requestAnimationFrame

## How to Play

1. Open `index.html` in a modern web browser
2. Press **SPACE** to start the game
3. Use **W** and **S** keys (or **Arrow Up/Down**) to move your paddle
4. Press **P** or **ESC** to pause/resume the game
5. First player to reach 11 points wins!

## Controls

- **W / Arrow Up**: Move paddle up
- **S / Arrow Down**: Move paddle down
- **SPACE**: Start/Restart game
- **P / ESC**: Pause/Resume game

## Technical Details

- Pure vanilla JavaScript (no frameworks)
- HTML5 Canvas for rendering
- 60fps game loop using `requestAnimationFrame`
- Responsive paddle physics with ball spin
- AI opponent with intelligent tracking

## Development

```bash
# Install dependencies (none required for basic game)
npm install

# Run tests
npm test

# Open in browser
# Simply open index.html in your browser
```

## Browser Compatibility

Works in all modern browsers that support HTML5 Canvas:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT
