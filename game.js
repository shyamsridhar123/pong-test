/**
 * Main Game Logic
 */
class PongGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Game objects
        this.ball = new Ball(
            this.canvas.width / 2,
            this.canvas.height / 2,
            10,
            5,
            3
        );
        
        this.leftPaddle = new Paddle(
            20,
            this.canvas.height / 2 - 50,
            10,
            100,
            true
        );
        
        this.rightPaddle = new Paddle(
            this.canvas.width - 30,
            this.canvas.height / 2 - 50,
            10,
            100,
            false
        );
        
        this.collisionDetector = new CollisionDetector();
        
        // Game state
        this.leftScore = 0;
        this.rightScore = 0;
        this.paused = false;
        
        // Input handling
        this.keys = {};
        this.setupInputHandlers();
        
        // Start game loop
        this.gameLoop();
    }

    /**
     * Setup keyboard input handlers
     */
    setupInputHandlers() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    /**
     * Handle player input
     */
    handleInput() {
        // Left paddle (W/S keys)
        if (this.keys['w'] || this.keys['W']) {
            this.leftPaddle.moveUp();
        } else if (this.keys['s'] || this.keys['S']) {
            this.leftPaddle.moveDown();
        } else {
            this.leftPaddle.stop();
        }
        
        // Right paddle (Arrow keys)
        if (this.keys['ArrowUp']) {
            this.rightPaddle.moveUp();
        } else if (this.keys['ArrowDown']) {
            this.rightPaddle.moveDown();
        } else {
            this.rightPaddle.stop();
        }
        
        // Pause (Space)
        if (this.keys[' ']) {
            this.paused = !this.paused;
            this.keys[' '] = false; // Prevent continuous toggling
        }
    }

    /**
     * Update game state
     */
    update() {
        if (this.paused) return;
        
        // Update paddles
        this.leftPaddle.update(this.canvas.height);
        this.rightPaddle.update(this.canvas.height);
        
        // Update ball
        this.ball.update();
        
        // Check collisions
        this.collisionDetector.checkBallPaddleCollision(this.ball, this.leftPaddle);
        this.collisionDetector.checkBallPaddleCollision(this.ball, this.rightPaddle);
        this.collisionDetector.checkWallCollision(this.ball, this.canvas.height);
        
        // Check for scoring
        const score = this.collisionDetector.checkScoreCollision(this.ball, this.canvas.width);
        if (score === 'left') {
            this.leftScore++;
            this.ball.reset(this.canvas.width, this.canvas.height);
        } else if (score === 'right') {
            this.rightScore++;
            this.ball.reset(this.canvas.width, this.canvas.height);
        }
    }

    /**
     * Render game objects
     */
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw center line
        this.ctx.strokeStyle = '#fff';
        this.ctx.setLineDash([10, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Draw scores
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '48px Arial';
        this.ctx.fillText(this.leftScore, this.canvas.width / 4, 60);
        this.ctx.fillText(this.rightScore, 3 * this.canvas.width / 4, 60);
        
        // Draw game objects
        this.leftPaddle.render(this.ctx);
        this.rightPaddle.render(this.ctx);
        this.ball.render(this.ctx);
        
        // Draw pause indicator
        if (this.paused) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.font = '36px Arial';
            this.ctx.fillText('PAUSED', this.canvas.width / 2 - 80, this.canvas.height / 2);
        }
    }

    /**
     * Main game loop
     */
    gameLoop() {
        this.handleInput();
        this.update();
        this.render();
        
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start game when page loads
window.addEventListener('load', () => {
    new PongGame('gameCanvas');
});
