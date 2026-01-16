/**
 * Pong Game - Main Game Logic
 * Includes collision detection, scoring, and sound effects
 */

import AudioManager from './audioManager.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playerScoreEl = document.getElementById('playerScore');
const computerScoreEl = document.getElementById('computerScore');
const gameStatusEl = document.getElementById('gameStatus');
const muteStatusEl = document.getElementById('muteStatus');

// Initialize Audio Manager
const audioManager = new AudioManager();

// Game constants
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 10;
const PADDLE_SPEED = 5;
const INITIAL_BALL_SPEED = 4;
const WINNING_SCORE = 5;

// Game state
let gameState = {
    playing: false,
    gameOver: false,
    winner: null
};

// Player paddle (left)
const player = {
    x: 20,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0,
    score: 0
};

// Computer paddle (right)
const computer = {
    x: canvas.width - 20 - PADDLE_WIDTH,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0,
    score: 0
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: BALL_SIZE,
    dx: INITIAL_BALL_SPEED,
    dy: INITIAL_BALL_SPEED,
    speed: INITIAL_BALL_SPEED
};

// Keyboard state
const keys = {
    w: false,
    s: false,
    arrowUp: false,
    arrowDown: false
};

// Event listeners
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
    // Resume audio context on first user interaction
    audioManager.resumeAudioContext();

    if (e.key === 'w' || e.key === 'W') {
        keys.w = true;
    } else if (e.key === 's' || e.key === 'S') {
        keys.s = true;
    } else if (e.key === 'ArrowUp') {
        keys.arrowUp = true;
        e.preventDefault();
    } else if (e.key === 'ArrowDown') {
        keys.arrowDown = true;
        e.preventDefault();
    } else if (e.key === ' ') {
        e.preventDefault();
        if (gameState.gameOver) {
            resetGame();
        } else {
            gameState.playing = true;
        }
    } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
    }
}

function keyUpHandler(e) {
    if (e.key === 'w' || e.key === 'W') {
        keys.w = false;
    } else if (e.key === 's' || e.key === 'S') {
        keys.s = false;
    } else if (e.key === 'ArrowUp') {
        keys.arrowUp = false;
    } else if (e.key === 'ArrowDown') {
        keys.arrowDown = false;
    }
}

function toggleMute() {
    const isMuted = audioManager.toggleMute();
    muteStatusEl.textContent = isMuted ? 'OFF' : 'ON';
    muteStatusEl.style.color = isMuted ? '#f00' : '#0f0';
}

// Draw functions
function drawPaddle(paddle) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(ball.x - ball.size / 2, ball.y - ball.size / 2, ball.size, ball.size);
}

function drawCenterLine() {
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    drawCenterLine();

    // Draw paddles and ball
    drawPaddle(player);
    drawPaddle(computer);
    drawBall();
}

// Update player paddle
function updatePlayer() {
    if (keys.w || keys.arrowUp) {
        player.dy = -PADDLE_SPEED;
    } else if (keys.s || keys.arrowDown) {
        player.dy = PADDLE_SPEED;
    } else {
        player.dy = 0;
    }

    player.y += player.dy;

    // Boundary check
    if (player.y < 0) {
        player.y = 0;
    } else if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
}

// Update computer paddle (AI)
function updateComputer() {
    const paddleCenter = computer.y + computer.height / 2;
    const ballY = ball.y;

    // Simple AI: follow the ball
    if (paddleCenter < ballY - 10) {
        computer.dy = PADDLE_SPEED * 0.7; // Slightly slower than player
    } else if (paddleCenter > ballY + 10) {
        computer.dy = -PADDLE_SPEED * 0.7;
    } else {
        computer.dy = 0;
    }

    computer.y += computer.dy;

    // Boundary check
    if (computer.y < 0) {
        computer.y = 0;
    } else if (computer.y + computer.height > canvas.height) {
        computer.y = canvas.height - computer.height;
    }
}

// Update ball
function updateBall() {
    if (!gameState.playing || gameState.gameOver) return;

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (top and bottom)
    if (ball.y - ball.size / 2 <= 0 || ball.y + ball.size / 2 >= canvas.height) {
        ball.dy *= -1;
        audioManager.playWallBounce();
        
        // Keep ball in bounds
        if (ball.y - ball.size / 2 <= 0) {
            ball.y = ball.size / 2;
        } else {
            ball.y = canvas.height - ball.size / 2;
        }
    }

    // Paddle collision detection
    // Player paddle collision
    if (
        ball.x - ball.size / 2 <= player.x + player.width &&
        ball.x + ball.size / 2 >= player.x &&
        ball.y + ball.size / 2 >= player.y &&
        ball.y - ball.size / 2 <= player.y + player.height &&
        ball.dx < 0
    ) {
        // Calculate hit position on paddle (-1 to 1)
        const hitPos = (ball.y - (player.y + player.height / 2)) / (player.height / 2);
        
        // Change ball direction
        ball.dx = Math.abs(ball.dx);
        ball.dy = hitPos * ball.speed * 1.5; // Add spin based on hit position
        
        // Slightly increase ball speed
        ball.speed *= 1.05;
        ball.dx = ball.speed;
        
        // Play paddle hit sound
        audioManager.playPaddleHit();
    }

    // Computer paddle collision
    if (
        ball.x + ball.size / 2 >= computer.x &&
        ball.x - ball.size / 2 <= computer.x + computer.width &&
        ball.y + ball.size / 2 >= computer.y &&
        ball.y - ball.size / 2 <= computer.y + computer.height &&
        ball.dx > 0
    ) {
        // Calculate hit position on paddle (-1 to 1)
        const hitPos = (ball.y - (computer.y + computer.height / 2)) / (computer.height / 2);
        
        // Change ball direction
        ball.dx = -Math.abs(ball.dx);
        ball.dy = hitPos * ball.speed * 1.5;
        
        // Slightly increase ball speed
        ball.speed *= 1.05;
        ball.dx = -ball.speed;
        
        // Play paddle hit sound
        audioManager.playPaddleHit();
    }

    // Scoring - Ball goes off screen
    if (ball.x < 0) {
        // Computer scores
        computer.score++;
        computerScoreEl.textContent = computer.score;
        audioManager.playScore();
        checkWinCondition();
        resetBall();
    } else if (ball.x > canvas.width) {
        // Player scores
        player.score++;
        playerScoreEl.textContent = player.score;
        audioManager.playScore();
        checkWinCondition();
        resetBall();
    }
}

function checkWinCondition() {
    if (player.score >= WINNING_SCORE) {
        gameState.gameOver = true;
        gameState.winner = 'player';
        gameState.playing = false;
        gameStatusEl.innerHTML = '<div class="game-over winner">🎉 YOU WIN! 🎉</div><div>Press SPACE to play again</div>';
        audioManager.playWin();
    } else if (computer.score >= WINNING_SCORE) {
        gameState.gameOver = true;
        gameState.winner = 'computer';
        gameState.playing = false;
        gameStatusEl.innerHTML = '<div class="game-over">GAME OVER</div><div>Press SPACE to play again</div>';
        audioManager.playGameOver();
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = INITIAL_BALL_SPEED;
    
    // Random direction
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = (Math.random() * 2 - 1) * ball.speed;
    
    // Pause for a moment
    gameState.playing = false;
    setTimeout(() => {
        if (!gameState.gameOver) {
            gameState.playing = true;
        }
    }, 1000);
}

function resetGame() {
    player.score = 0;
    computer.score = 0;
    playerScoreEl.textContent = '0';
    computerScoreEl.textContent = '0';
    gameStatusEl.textContent = '';
    
    player.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    computer.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    
    gameState.gameOver = false;
    gameState.winner = null;
    gameState.playing = false;
    
    resetBall();
}

// Game loop
function gameLoop() {
    updatePlayer();
    updateComputer();
    updateBall();
    draw();
    
    requestAnimationFrame(gameLoop);
}

// Show initial message
gameStatusEl.textContent = 'Press SPACE to start';

// Start game loop
gameLoop();
