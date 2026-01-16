# Pong Game - Collision Detection System

This implementation provides a complete collision detection system for a Pong game, featuring ball-paddle interactions with realistic physics.

## Features

### ✅ Implemented Acceptance Criteria

- **Ball-Paddle Collision Detection**
  - ✅ Detect collision between ball and left paddle (player)
  - ✅ Detect collision between ball and right paddle (AI/player 2)
  - ✅ Ball bounces back with appropriate angle on paddle hit
  - ✅ Vary bounce angle based on where ball hits paddle (top/middle/bottom)
  - ✅ Add slight speed increase on each paddle hit
  - ✅ Prevent ball from passing through paddle at high speeds

### Technical Implementation

- **AABB (Axis-Aligned Bounding Box) Collision Detection**: Efficient collision detection using bounding boxes
- **Angle Calculation**: Bounce angle varies from 0° (center hit) to ±60° (edge hits)
- **Speed Progression**: 5% speed increase per paddle hit to increase difficulty
- **High-Speed Protection**: Ball repositioning prevents tunneling through paddles

## Project Structure

```
pong-test/
├── index.html          # Main game HTML file
├── ball.js             # Ball class with physics
├── paddle.js           # Paddle class with movement
├── collision.js        # Collision detection system
├── game.js             # Main game loop and logic
├── collision.test.js   # Comprehensive test suite
└── package.json        # Project configuration
```

## How to Play

1. **Open the game**: Open `index.html` in a web browser
2. **Controls**:
   - **Left Paddle**: W (up) / S (down)
   - **Right Paddle**: Arrow Up / Arrow Down
   - **Pause**: Spacebar

## Running Tests

```bash
# Install dependencies
npm install

# Run tests
npm test
```

## Collision Detection Details

### AABB Algorithm

The collision detector uses Axis-Aligned Bounding Box (AABB) detection:

```javascript
collision = (ball.left < paddle.right) &&
            (ball.right > paddle.left) &&
            (ball.top < paddle.bottom) &&
            (ball.bottom > paddle.top)
```

### Bounce Angle Calculation

The bounce angle is calculated based on where the ball hits the paddle:

- **Center hit**: Ball travels horizontally (0° angle)
- **Top hit**: Ball bounces upward (up to 60°)
- **Bottom hit**: Ball bounces downward (up to 60°)

```
Paddle:  ┌─┐
         │█│ ← Top hit: -60° angle
         │ │
         │ │ ← Center hit: 0° angle
         │ │
         │█│ ← Bottom hit: +60° angle
         └─┘
```

### Speed Increase

Each successful paddle hit increases ball speed by 5%:
```javascript
newSpeed = currentSpeed * 1.05
```

### High-Speed Protection

When the ball moves fast enough to potentially pass through a paddle in one frame, the collision system repositions the ball to prevent "tunneling":

```javascript
if (collision) {
    // Reposition ball to prevent tunneling
    ball.x = paddle.isLeft 
        ? paddle.right + ball.radius  // Push right
        : paddle.left - ball.radius;   // Push left
}
```

## Test Coverage

The test suite (`collision.test.js`) covers:

- Ball creation and physics
- Paddle movement and boundaries
- AABB collision detection
- Ball-paddle collision detection (both paddles)
- Bounce angle variation (top/center/bottom hits)
- Speed increase mechanism
- High-speed tunneling prevention
- Wall collision detection
- Score detection

## Dependencies

- **jest**: Testing framework (v29.0.0)

## Future Enhancements

Potential improvements could include:

- AI opponent for single-player mode
- Sound effects for collisions
- Particle effects
- Power-ups
- Multiple difficulty levels
- Mobile touch controls

## Credits

Implements requirements from issue #42 (Collision Detection: Ball-Paddle Collision System)
- Depends on issue #38 (Player Paddle)
- Depends on issue #40 (Ball)
