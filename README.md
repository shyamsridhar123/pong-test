# Pong Game

A classic Pong game implementation with a scoring system.

## Features

- **Two-player gameplay**: Play against a friend using keyboard controls
- **Score tracking**: Scores displayed prominently at the top of the screen
- **Retro arcade styling**: Large, readable font in retro style
- **Ball physics**: Realistic ball movement and paddle collision
- **Brief pause**: Game pauses briefly after each score

## Controls

- **Player 1 (Left Paddle)**: W (up) / S (down)
- **Player 2 (Right Paddle)**: Arrow Up / Arrow Down

## How to Play

1. Open `index.html` in a web browser
2. Use the controls to move your paddle
3. Try to get the ball past your opponent's paddle
4. First to... well, keep playing! (No win condition yet)

## Scoring System

- Each time the ball passes a player's side, the opponent scores a point
- Scores are displayed at the top of the screen:
  - Player 1 score on the left (1/4 from left edge)
  - Player 2 score on the right (3/4 from left edge)
- After scoring, the ball resets to the center
- There's a 1-second pause before the ball moves again

## Technical Implementation

- Pure vanilla JavaScript with HTML5 Canvas
- 60 FPS game loop using `requestAnimationFrame`
- Canvas size: 800x600 pixels
- Ball speed: 5 pixels per frame
- Paddle speed: 6 pixels per frame

## Files

- `index.html` - Main HTML structure with canvas element
- `game.js` - Complete game logic including physics, rendering, and scoring
- `package.json` - Project configuration

## Development

To run with a local server:

```bash
npm start
```

Or simply open `index.html` in your browser.
