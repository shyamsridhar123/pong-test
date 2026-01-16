/**
 * Collision Detection System
 * Implements AABB (Axis-Aligned Bounding Box) collision detection
 * between ball and paddles with angle variation based on hit position
 */
class CollisionDetector {
    constructor() {
        this.speedIncreasePerHit = 1.05; // 5% speed increase per hit
        this.maxBounceAngle = Math.PI / 3; // 60 degrees max bounce angle
    }

    /**
     * Check and handle collision between ball and paddle
     * @param {Ball} ball - The game ball
     * @param {Paddle} paddle - The paddle to check collision with
     * @returns {boolean} - True if collision occurred
     */
    checkBallPaddleCollision(ball, paddle) {
        const ballBounds = ball.getBounds();
        const paddleBounds = paddle.getBounds();

        // AABB Collision Detection
        const collision = this.detectAABBCollision(ballBounds, paddleBounds);
        
        if (collision) {
            // Prevent ball from passing through paddle by repositioning
            this.repositionBall(ball, paddle, ballBounds, paddleBounds);
            
            // Calculate bounce angle based on hit position
            this.handleBounce(ball, paddle);
            
            // Increase ball speed
            ball.increaseSpeed(this.speedIncreasePerHit);
            
            return true;
        }
        
        return false;
    }

    /**
     * AABB Collision Detection
     * @param {Object} bounds1 - First bounding box
     * @param {Object} bounds2 - Second bounding box
     * @returns {boolean} - True if boxes overlap
     */
    detectAABBCollision(bounds1, bounds2) {
        return bounds1.left < bounds2.right &&
               bounds1.right > bounds2.left &&
               bounds1.top < bounds2.bottom &&
               bounds1.bottom > bounds2.top;
    }

    /**
     * Reposition ball to prevent passing through paddle at high speeds
     * @param {Ball} ball - The game ball
     * @param {Paddle} paddle - The paddle
     * @param {Object} ballBounds - Ball bounding box
     * @param {Object} paddleBounds - Paddle bounding box
     */
    repositionBall(ball, paddle, ballBounds, paddleBounds) {
        if (paddle.isLeft) {
            // Left paddle - push ball to the right
            ball.x = paddleBounds.right + ball.radius;
        } else {
            // Right paddle - push ball to the left
            ball.x = paddleBounds.left - ball.radius;
        }
    }

    /**
     * Handle ball bounce with angle variation based on hit position
     * @param {Ball} ball - The game ball
     * @param {Paddle} paddle - The paddle that was hit
     */
    handleBounce(ball, paddle) {
        // Get relative hit position (-1 to 1, where 0 is center)
        const relativeHitY = paddle.getRelativeHitPosition(ball.y);
        
        // Calculate bounce angle based on hit position
        // Center hit: 0 degrees (horizontal)
        // Top/bottom hit: up to maxBounceAngle degrees
        const bounceAngle = relativeHitY * this.maxBounceAngle;
        
        // Determine direction based on which paddle was hit
        const direction = paddle.isLeft ? 1 : -1;
        
        // Calculate new velocity components
        ball.velocityX = direction * ball.speed * Math.cos(bounceAngle);
        ball.velocityY = ball.speed * Math.sin(bounceAngle);
    }

    /**
     * Check if ball collides with top or bottom wall
     * @param {Ball} ball - The game ball
     * @param {number} canvasHeight - Height of the game canvas
     * @returns {boolean} - True if collision occurred
     */
    checkWallCollision(ball, canvasHeight) {
        const ballBounds = ball.getBounds();
        
        if (ballBounds.top <= 0 || ballBounds.bottom >= canvasHeight) {
            ball.bounceVertical();
            
            // Keep ball within bounds
            if (ballBounds.top <= 0) {
                ball.y = ball.radius;
            }
            if (ballBounds.bottom >= canvasHeight) {
                ball.y = canvasHeight - ball.radius;
            }
            
            return true;
        }
        
        return false;
    }

    /**
     * Check if ball went off screen (score point)
     * @param {Ball} ball - The game ball
     * @param {number} canvasWidth - Width of the game canvas
     * @returns {string|null} - 'left' if left player scored, 'right' if right player scored, null otherwise
     */
    checkScoreCollision(ball, canvasWidth) {
        const ballBounds = ball.getBounds();
        
        if (ballBounds.right < 0) {
            return 'right'; // Right player scored
        }
        if (ballBounds.left > canvasWidth) {
            return 'left'; // Left player scored
        }
        
        return null;
    }
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CollisionDetector;
}
