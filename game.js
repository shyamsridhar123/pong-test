/**
 * Pong Game - Main Entry Point
 * Classic Pong game implementation using HTML5 Canvas
 */

// Canvas and context setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
const game = {
    running: false,
    paused: false
};

// Ball object
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speedX: 5,
    speedY: 5,
    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = -this.speedX;
        this.speedY = Math.random() * 10 - 5;
    }
};

// Paddle object constructor
function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 6;
    this.dy = 0;
}

// Create paddles
const paddleWidth = 10;
const paddleHeight = 100;
const player1 = new Paddle(10, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight);
const player2 = new Paddle(canvas.width - 20, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight);

// Score tracking
const score = {
    player1: 0,
    player2: 0
};

// Keyboard controls
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    // Start game with space
    if (e.key === ' ' && !game.running) {
        game.running = true;
        gameLoop();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Update paddle positions based on keyboard input
function updatePaddles() {
    // Player 1 controls (W/S)
    if (keys['w'] || keys['W']) {
        player1.dy = -player1.speed;
    } else if (keys['s'] || keys['S']) {
        player1.dy = player1.speed;
    } else {
        player1.dy = 0;
    }
    
    // Player 2 controls (Arrow keys)
    if (keys['ArrowUp']) {
        player2.dy = -player2.speed;
    } else if (keys['ArrowDown']) {
        player2.dy = player2.speed;
    } else {
        player2.dy = 0;
    }
    
    // Update positions
    player1.y += player1.dy;
    player2.y += player2.dy;
    
    // Prevent paddles from going off screen
    player1.y = Math.max(0, Math.min(canvas.height - player1.height, player1.y));
    player2.y = Math.max(0, Math.min(canvas.height - player2.height, player2.y));
}

// Update ball position and handle collisions
function updateBall() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;
    
    // Top and bottom wall collision
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.speedY = -ball.speedY;
    }
    
    // Paddle collision detection
    // Player 1 paddle
    if (ball.x - ball.radius < player1.x + player1.width &&
        ball.y > player1.y &&
        ball.y < player1.y + player1.height) {
        ball.speedX = Math.abs(ball.speedX);
        ball.speedY += player1.dy * 0.2;
    }
    
    // Player 2 paddle
    if (ball.x + ball.radius > player2.x &&
        ball.y > player2.y &&
        ball.y < player2.y + player2.height) {
        ball.speedX = -Math.abs(ball.speedX);
        ball.speedY += player2.dy * 0.2;
    }
    
    // Score points and reset ball
    if (ball.x - ball.radius < 0) {
        score.player2++;
        ball.reset();
    } else if (ball.x + ball.radius > canvas.width) {
        score.player1++;
        ball.reset();
    }
}

// Draw everything on canvas
function draw() {
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw center line
    ctx.strokeStyle = '#ffffff';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw paddles
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.closePath();
    
    // Draw scores
    ctx.font = '48px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(score.player1, canvas.width / 4, 60);
    ctx.fillText(score.player2, 3 * canvas.width / 4, 60);
}

// Main game loop
function gameLoop() {
    if (!game.running) return;
    
    updatePaddles();
    updateBall();
    draw();
    
    requestAnimationFrame(gameLoop);
}

// Initial draw
draw();
