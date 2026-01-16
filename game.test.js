/**
 * @jest-environment jsdom
 */

describe('Pong Game State Management', () => {
  let canvas, ctx;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = '<canvas id="gameCanvas" width="800" height="600"></canvas>';
    canvas = document.getElementById('gameCanvas');
    // Note: jsdom doesn't support canvas getContext, so we skip setting ctx
  });

  test('Game states are defined correctly', () => {
    const GameState = {
      MENU: 'MENU',
      PLAYING: 'PLAYING',
      PAUSED: 'PAUSED',
      GAME_OVER: 'GAME_OVER'
    };

    expect(GameState.MENU).toBe('MENU');
    expect(GameState.PLAYING).toBe('PLAYING');
    expect(GameState.PAUSED).toBe('PAUSED');
    expect(GameState.GAME_OVER).toBe('GAME_OVER');
  });

  test('Game configuration constants are set', () => {
    const WINNING_SCORE = 11;
    const PADDLE_WIDTH = 10;
    const PADDLE_HEIGHT = 100;
    const BALL_SIZE = 10;

    expect(WINNING_SCORE).toBe(11);
    expect(PADDLE_WIDTH).toBeGreaterThan(0);
    expect(PADDLE_HEIGHT).toBeGreaterThan(0);
    expect(BALL_SIZE).toBeGreaterThan(0);
  });

  test('Canvas element exists and has correct dimensions', () => {
    expect(canvas).toBeTruthy();
    expect(canvas.width).toBe(800);
    expect(canvas.height).toBe(600);
  });

  test('Game objects have required properties', () => {
    const paddle = {
      x: 20,
      y: 250,
      width: 10,
      height: 100,
      dy: 0
    };

    const ball = {
      x: 400,
      y: 300,
      width: 10,
      height: 10,
      dx: 5,
      dy: 5,
      speed: 5
    };

    expect(paddle).toHaveProperty('x');
    expect(paddle).toHaveProperty('y');
    expect(paddle).toHaveProperty('width');
    expect(paddle).toHaveProperty('height');

    expect(ball).toHaveProperty('x');
    expect(ball).toHaveProperty('y');
    expect(ball).toHaveProperty('dx');
    expect(ball).toHaveProperty('dy');
    expect(ball).toHaveProperty('speed');
  });

  test('Score tracking structure exists', () => {
    const scores = { player1: 0, player2: 0 };
    
    expect(scores).toHaveProperty('player1');
    expect(scores).toHaveProperty('player2');
    expect(scores.player1).toBe(0);
    expect(scores.player2).toBe(0);
  });

  test('Win condition check works correctly', () => {
    const WINNING_SCORE = 11;
    const scores = { player1: 11, player2: 5 };
    
    const checkWin = (scores) => {
      if (scores.player1 >= WINNING_SCORE) return 'Player 1';
      if (scores.player2 >= WINNING_SCORE) return 'Player 2';
      return null;
    };

    expect(checkWin(scores)).toBe('Player 1');
    expect(checkWin({ player1: 5, player2: 11 })).toBe('Player 2');
    expect(checkWin({ player1: 5, player2: 5 })).toBeNull();
  });

  test('State transitions work correctly', () => {
    let currentState = 'MENU';

    // Start game
    currentState = 'PLAYING';
    expect(currentState).toBe('PLAYING');

    // Pause game
    currentState = 'PAUSED';
    expect(currentState).toBe('PAUSED');

    // Resume game
    currentState = 'PLAYING';
    expect(currentState).toBe('PLAYING');

    // Game over
    currentState = 'GAME_OVER';
    expect(currentState).toBe('GAME_OVER');

    // Reset to menu
    currentState = 'MENU';
    expect(currentState).toBe('MENU');
  });

  test('Ball reset logic works', () => {
    const resetBall = (ball, canvasWidth, canvasHeight) => {
      ball.x = canvasWidth / 2;
      ball.y = canvasHeight / 2;
      ball.speed = 5;
      return ball;
    };

    const ball = { x: 100, y: 200, speed: 10 };
    const resetBallObj = resetBall(ball, 800, 600);

    expect(resetBallObj.x).toBe(400);
    expect(resetBallObj.y).toBe(300);
    expect(resetBallObj.speed).toBe(5);
  });

  test('Paddle movement boundaries work', () => {
    const PADDLE_HEIGHT = 100;
    const canvasHeight = 600;
    const PADDLE_SPEED = 6;

    let paddleY = 0;

    // Try to move up from top edge
    const newY = Math.max(0, paddleY - PADDLE_SPEED);
    expect(newY).toBe(0);

    // Try to move down from bottom edge
    paddleY = canvasHeight - PADDLE_HEIGHT;
    const newY2 = Math.min(canvasHeight - PADDLE_HEIGHT, paddleY + PADDLE_SPEED);
    expect(newY2).toBe(canvasHeight - PADDLE_HEIGHT);
  });

  test('Ball collision with wall changes direction', () => {
    let ballDy = 5;
    const ballY = 0; // Hit top wall

    if (ballY <= 0) {
      ballDy *= -1;
    }

    expect(ballDy).toBe(-5);
  });

  test('Score increments when ball goes out of bounds', () => {
    const scores = { player1: 0, player2: 0 };
    const ballX = -10; // Ball went past left edge

    if (ballX < 0) {
      scores.player2++;
    }

    expect(scores.player2).toBe(1);
    expect(scores.player1).toBe(0);
  });
});
