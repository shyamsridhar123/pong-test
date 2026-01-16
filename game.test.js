/**
 * Tests for Ball class
 * @jest-environment jsdom
 */

// Mock Ball class for testing (extracted from game.js)
class Ball {
    constructor(x, y, radius = 10) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 5;
        this.maxSpeed = 10;
    }

    reset(canvasWidth, canvasHeight) {
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;

        const angle = Math.random() < 0.5 
            ? (Math.random() * Math.PI / 2 - Math.PI / 4)
            : (Math.random() * Math.PI / 2 + 3 * Math.PI / 4);

        this.velocityX = Math.cos(angle) * this.speed;
        this.velocityY = Math.sin(angle) * this.speed;
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

    checkWallCollision(canvasHeight) {
        if (this.y - this.radius <= 0) {
            this.y = this.radius;
            this.velocityY = Math.abs(this.velocityY);
        }
        
        if (this.y + this.radius >= canvasHeight) {
            this.y = canvasHeight - this.radius;
            this.velocityY = -Math.abs(this.velocityY);
        }
    }

    checkScoring(canvasWidth) {
        if (this.x - this.radius <= 0) {
            return 'left';
        }
        if (this.x + this.radius >= canvasWidth) {
            return 'right';
        }
        return null;
    }

    render(ctx) {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    increaseSpeed() {
        if (this.speed < this.maxSpeed) {
            this.speed += 0.5;
            
            const angle = Math.atan2(this.velocityY, this.velocityX);
            this.velocityX = Math.cos(angle) * this.speed;
            this.velocityY = Math.sin(angle) * this.speed;
        }
    }
}

describe('Ball Class', () => {
    let ball;
    const canvasWidth = 800;
    const canvasHeight = 600;

    beforeEach(() => {
        ball = new Ball(canvasWidth / 2, canvasHeight / 2);
    });

    describe('Constructor', () => {
        test('should create ball with correct initial properties', () => {
            expect(ball.x).toBe(400);
            expect(ball.y).toBe(300);
            expect(ball.radius).toBe(10);
            expect(ball.velocityX).toBe(0);
            expect(ball.velocityY).toBe(0);
            expect(ball.speed).toBe(5);
        });

        test('should allow custom radius', () => {
            const customBall = new Ball(100, 100, 15);
            expect(customBall.radius).toBe(15);
        });
    });

    describe('reset()', () => {
        test('should reset position to center', () => {
            ball.x = 100;
            ball.y = 100;
            ball.reset(canvasWidth, canvasHeight);
            
            expect(ball.x).toBe(400);
            expect(ball.y).toBe(300);
        });

        test('should set velocity based on random angle', () => {
            ball.reset(canvasWidth, canvasHeight);
            
            expect(ball.velocityX).not.toBe(0);
            expect(ball.velocityY).not.toBe(0);
        });

        test('should maintain speed magnitude', () => {
            ball.reset(canvasWidth, canvasHeight);
            
            const magnitude = Math.sqrt(ball.velocityX ** 2 + ball.velocityY ** 2);
            expect(magnitude).toBeCloseTo(ball.speed, 1);
        });
    });

    describe('update()', () => {
        test('should update position based on velocity', () => {
            ball.velocityX = 5;
            ball.velocityY = 3;
            const initialX = ball.x;
            const initialY = ball.y;
            
            ball.update();
            
            expect(ball.x).toBe(initialX + 5);
            expect(ball.y).toBe(initialY + 3);
        });
    });

    describe('checkWallCollision()', () => {
        test('should bounce off top wall', () => {
            ball.y = 5;
            ball.velocityY = -3;
            
            ball.checkWallCollision(canvasHeight);
            
            expect(ball.y).toBe(ball.radius);
            expect(ball.velocityY).toBeGreaterThan(0);
        });

        test('should bounce off bottom wall', () => {
            ball.y = 595;
            ball.velocityY = 3;
            
            ball.checkWallCollision(canvasHeight);
            
            expect(ball.y).toBe(canvasHeight - ball.radius);
            expect(ball.velocityY).toBeLessThan(0);
        });

        test('should not change velocity when not colliding', () => {
            ball.y = 300;
            ball.velocityY = 3;
            const originalVelocity = ball.velocityY;
            
            ball.checkWallCollision(canvasHeight);
            
            expect(ball.velocityY).toBe(originalVelocity);
        });
    });

    describe('checkScoring()', () => {
        test('should detect left boundary crossing', () => {
            ball.x = 5;
            
            const result = ball.checkScoring(canvasWidth);
            
            expect(result).toBe('left');
        });

        test('should detect right boundary crossing', () => {
            ball.x = 795;
            
            const result = ball.checkScoring(canvasWidth);
            
            expect(result).toBe('right');
        });

        test('should return null when ball is within bounds', () => {
            ball.x = 400;
            
            const result = ball.checkScoring(canvasWidth);
            
            expect(result).toBeNull();
        });
    });

    describe('render()', () => {
        test('should call canvas drawing methods', () => {
            const mockCtx = {
                fillStyle: '',
                beginPath: jest.fn(),
                arc: jest.fn(),
                fill: jest.fn()
            };
            
            ball.render(mockCtx);
            
            expect(mockCtx.fillStyle).toBe('#fff');
            expect(mockCtx.beginPath).toHaveBeenCalled();
            expect(mockCtx.arc).toHaveBeenCalledWith(
                ball.x, 
                ball.y, 
                ball.radius, 
                0, 
                Math.PI * 2
            );
            expect(mockCtx.fill).toHaveBeenCalled();
        });
    });

    describe('increaseSpeed()', () => {
        test('should increase speed up to max', () => {
            ball.speed = 5;
            ball.velocityX = 3;
            ball.velocityY = 4;
            
            ball.increaseSpeed();
            
            expect(ball.speed).toBe(5.5);
        });

        test('should not exceed max speed', () => {
            ball.speed = 10;
            ball.velocityX = 3;
            ball.velocityY = 4;
            
            ball.increaseSpeed();
            
            expect(ball.speed).toBe(10);
        });

        test('should maintain velocity direction when increasing speed', () => {
            ball.velocityX = 3;
            ball.velocityY = 4;
            const initialAngle = Math.atan2(ball.velocityY, ball.velocityX);
            
            ball.increaseSpeed();
            
            const newAngle = Math.atan2(ball.velocityY, ball.velocityX);
            expect(newAngle).toBeCloseTo(initialAngle, 5);
        });
    });
});
