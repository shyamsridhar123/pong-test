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

// Keyboard event listeners
const keys = {
    w: false,
    s: false,
    arrowUp: false,
    arrowDown: false
};

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    
    if (key === 'w') {
        keys.w = true;
        playerPaddle.moveUp = true;
    } else if (key === 's') {
        keys.s = true;
        playerPaddle.moveDown = true;
    } else if (e.key === 'ArrowUp') {
        e.preventDefault(); // Prevent page scrolling
        keys.arrowUp = true;
        playerPaddle.moveUp = true;
    } else if (e.key === 'ArrowDown') {
        e.preventDefault(); // Prevent page scrolling
        keys.arrowDown = true;
        playerPaddle.moveDown = true;
    }
});

document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    
    if (key === 'w') {
        keys.w = false;
        if (!keys.arrowUp) {
            playerPaddle.moveUp = false;
        }
    } else if (key === 's') {
        keys.s = false;
        if (!keys.arrowDown) {
            playerPaddle.moveDown = false;
        }
    } else if (e.key === 'ArrowUp') {
        keys.arrowUp = false;
        if (!keys.w) {
            playerPaddle.moveUp = false;
        }
    } else if (e.key === 'ArrowDown') {
        keys.arrowDown = false;
        if (!keys.s) {
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
