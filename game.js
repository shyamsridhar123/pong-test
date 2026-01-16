// Pong Game with Scoring System

const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game state
const game = {
    paused: false,
    pauseTime: 0,
    pauseDuration: 1000 // 1 second pause after scoring
};

// Player 1 (left paddle)
const player1 = {
    x: 20,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    speed: 6,
    score: 0,
    dy: 0
};

// Player 2 (right paddle)
const player2 = {
    x: canvas.width - 30,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    speed: 6,
    score: 0,
    dy: 0
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 8,
    speed: 5,
    dx: 5,
    dy: 3
};

// Keyboard controls
const keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
};

// Event listeners for keyboard
document.addEventListener('keydown', (e) => {
    if (e.key in keys) {
        keys[e.key] = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key in keys) {
        keys[e.key] = false;
    }
});

// Draw rectangle (paddles)
function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

// Draw circle (ball)
function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

// Draw text
function drawText(text, x, y, color, fontSize = '48px', font = 'Courier New') {
    ctx.fillStyle = color;
    ctx.font = `${fontSize} ${font}`;
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y);
}

// Draw center line
function drawCenterLine() {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

// Draw scores
function drawScores() {
    // Player 1 score (left side)
    drawText(player1.score.toString(), canvas.width / 4, 80, '#fff', '64px');
    
    // Player 2 score (right side)
    drawText(player2.score.toString(), (canvas.width * 3) / 4, 80, '#fff', '64px');
}

// Update paddle positions
function updatePaddles() {
    // Player 1 controls (W/S)
    if (keys.w && player1.y > 0) {
        player1.y -= player1.speed;
    }
    if (keys.s && player1.y + player1.height < canvas.height) {
        player1.y += player1.speed;
    }
    
    // Player 2 controls (Arrow Up/Down)
    if (keys.ArrowUp && player2.y > 0) {
        player2.y -= player2.speed;
    }
    if (keys.ArrowDown && player2.y + player2.height < canvas.height) {
        player2.y += player2.speed;
    }
}

// Update ball position
function updateBall() {
    if (game.paused) {
        const currentTime = Date.now();
        if (currentTime - game.pauseTime >= game.pauseDuration) {
            game.paused = false;
        }
        return;
    }
    
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Ball collision with top and bottom walls
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
        ball.dy *= -1;
    }
    
    // Ball collision with paddles
    // Left paddle (player 1)
    if (ball.x - ball.radius <= player1.x + player1.width &&
        ball.y >= player1.y &&
        ball.y <= player1.y + player1.height &&
        ball.dx < 0) {
        ball.dx *= -1;
        // Add slight angle based on where ball hits paddle
        const hitPos = (ball.y - (player1.y + player1.height / 2)) / (player1.height / 2);
        ball.dy = hitPos * 5;
    }
    
    // Right paddle (player 2)
    if (ball.x + ball.radius >= player2.x &&
        ball.y >= player2.y &&
        ball.y <= player2.y + player2.height &&
        ball.dx > 0) {
        ball.dx *= -1;
        // Add slight angle based on where ball hits paddle
        const hitPos = (ball.y - (player2.y + player2.height / 2)) / (player2.height / 2);
        ball.dy = hitPos * 5;
    }
    
    // Scoring - ball passes left side (player 2 scores)
    if (ball.x - ball.radius <= 0) {
        player2.score++;
        resetBall();
    }
    
    // Scoring - ball passes right side (player 1 scores)
    if (ball.x + ball.radius >= canvas.width) {
        player1.score++;
        resetBall();
    }
}

// Reset ball to center after scoring
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    
    // Random direction but keep speed
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.dy = (Math.random() * 6) - 3; // Random angle
    
    // Pause game briefly
    game.paused = true;
    game.pauseTime = Date.now();
}

// Draw everything
function draw() {
    // Clear canvas
    drawRect(0, 0, canvas.width, canvas.height, '#000');
    
    // Draw center line
    drawCenterLine();
    
    // Draw scores
    drawScores();
    
    // Draw paddles
    drawRect(player1.x, player1.y, player1.width, player1.height, '#fff');
    drawRect(player2.x, player2.y, player2.width, player2.height, '#fff');
    
    // Draw ball
    drawCircle(ball.x, ball.y, ball.radius, '#fff');
}

// Game loop
function gameLoop() {
    updatePaddles();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
