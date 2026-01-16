// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw center line (dashed)
    drawCenterLine();
    
    // Request next frame
    requestAnimationFrame(gameLoop);
}

// Set up static rendering properties for center line
ctx.strokeStyle = '#fff';
ctx.lineWidth = 2;

// Draw center line divider
function drawCenterLine() {
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash pattern
}

// Start game loop
gameLoop();
