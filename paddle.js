/**
 * Paddle class representing player or AI paddle
 */
class Paddle {
    constructor(x, y, width, height, isLeft = true) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isLeft = isLeft;
        this.speed = 5;
        this.velocityY = 0;
    }

    /**
     * Get paddle bounding box for collision detection
     */
    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height,
            centerX: this.x + this.width / 2,
            centerY: this.y + this.height / 2
        };
    }

    /**
     * Update paddle position
     */
    update(canvasHeight) {
        this.y += this.velocityY;

        // Keep paddle within canvas bounds
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.y + this.height > canvasHeight) {
            this.y = canvasHeight - this.height;
        }
    }

    /**
     * Render the paddle
     */
    render(ctx) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    /**
     * Move paddle up
     */
    moveUp() {
        this.velocityY = -this.speed;
    }

    /**
     * Move paddle down
     */
    moveDown() {
        this.velocityY = this.speed;
    }

    /**
     * Stop paddle movement
     */
    stop() {
        this.velocityY = 0;
    }

    /**
     * Calculate relative hit position (-1 to 1, where 0 is center)
     */
    getRelativeHitPosition(ballY) {
        const paddleCenter = this.y + this.height / 2;
        const relativePosition = (ballY - paddleCenter) / (this.height / 2);
        return Math.max(-1, Math.min(1, relativePosition));
    }
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Paddle;
}
