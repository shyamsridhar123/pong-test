/**
 * Ball class representing the game ball
 */
class Ball {
    constructor(x, y, radius, velocityX, velocityY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
        this.initialSpeed = this.speed;
    }

    /**
     * Get ball bounding box for collision detection
     */
    getBounds() {
        return {
            left: this.x - this.radius,
            right: this.x + this.radius,
            top: this.y - this.radius,
            bottom: this.y + this.radius,
            centerX: this.x,
            centerY: this.y
        };
    }

    /**
     * Update ball position
     */
    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

    /**
     * Render the ball
     */
    render(ctx) {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Reset ball to center with random direction
     */
    reset(canvasWidth, canvasHeight) {
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;
        this.speed = this.initialSpeed;
        
        // Random direction
        const angle = (Math.random() * Math.PI / 2) - Math.PI / 4;
        const direction = Math.random() < 0.5 ? 1 : -1;
        
        this.velocityX = direction * this.speed * Math.cos(angle);
        this.velocityY = this.speed * Math.sin(angle);
    }

    /**
     * Bounce off top or bottom walls
     */
    bounceVertical() {
        this.velocityY = -this.velocityY;
    }

    /**
     * Increase ball speed slightly
     */
    increaseSpeed(factor = 1.05) {
        this.speed *= factor;
        const angle = Math.atan2(this.velocityY, this.velocityX);
        this.velocityX = this.speed * Math.cos(angle);
        this.velocityY = this.speed * Math.sin(angle);
    }
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Ball;
}
