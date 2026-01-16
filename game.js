// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Paddle class
class Paddle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 5;
        this.velocity = 0;
        this.moveUp = false;
        this.moveDown = false;
    }

    // Update paddle position based on velocity
    update() {
        // Set velocity based on key states
        if (this.moveUp && !this.moveDown) {
            this.velocity = -this.speed;
        } else if (this.moveDown && !this.moveUp) {
            this.velocity = this.speed;
        } else {
            this.velocity = 0;
        }

        // Update position
        this.y += this.velocity;

        // Constrain paddle within canvas boundaries
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
        }
    }

    // Render paddle as white rectangle
    render() {
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    // Get collision boundaries
    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }
}

// Create player paddle on left side
const playerPaddle = new Paddle(20, canvas.height / 2 - 50, 10, 100);

// Track active keys using a counter approach for each direction
const activeKeys = {
    up: 0,
    down: 0
};

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    
    if (key === 'w' || key === 'arrowup') {
        if (key === 'arrowup') e.preventDefault(); // Prevent page scrolling
        if (!playerPaddle.moveUp) {
            activeKeys.up++;
            playerPaddle.moveUp = true;
        }
    } else if (key === 's' || key === 'arrowdown') {
        if (key === 'arrowdown') e.preventDefault(); // Prevent page scrolling
        if (!playerPaddle.moveDown) {
            activeKeys.down++;
            playerPaddle.moveDown = true;
        }
    }
});

document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    
    if (key === 'w' || key === 'arrowup') {
        activeKeys.up--;
        if (activeKeys.up <= 0) {
            activeKeys.up = 0;
            playerPaddle.moveUp = false;
        }
    } else if (key === 's' || key === 'arrowdown') {
        activeKeys.down--;
        if (activeKeys.down <= 0) {
            activeKeys.down = 0;
            playerPaddle.moveDown = false;
        }
    }
});

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and render player paddle
    playerPaddle.update();
    playerPaddle.render();

    // Continue game loop
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();
