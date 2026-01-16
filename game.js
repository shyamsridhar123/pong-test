// Canvas and context
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Screen elements
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const pauseScreen = document.getElementById('pauseScreen');
const winnerText = document.getElementById('winnerText');

// Game states
const GAME_STATES = {
    START: 'start',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver'
};

let gameState = GAME_STATES.START;

// Game constants
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 10;
const WINNING_SCORE = 11;
const PADDLE_SPEED = 6;
const INITIAL_BALL_SPEED = 5;
const BALL_SPEED_INCREMENT = 0.3;
const AI_SPEED = 4;

// Player paddle
const player = {
    x: 20,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0,
    score: 0
};

// AI paddle
const ai = {
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
    width: BALL_SIZE,
    height: BALL_SIZE,
    dx: INITIAL_BALL_SPEED,
    dy: INITIAL_BALL_SPEED,
    speed: INITIAL_BALL_SPEED
};

// Keyboard state
const keys = {};

// Event listeners
document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    
    // Start or restart game
    if (e.key === ' ' && (gameState === GAME_STATES.START || gameState === GAME_STATES.GAME_OVER)) {
        e.preventDefault();
        startGame();
    }
    
    // Pause/unpause game
    if ((e.key.toLowerCase() === 'p' || e.key === 'Escape') && gameState === GAME_STATES.PLAYING) {
        e.preventDefault();
        pauseGame();
    } else if ((e.key.toLowerCase() === 'p' || e.key === 'Escape') && gameState === GAME_STATES.PAUSED) {
        e.preventDefault();
        resumeGame();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Draw rectangle helper
function drawRect(x, y, width, height, color = '#fff') {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

// Draw circle helper
function drawCircle(x, y, radius, color = '#fff') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

// Draw text helper
function drawText(text, x, y, size = 40, align = 'center') {
    ctx.font = `${size}px 'Courier New', monospace`;
    ctx.fillStyle = '#fff';
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
}

// Draw net
function drawNet() {
    const netWidth = 4;
    const netHeight = 10;
    const gap = 15;
    
    for (let i = 0; i < canvas.height; i += netHeight + gap) {
        drawRect(canvas.width / 2 - netWidth / 2, i, netWidth, netHeight);
    }
}

// Draw everything
function draw() {
    // Clear canvas
    drawRect(0, 0, canvas.width, canvas.height, '#000');
    
    // Draw net
    drawNet();
    
    // Draw paddles
    drawRect(player.x, player.y, player.width, player.height);
    drawRect(ai.x, ai.y, ai.width, ai.height);
    
    // Draw ball
    drawCircle(ball.x + ball.width / 2, ball.y + ball.height / 2, ball.width / 2);
    
    // Draw scores
    drawText(player.score.toString(), canvas.width / 4, 60, 48);
    drawText(ai.score.toString(), (canvas.width * 3) / 4, 60, 48);
}

// Update player paddle
function updatePlayer() {
    if ((keys['w'] || keys['arrowup']) && player.y > 0) {
        player.dy = -PADDLE_SPEED;
    } else if ((keys['s'] || keys['arrowdown']) && player.y + player.height < canvas.height) {
        player.dy = PADDLE_SPEED;
    } else {
        player.dy = 0;
    }
    
    player.y += player.dy;
    
    // Keep paddle in bounds
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

// Update AI paddle
function updateAI() {
    const paddleCenter = ai.y + ai.height / 2;
    const ballCenter = ball.y + ball.height / 2;
    
    // AI follows ball with some delay for difficulty
    if (paddleCenter < ballCenter - 35) {
        ai.dy = AI_SPEED;
    } else if (paddleCenter > ballCenter + 35) {
        ai.dy = -AI_SPEED;
    } else {
        ai.dy = 0;
    }
    
    ai.y += ai.dy;
    
    // Keep paddle in bounds
    if (ai.y < 0) ai.y = 0;
    if (ai.y + ai.height > canvas.height) ai.y = canvas.height - ai.height;
}

// Check collision between ball and paddle
function checkPaddleCollision(paddle) {
    return ball.x < paddle.x + paddle.width &&
           ball.x + ball.width > paddle.x &&
           ball.y < paddle.y + paddle.height &&
           ball.y + ball.height > paddle.y;
}

// Update ball
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Wall collision (top and bottom)
    if (ball.y <= 0 || ball.y + ball.height >= canvas.height) {
        ball.dy *= -1;
    }
    
    // Paddle collision
    if (checkPaddleCollision(player)) {
        ball.dx = Math.abs(ball.dx) + BALL_SPEED_INCREMENT;
        ball.x = player.x + player.width;
        
        // Add spin based on where ball hits paddle
        const hitPos = (ball.y + ball.height / 2 - player.y) / player.height;
        ball.dy = (hitPos - 0.5) * 10;
    }
    
    if (checkPaddleCollision(ai)) {
        ball.dx = -(Math.abs(ball.dx) + BALL_SPEED_INCREMENT);
        ball.x = ai.x - ball.width;
        
        // Add spin based on where ball hits paddle
        const hitPos = (ball.y + ball.height / 2 - ai.y) / ai.height;
        ball.dy = (hitPos - 0.5) * 10;
    }
    
    // Scoring
    if (ball.x <= 0) {
        ai.score++;
        resetBall(false);
        checkWin();
    } else if (ball.x + ball.width >= canvas.width) {
        player.score++;
        resetBall(true);
        checkWin();
    }
}

// Reset ball to center
function resetBall(towardsPlayer) {
    ball.x = canvas.width / 2 - ball.width / 2;
    ball.y = canvas.height / 2 - ball.height / 2;
    ball.speed = INITIAL_BALL_SPEED;
    ball.dx = towardsPlayer ? -INITIAL_BALL_SPEED : INITIAL_BALL_SPEED;
    ball.dy = (Math.random() - 0.5) * 8;
}

// Check if someone won
function checkWin() {
    if (player.score >= WINNING_SCORE) {
        endGame('PLAYER WINS!');
    } else if (ai.score >= WINNING_SCORE) {
        endGame('AI WINS!');
    }
}

// End game
function endGame(message) {
    gameState = GAME_STATES.GAME_OVER;
    winnerText.textContent = message;
    gameOverScreen.classList.remove('hidden');
}

// Start game
function startGame() {
    gameState = GAME_STATES.PLAYING;
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    
    // Reset scores
    player.score = 0;
    ai.score = 0;
    
    // Reset ball
    resetBall(Math.random() > 0.5);
}

// Pause game
function pauseGame() {
    gameState = GAME_STATES.PAUSED;
    pauseScreen.classList.remove('hidden');
}

// Resume game
function resumeGame() {
    pauseScreen.classList.add('hidden');
    gameState = GAME_STATES.PLAYING;
}

// Game loop
function gameLoop() {
    if (gameState === GAME_STATES.PLAYING) {
        updatePlayer();
        updateAI();
        updateBall();
    }
    
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game loop
gameLoop();
