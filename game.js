/**
 * Pong Game - Ball Physics Implementation
 * 
 * This file implements the Ball class with physics-based movement,
 * collision detection, and bouncing behavior.
 */

class Ball {
    /**
     * Create a ball with position, velocity, and radius
     * @param {number} x - Initial x position
     * @param {number} y - Initial y position
     * @param {number} radius - Ball radius
     */
    constructor(x, y, radius = 10) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 5; // Initial moderate speed
        this.maxSpeed = 10; // Maximum speed limit
    }

    /**
     * Initialize ball with random direction
     */
    reset(canvasWidth, canvasHeight) {
        // Reset to center
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;

        // Randomize initial direction
        // Random angle between -45 and 45 degrees, or 135 and 225 degrees
        const angle = Math.random() < 0.5 
            ? (Math.random() * Math.PI / 2 - Math.PI / 4)  // -45 to 45 degrees
            : (Math.random() * Math.PI / 2 + 3 * Math.PI / 4); // 135 to 225 degrees

        // Set velocity based on angle and speed
        this.velocityX = Math.cos(angle) * this.speed;
        this.velocityY = Math.sin(angle) * this.speed;
    }

    /**
     * Update ball position based on velocity
     */
    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

    /**
     * Check collision with top and bottom walls
     * @param {number} canvasHeight - Canvas height
     */
    checkWallCollision(canvasHeight) {
        // Top wall collision
        if (this.y - this.radius <= 0) {
            this.y = this.radius;
            this.velocityY = Math.abs(this.velocityY); // Reflect down
        }
        
        // Bottom wall collision
        if (this.y + this.radius >= canvasHeight) {
            this.y = canvasHeight - this.radius;
            this.velocityY = -Math.abs(this.velocityY); // Reflect up
        }
    }

    /**
     * Check if ball passed left or right boundary (scoring)
     * @param {number} canvasWidth - Canvas width
     * @returns {string|null} 'left', 'right', or null
     */
    checkScoring(canvasWidth) {
        if (this.x - this.radius <= 0) {
            return 'left'; // Ball passed left boundary
        }
        if (this.x + this.radius >= canvasWidth) {
            return 'right'; // Ball passed right boundary
        }
        return null;
    }

    /**
     * Render ball on canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Increase ball speed (can be called when paddle hits)
     */
    increaseSpeed() {
        if (this.speed < this.maxSpeed) {
            this.speed += 0.5;
            
            // Update velocity maintaining direction
            const angle = Math.atan2(this.velocityY, this.velocityX);
            this.velocityX = Math.cos(angle) * this.speed;
            this.velocityY = Math.sin(angle) * this.speed;
        }
    }
}

// Game setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Create ball instance
const ball = new Ball(canvas.width / 2, canvas.height / 2);

// Initialize ball with random direction
ball.reset(canvas.width, canvas.height);

/**
 * Game loop
 */
function gameLoop() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update ball
    ball.update();

    // Check wall collisions
    ball.checkWallCollision(canvas.height);

    // Check scoring
    const score = ball.checkScoring(canvas.width);
    if (score) {
        // Ball went out of bounds - reset
        ball.reset(canvas.width, canvas.height);
    }

    // Render ball
    ball.render(ctx);

    // Continue loop
    requestAnimationFrame(gameLoop);
}

// Start game loop
gameLoop();
