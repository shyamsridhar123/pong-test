/**
 * Tests for Ball-Paddle Collision Detection System
 */

const Ball = require('./ball.js');
const Paddle = require('./paddle.js');
const CollisionDetector = require('./collision.js');

describe('Ball Class', () => {
    test('should create ball with correct properties', () => {
        const ball = new Ball(400, 300, 10, 5, 3);
        expect(ball.x).toBe(400);
        expect(ball.y).toBe(300);
        expect(ball.radius).toBe(10);
        expect(ball.velocityX).toBe(5);
        expect(ball.velocityY).toBe(3);
    });

    test('should return correct bounding box', () => {
        const ball = new Ball(400, 300, 10, 5, 3);
        const bounds = ball.getBounds();
        expect(bounds.left).toBe(390);
        expect(bounds.right).toBe(410);
        expect(bounds.top).toBe(290);
        expect(bounds.bottom).toBe(310);
        expect(bounds.centerX).toBe(400);
        expect(bounds.centerY).toBe(300);
    });

    test('should update position correctly', () => {
        const ball = new Ball(400, 300, 10, 5, 3);
        ball.update();
        expect(ball.x).toBe(405);
        expect(ball.y).toBe(303);
    });

    test('should bounce vertically', () => {
        const ball = new Ball(400, 300, 10, 5, 3);
        const initialVelocityY = ball.velocityY;
        ball.bounceVertical();
        expect(ball.velocityY).toBe(-initialVelocityY);
        expect(ball.velocityX).toBe(5); // velocityX unchanged
    });

    test('should increase speed correctly', () => {
        const ball = new Ball(400, 300, 10, 5, 3);
        const initialSpeed = ball.speed;
        ball.increaseSpeed(1.05);
        expect(ball.speed).toBeCloseTo(initialSpeed * 1.05);
    });
});

describe('Paddle Class', () => {
    test('should create left paddle with correct properties', () => {
        const paddle = new Paddle(20, 250, 10, 100, true);
        expect(paddle.x).toBe(20);
        expect(paddle.y).toBe(250);
        expect(paddle.width).toBe(10);
        expect(paddle.height).toBe(100);
        expect(paddle.isLeft).toBe(true);
    });

    test('should return correct bounding box', () => {
        const paddle = new Paddle(20, 250, 10, 100, true);
        const bounds = paddle.getBounds();
        expect(bounds.left).toBe(20);
        expect(bounds.right).toBe(30);
        expect(bounds.top).toBe(250);
        expect(bounds.bottom).toBe(350);
        expect(bounds.centerX).toBe(25);
        expect(bounds.centerY).toBe(300);
    });

    test('should move up correctly', () => {
        const paddle = new Paddle(20, 250, 10, 100, true);
        paddle.moveUp();
        expect(paddle.velocityY).toBe(-paddle.speed);
    });

    test('should move down correctly', () => {
        const paddle = new Paddle(20, 250, 10, 100, true);
        paddle.moveDown();
        expect(paddle.velocityY).toBe(paddle.speed);
    });

    test('should calculate relative hit position correctly', () => {
        const paddle = new Paddle(20, 200, 10, 100, true);
        // Center hit
        expect(paddle.getRelativeHitPosition(250)).toBe(0);
        // Top hit
        expect(paddle.getRelativeHitPosition(200)).toBe(-1);
        // Bottom hit
        expect(paddle.getRelativeHitPosition(300)).toBe(1);
    });

    test('should stay within canvas bounds', () => {
        const paddle = new Paddle(20, 0, 10, 100, true);
        paddle.moveUp();
        paddle.update(600);
        expect(paddle.y).toBe(0); // Should not go above 0
        
        const paddle2 = new Paddle(20, 550, 10, 100, true);
        paddle2.moveDown();
        paddle2.update(600);
        expect(paddle2.y).toBe(500); // Should not go below canvas height - paddle height
    });
});

describe('CollisionDetector', () => {
    let detector;

    beforeEach(() => {
        detector = new CollisionDetector();
    });

    describe('AABB Collision Detection', () => {
        test('should detect collision when boxes overlap', () => {
            const bounds1 = { left: 10, right: 30, top: 10, bottom: 30 };
            const bounds2 = { left: 20, right: 40, top: 20, bottom: 40 };
            expect(detector.detectAABBCollision(bounds1, bounds2)).toBe(true);
        });

        test('should not detect collision when boxes do not overlap', () => {
            const bounds1 = { left: 10, right: 30, top: 10, bottom: 30 };
            const bounds2 = { left: 40, right: 60, top: 40, bottom: 60 };
            expect(detector.detectAABBCollision(bounds1, bounds2)).toBe(false);
        });

        test('should detect collision at edges', () => {
            const bounds1 = { left: 10, right: 30, top: 10, bottom: 30 };
            const bounds2 = { left: 30, right: 50, top: 10, bottom: 30 };
            expect(detector.detectAABBCollision(bounds1, bounds2)).toBe(false);
        });
    });

    describe('Ball-Paddle Collision', () => {
        test('should detect collision between ball and left paddle', () => {
            const ball = new Ball(30, 250, 10, -5, 0);
            const paddle = new Paddle(20, 200, 10, 100, true);
            
            const collision = detector.checkBallPaddleCollision(ball, paddle);
            expect(collision).toBe(true);
        });

        test('should detect collision between ball and right paddle', () => {
            const ball = new Ball(770, 250, 10, 5, 0);
            const paddle = new Paddle(770, 200, 10, 100, false);
            
            const collision = detector.checkBallPaddleCollision(ball, paddle);
            expect(collision).toBe(true);
        });

        test('should not detect collision when ball and paddle are apart', () => {
            const ball = new Ball(400, 300, 10, 5, 0);
            const paddle = new Paddle(20, 200, 10, 100, true);
            
            const collision = detector.checkBallPaddleCollision(ball, paddle);
            expect(collision).toBe(false);
        });

        test('should reverse ball direction on paddle hit', () => {
            const ball = new Ball(30, 250, 10, -5, 0);
            const paddle = new Paddle(20, 200, 10, 100, true);
            
            detector.checkBallPaddleCollision(ball, paddle);
            expect(ball.velocityX).toBeGreaterThan(0); // Ball should bounce right
        });

        test('should vary bounce angle based on hit position - center', () => {
            const ball = new Ball(30, 250, 10, -5, 0);
            const paddle = new Paddle(20, 200, 10, 100, true);
            
            detector.checkBallPaddleCollision(ball, paddle);
            // Center hit should have minimal vertical velocity
            expect(Math.abs(ball.velocityY)).toBeLessThan(Math.abs(ball.velocityX));
        });

        test('should vary bounce angle based on hit position - top', () => {
            const ball = new Ball(30, 210, 10, -5, 0);
            const paddle = new Paddle(20, 200, 10, 100, true);
            
            detector.checkBallPaddleCollision(ball, paddle);
            // Top hit should have negative vertical velocity
            expect(ball.velocityY).toBeLessThan(0);
        });

        test('should vary bounce angle based on hit position - bottom', () => {
            const ball = new Ball(30, 290, 10, -5, 0);
            const paddle = new Paddle(20, 200, 10, 100, true);
            
            detector.checkBallPaddleCollision(ball, paddle);
            // Bottom hit should have positive vertical velocity
            expect(ball.velocityY).toBeGreaterThan(0);
        });

        test('should increase ball speed on paddle hit', () => {
            const ball = new Ball(30, 250, 10, -5, 0);
            const paddle = new Paddle(20, 200, 10, 100, true);
            const initialSpeed = ball.speed;
            
            detector.checkBallPaddleCollision(ball, paddle);
            expect(ball.speed).toBeGreaterThan(initialSpeed);
        });

        test('should prevent ball from passing through paddle', () => {
            const ball = new Ball(25, 250, 10, -10, 0); // Fast ball
            const paddle = new Paddle(20, 200, 10, 100, true);
            
            detector.checkBallPaddleCollision(ball, paddle);
            // Ball should be repositioned to the right of the paddle
            expect(ball.x).toBeGreaterThan(paddle.x + paddle.width);
        });

        test('should reposition ball correctly for right paddle', () => {
            const ball = new Ball(775, 250, 10, 10, 0);
            const paddle = new Paddle(770, 200, 10, 100, false);
            
            detector.checkBallPaddleCollision(ball, paddle);
            // Ball should be repositioned to the left of the paddle
            expect(ball.x).toBeLessThan(paddle.x);
        });
    });

    describe('Wall Collision', () => {
        test('should detect collision with top wall', () => {
            const ball = new Ball(400, 5, 10, 5, -3);
            const collision = detector.checkWallCollision(ball, 600);
            expect(collision).toBe(true);
            expect(ball.velocityY).toBeGreaterThan(0); // Should bounce down
        });

        test('should detect collision with bottom wall', () => {
            const ball = new Ball(400, 595, 10, 5, 3);
            const collision = detector.checkWallCollision(ball, 600);
            expect(collision).toBe(true);
            expect(ball.velocityY).toBeLessThan(0); // Should bounce up
        });

        test('should not detect collision when away from walls', () => {
            const ball = new Ball(400, 300, 10, 5, 3);
            const collision = detector.checkWallCollision(ball, 600);
            expect(collision).toBe(false);
        });
    });

    describe('Score Collision', () => {
        test('should detect when ball goes off left side', () => {
            const ball = new Ball(-15, 300, 10, -5, 0);
            const result = detector.checkScoreCollision(ball, 800);
            expect(result).toBe('right'); // Right player scores
        });

        test('should detect when ball goes off right side', () => {
            const ball = new Ball(815, 300, 10, 5, 0);
            const result = detector.checkScoreCollision(ball, 800);
            expect(result).toBe('left'); // Left player scores
        });

        test('should return null when ball is in play', () => {
            const ball = new Ball(400, 300, 10, 5, 0);
            const result = detector.checkScoreCollision(ball, 800);
            expect(result).toBe(null);
        });
    });
});
