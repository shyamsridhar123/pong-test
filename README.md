# Pong Game

A classic Pong game implementation using vanilla HTML5, CSS3, and JavaScript.

## Description

This is a browser-based recreation of the classic Pong game. Two players control paddles on opposite sides of the screen, trying to bounce a ball past their opponent to score points. The game features smooth gameplay, responsive controls, and a clean, modern design.

## Features

- **Two-player gameplay**: Play against a friend on the same keyboard
- **Responsive controls**: Smooth paddle movement with keyboard input
- **Score tracking**: Keep track of points for both players
- **Clean UI**: Modern styling with gradient background and smooth animations
- **HTML5 Canvas**: Leverages native Canvas API for optimal performance

## How to Play

### Setup

1. Clone or download this repository
2. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)
3. No build process or dependencies required!

### Controls

- **Player 1 (Left Paddle)**:
  - `W` - Move up
  - `S` - Move down

- **Player 2 (Right Paddle)**:
  - `↑` (Up Arrow) - Move up
  - `↓` (Down Arrow) - Move down

- **Game Controls**:
  - `SPACE` - Start/restart the game

### Rules

- The ball bounces off the top and bottom walls
- Score a point when the ball passes your opponent's paddle
- The ball speed slightly increases with paddle movement for dynamic gameplay
- First player to reach the desired score wins (no limit currently set)

## Technical Details

### Technologies Used

- **HTML5**: Semantic markup and Canvas element
- **CSS3**: Modern styling with flexbox, gradients, and responsive design
- **JavaScript (ES6+)**: Game logic, animation loop using `requestAnimationFrame`

### Browser Compatibility

Requires a modern browser with HTML5 Canvas support:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### File Structure

```
pong-test/
├── index.html      # Main HTML structure with Canvas element
├── styles.css      # Styling and layout
├── game.js         # Game logic and rendering
└── README.md       # This file
```

## Development

### Making Changes

1. Edit the game logic in `game.js`
2. Modify styling in `styles.css`
3. Update HTML structure in `index.html`
4. Refresh your browser to see changes

### Key Game Components

- **Canvas Setup**: 800x600px game area
- **Game Loop**: Uses `requestAnimationFrame` for smooth 60fps animation
- **Collision Detection**: Simple AABB (Axis-Aligned Bounding Box) collision
- **State Management**: Object-based game state tracking

## Future Enhancements

Potential features to add:

- [x] Single-player mode with AI opponent
- [x] Difficulty levels
- [ ] Sound effects and background music
- [ ] Power-ups and special abilities
- [ ] Mobile touch controls
- [ ] Winning condition and game over screen
- [ ] Pause functionality
- [ ] Customizable paddle and ball colors

## Contributing

This is an open-source project. Feel free to fork, modify, and submit pull requests!

## License

This project is open source and available for educational purposes.

## Credits

Classic Pong game concept by Atari (1972)  
Modern implementation by the contributors of this repository

---

**Enjoy the game!** 🎮🏓
