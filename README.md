# Pong Game with State Management

A classic Pong game implementation with comprehensive game state management, featuring start screens, pause functionality, and game over screens.

## Features

### Game States
- **MENU**: Start/title screen with instructions
- **PLAYING**: Active gameplay
- **PAUSED**: Pause overlay with resume instructions
- **GAME_OVER**: End screen showing winner and final score

### Gameplay
- Two-player local multiplayer
- First player to 11 points wins (classic Pong rules)
- Ball speed increases with each paddle hit
- Responsive paddle controls

### Controls
- **Player 1**: W (up) / S (down)
- **Player 2**: Arrow Up / Arrow Down
- **SPACE**: Start game / Restart from game over
- **P or ESC**: Pause / Resume game

## Getting Started

### Installation

```bash
npm install
```

### Running the Game

Open `index.html` in a web browser, or use a local server:

```bash
npm start
```

Then open http://localhost:8080 in your browser.

### Testing

Run the test suite:

```bash
npm test
```

## Game States Flow

```
MENU (Start Screen)
  â"‚
  â""â"€ SPACE â"€â"€> PLAYING
                  â"‚
                  â"œâ"€ P/ESC â"€â"€> PAUSED
                  â"‚              â"‚
                  â"‚              â""â"€ P/ESC â"€â"€> PLAYING
                  â"‚
                  â""â"€ 11 points â"€> GAME_OVER
                                    â"‚
                                    â""â"€ SPACE â"€â"€> MENU
```

## Technical Implementation

### Architecture
- Pure JavaScript (ES6+)
- HTML5 Canvas API for rendering
- State machine pattern for game flow
- Request Animation Frame for smooth gameplay

### Game Components
- **Paddles**: Two player-controlled paddles with boundary checking
- **Ball**: Physics-based ball movement with collision detection
- **Score System**: Tracks points for both players
- **State Manager**: Controls game flow and screen transitions

## Acceptance Criteria

All requirements from the issue have been implemented:

- âœ… Game state machine (menu, playing, paused, gameOver)
- âœ… Start/title screen with 'Press SPACE to Start' message
- âœ… Pause functionality (P or ESC key)
- âœ… Pause overlay display
- âœ… Game over screen when score limit reached (11 points)
- âœ… Winner display on game over screen
- âœ… Restart functionality from game over screen

## Browser Compatibility

Works in all modern browsers that support:
- HTML5 Canvas
- ES6+ JavaScript features
- RequestAnimationFrame API

## License

MIT
