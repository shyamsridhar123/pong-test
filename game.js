// Game States
const GameState = {
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    GAME_OVER: 'GAME_OVER'
};

// Game Configuration
const WINNING_SCORE = 11;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 10;
const PADDLE_SPEED = 6;
const INITIAL_BALL_SPEED = 5;

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let currentState = GameState.MENU;
let scores = { player1: 0, player2: 0 };
let winner = null;

// Paddle objects
const paddle1 = {
    x: 20,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

const paddle2 = {
    x: canvas.width - 20 - PADDLE_WIDTH,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

// Ball object
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: BALL_SIZE,
    height: BALL_SIZE,
    dx: INITIAL_BALL_SPEED,
    dy: INITIAL_BALL_SPEED,
    speed: INITIAL_BALL_SPEED
};

// Keyboard state
const keys = {};

// Event listeners for keyboard input
document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;

    // Handle state transitions
    if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        if (currentState === GameState.MENU) {
            startGame();
        } else if (currentState === GameState.GAME_OVER) {
            resetGame();
        }
    }

    if ((e.key.toLowerCase() === 'p' || e.key === 'Escape') && currentState === GameState.PLAYING) {
        pauseGame();
    } else if ((e.key.toLowerCase() === 'p' || e.key === 'Escape') && currentState === GameState.PAUSED) {
        resumeGame();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Game functions
function startGame() {
    currentState = GameState.PLAYING;
    scores = { player1: 0, player2: 0 };
    winner = null;
    resetBall();
}

function pauseGame() {
    currentState = GameState.PAUSED;
}

function resumeGame() {
    currentState = GameState.PLAYING;
}

function resetGame() {
    currentState = GameState.MENU;
    scores = { player1: 0, player2: 0 };
    winner = null;
    resetBall();
    paddle1.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    paddle2.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = INITIAL_BALL_SPEED;
    
    // Random direction
    const angle = (Math.random() * Math.PI / 2) - Math.PI / 4;
    const direction = Math.random() < 0.5 ? 1 : -1;
    ball.dx = Math.cos(angle) * ball.speed * direction;
    ball.dy = Math.sin(angle) * ball.speed;
}

// Update game logic
function update() {
    if (currentState !== GameState.PLAYING) {
        return;
    }

    // Move paddles based on keyboard input
    if (keys['w'] && paddle1.y > 0) {
        paddle1.y -= PADDLE_SPEED;
    }
    if (keys['s'] && paddle1.y < canvas.height - paddle1.height) {
        paddle1.y += PADDLE_SPEED;
    }
    if (keys['arrowup'] && paddle2.y > 0) {
        paddle2.y -= PADDLE_SPEED;
    }
    if (keys['arrowdown'] && paddle2.y < canvas.height - paddle2.height) {
        paddle2.y += PADDLE_SPEED;
    }

    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y <= 0 || ball.y + ball.height >= canvas.height) {
        ball.dy *= -1;
    }

    // Ball collision with paddles
    if (
        ball.x <= paddle1.x + paddle1.width &&
        ball.y + ball.height >= paddle1.y &&
        ball.y <= paddle1.y + paddle1.height
    ) {
        ball.dx = Math.abs(ball.dx);
        ball.speed *= 1.05; // Increase speed slightly
        ball.dx = ball.speed * (ball.dx / Math.abs(ball.dx));
    }

    if (
        ball.x + ball.width >= paddle2.x &&
        ball.y + ball.height >= paddle2.y &&
        ball.y <= paddle2.y + paddle2.height
    ) {
        ball.dx = -Math.abs(ball.dx);
        ball.speed *= 1.05; // Increase speed slightly
        ball.dx = ball.speed * (ball.dx / Math.abs(ball.dx));
    }

    // Ball goes out of bounds (scoring)
    if (ball.x < 0) {
        scores.player2++;
        checkWinCondition();
        resetBall();
    } else if (ball.x > canvas.width) {
        scores.player1++;
        checkWinCondition();
        resetBall();
    }
}

function checkWinCondition() {
    if (scores.player1 >= WINNING_SCORE) {
        winner = 'Player 1';
        currentState = GameState.GAME_OVER;
    } else if (scores.player2 >= WINNING_SCORE) {
        winner = 'Player 2';
        currentState = GameState.GAME_OVER;
    }
}

// Draw game elements
function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    ctx.strokeStyle = '#fff';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);

    // Draw ball
    ctx.fillRect(ball.x, ball.y, ball.width, ball.height);

    // Draw scores
    ctx.font = '48px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(scores.player1, canvas.width / 4, 60);
    ctx.fillText(scores.player2, (canvas.width * 3) / 4, 60);

    // Draw state-specific overlays
    if (currentState === GameState.MENU) {
        drawMenuScreen();
    } else if (currentState === GameState.PAUSED) {
        drawPauseScreen();
    } else if (currentState === GameState.GAME_OVER) {
        drawGameOverScreen();
    }
}

function drawMenuScreen() {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 72px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('PONG', canvas.width / 2, canvas.height / 2 - 80);

    // Instructions
    ctx.font = '24px Courier New';
    ctx.fillText('Press SPACE to Start', canvas.width / 2, canvas.height / 2);
    
    ctx.font = '18px Courier New';
    ctx.fillText('Player 1: W/S keys', canvas.width / 2, canvas.height / 2 + 60);
    ctx.fillText('Player 2: Arrow keys', canvas.width / 2, canvas.height / 2 + 90);
    ctx.fillText('P or ESC to Pause', canvas.width / 2, canvas.height / 2 + 120);
    ctx.fillText('First to 11 points wins!', canvas.width / 2, canvas.height / 2 + 150);
}

function drawPauseScreen() {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Pause text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);

    ctx.font = '24px Courier New';
    ctx.fillText('Press P or ESC to Resume', canvas.width / 2, canvas.height / 2 + 50);
}

function drawGameOverScreen() {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Game over text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 60);

    // Winner
    ctx.font = 'bold 36px Courier New';
    ctx.fillText(`${winner} Wins!`, canvas.width / 2, canvas.height / 2);

    // Final score
    ctx.font = '24px Courier New';
    ctx.fillText(`Final Score: ${scores.player1} - ${scores.player2}`, canvas.width / 2, canvas.height / 2 + 50);

    // Restart instruction
    ctx.font = '24px Courier New';
    ctx.fillText('Press SPACE to Restart', canvas.width / 2, canvas.height / 2 + 100);
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
