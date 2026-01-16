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
    paused: false,
    mode: '1P', // '1P' for vs AI, '2P' for local multiplayer
    winningScore: 5,
    winner: null
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

// AI configuration
const AI = {
    difficulty: 'medium', // easy, medium, hard
    lastReactionTime: 0,
    targetY: canvas.height / 2,
    
    // Difficulty settings
    difficulties: {
        easy: {
            speed: 3,
            reactionTime: 300, // ms
            accuracy: 0.6,
            predictionError: 40
        },
        medium: {
            speed: 4.5,
            reactionTime: 150, // ms
            accuracy: 0.8,
            predictionError: 20
        },
        hard: {
            speed: 5.5,
            reactionTime: 50, // ms
            accuracy: 0.95,
            predictionError: 5
        }
    },
    
    getCurrentSettings() {
        return this.difficulties[this.difficulty];
    }
};

// Score tracking
const score = {
    player1: 0,
    player2: 0
};

// Check win condition
function checkWinCondition() {
    if (score.player1 >= game.winningScore) {
        game.winner = 'Player 1';
        game.running = false;
    } else if (score.player2 >= game.winningScore) {
        game.winner = game.mode === '2P' ? 'Player 2' : 'AI';
        game.running = false;
    }
}

// Keyboard controls
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    // Start game with space
    if (e.key === ' ') {
        if (game.winner) {
            // Restart game
            resetGame();
        } else if (!game.running) {
            // Start game
            game.running = true;
            gameLoop();
        }
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Update AI paddle behavior
function updateAI() {
    const settings = AI.getCurrentSettings();
    const currentTime = Date.now();
    
    // Only react when ball is moving toward AI (right side)
    if (ball.speedX > 0) {
        // Check if enough time has passed since last reaction (reaction delay)
        if (currentTime - AI.lastReactionTime > settings.reactionTime) {
            AI.lastReactionTime = currentTime;
            
            // Calculate target position with some prediction error
            const predictionError = (Math.random() - 0.5) * settings.predictionError;
            AI.targetY = ball.y + predictionError;
            
            // Add accuracy factor - sometimes the AI "misses" the target
            if (Math.random() > settings.accuracy) {
                AI.targetY += (Math.random() - 0.5) * paddleHeight;
            }
        }
    } else {
        // When ball is not coming toward AI, move to center gradually
        AI.targetY = canvas.height / 2;
    }
    
    // Move paddle toward target position with limited speed
    const paddleCenter = player2.y + player2.height / 2;
    const distanceToTarget = AI.targetY - paddleCenter;
    
    if (Math.abs(distanceToTarget) > 5) {
        if (distanceToTarget > 0) {
            player2.dy = settings.speed;
        } else {
            player2.dy = -settings.speed;
        }
    } else {
        player2.dy = 0;
    }
}

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
    
    // Player 2 controls depend on game mode
    if (game.mode === '2P') {
        // 2-player mode: Player 2 uses Arrow keys
        if (keys['ArrowUp']) {
            player2.dy = -player2.speed;
        } else if (keys['ArrowDown']) {
            player2.dy = player2.speed;
        } else {
            player2.dy = 0;
        }
    } else {
        // 1-player mode: AI controls Player 2
        updateAI();
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
        checkWinCondition();
        ball.reset();
    } else if (ball.x + ball.radius > canvas.width) {
        score.player1++;
        checkWinCondition();
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
    
    // Draw win screen if there's a winner
    if (game.winner) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '64px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${game.winner} Wins!`, canvas.width / 2, canvas.height / 2 - 40);
        
        ctx.font = '24px Arial';
        ctx.fillText('Press SPACE to restart', canvas.width / 2, canvas.height / 2 + 40);
        ctx.textAlign = 'left';
    }
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

// Reset game state
function resetGame() {
    score.player1 = 0;
    score.player2 = 0;
    game.winner = null;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = 5;
    ball.speedY = 5;
    game.running = true;
    gameLoop();
}

// Set game mode
function setGameMode(mode) {
    game.mode = mode;
    updateUI();
    
    // Update mode button states
    document.querySelectorAll('.mode-buttons button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });
}

// UI control functions
function setDifficulty(level) {
    AI.difficulty = level;
    updateUI();
    
    // Update button states
    document.querySelectorAll('.difficulty-buttons button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === level) {
            btn.classList.add('active');
        }
    });
}

function updateUI() {
    const modeText = document.getElementById('player2-mode');
    const difficultyButtons = document.querySelector('.difficulty-buttons');
    
    if (game.mode === '2P') {
        modeText.textContent = 'Player 2: ↑ (Up) / ↓ (Down)';
        difficultyButtons.style.display = 'none';
    } else {
        const difficulty = AI.difficulty.charAt(0).toUpperCase() + AI.difficulty.slice(1);
        modeText.textContent = `Player 2: AI Opponent (${difficulty})`;
        difficultyButtons.style.display = 'flex';
    }
    
    // Update mode indicator
    const modeIndicator = document.getElementById('mode-indicator');
    if (modeIndicator) {
        modeIndicator.textContent = game.mode === '2P' ? '2P Local' : '1P vs AI';
    }
}
