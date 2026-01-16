# Pong Game - Ball Physics Implementation

This project implements a Pong game with physics-based ball movement and collision detection.

## Features Implemented

### Ball Class
The `Ball` class includes the following functionality:

- **Position and Properties**: x, y coordinates, radius (default 10px), velocity vector
- **Rendering**: White circle rendered in the center of canvas
- **Movement**: Physics-based movement using velocity vector
- **Wall Collision**: Top and bottom boundary detection with proper angle reflection
- **Scoring Detection**: Detects when ball passes left or right boundaries
- **Reset Functionality**: Resets ball to center with randomized direction
- **Speed Control**: Moderate initial speed (5) with ability to increase over time (max 10)

### Physics Implementation

The ball uses vector mathematics for clean velocity calculations:
- Velocity components: `velocityX` and `velocityY`
- Wall reflection: Properly inverts Y velocity on top/bottom collisions
- Direction randomization: Random angles between -45° to 45° or 135° to 225°

## Files

- `index.html` - Game canvas setup and HTML structure
- `game.js` - Ball class implementation and game loop
- `game.test.js` - Comprehensive test suite for Ball class
- `package.json` - Project configuration and dependencies
- `jest.config.js` - Jest testing configuration

## Running the Game

### Prerequisites
- Node.js >= 18.0.0
- npm

### Installation
```bash
npm install
```

### Run Tests
```bash
npm test
```

### Start Game
```bash
npm start
```
Then open your browser to `http://localhost:8080`

Alternatively, open `index.html` directly in a web browser.

## Acceptance Criteria - Completed ✓

- [x] Create Ball class/object with position, velocity, and radius properties
- [x] Render ball as white circle in center of canvas
- [x] Implement ball movement based on velocity vector
- [x] Add wall collision detection (top and bottom boundaries)
- [x] Ball bounces off top/bottom walls with proper angle reflection
- [x] Ball resets to center after scoring (passing left/right boundary)
- [x] Randomize initial ball direction on reset

## Technical Details

- Ball radius: 10px
- Initial speed: 5 (moderate)
- Maximum speed: 10
- Canvas size: 800x600px
- Uses `requestAnimationFrame` for smooth animation
- Vector mathematics for velocity calculations

## Testing

The implementation includes 16 comprehensive tests covering:
- Constructor initialization
- Reset functionality
- Movement updates
- Wall collision detection and reflection
- Scoring boundary detection
- Rendering functionality
- Speed increase mechanics

All tests pass successfully.

## Dependencies

- **jest**: ^29.7.0 - Testing framework
- **jest-environment-jsdom**: ^29.7.0 - DOM environment for tests
