import { MOVE_DIRECTION, CANVAS_HEIGHT, CANVAS_WIDTH } from './global.js';

const BALL_WIDTH = 18;
const BALL_HEIGHT = 18;
const BALL_SPEED = 12;

class Ball {
    constructor() {
        this.width = BALL_WIDTH;
        this.height = BALL_HEIGHT;
        this.x = (CANVAS_WIDTH / 2) - (BALL_WIDTH / 2);
		this.y = (CANVAS_HEIGHT / 2) - (BALL_HEIGHT / 2);
		this.setRandomDirectionX();
		this.setRandomDirectionY();
		this.setRandomSpeed();
        this.color = '#ff0000'; // ball color;
    }

    setRandomDirectionX() {
        if (Math.round(Math.random()))
            this.moveX = MOVE_DIRECTION.LEFT;
        else
            this.moveX = MOVE_DIRECTION.RIGHT;
    }

    setRandomDirectionY() {
        if (Math.round(Math.random()))
            this.moveY = MOVE_DIRECTION.UP;
        else
            this.moveY = MOVE_DIRECTION.DOWN;
    }

    setRandomSpeed() {
        const angle = Math.random() * Math.PI / 4; // 0 ~ π/4 사이의 랜덤한 각도
        this.speed_x = Math.round(Math.cos(angle) * BALL_SPEED * 10) / 10;
        this.speed_y = Math.round(Math.sin(angle) * BALL_SPEED * 10) / 10;

        //debug
        console.log(this.speed_x, this.speed_y);
    }

    resetBall(loser) {
        this.x = (CANVAS_WIDTH / 2) - (BALL_WIDTH / 2);
		this.y = (CANVAS_HEIGHT / 2) - (BALL_HEIGHT / 2);

        this.setRandomSpeed();

        if (loser === 'left')
            this.moveX = MOVE_DIRECTION.RIGHT;
        else
            this.moveX = MOVE_DIRECTION.LEFT;

        this.setRandomDirectionY();
    }

    drawBall(context) {
        context.fillStyle = this.color;
        context.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    isBallTouchLeftBorder() {
        if (this.x <= 0)
            return true;
        return false;
    }

    isBallTouchRightBorder() {
        if (this.x >= CANVAS_WIDTH - BALL_WIDTH)
            return true;
        return false;
    }

    moveBall() {
        // 벽 충돌에 따른 방향전환
        if (this.y <= 0)
            this.moveY = MOVE_DIRECTION.DOWN;
        else if (this.y >= CANVAS_HEIGHT - BALL_HEIGHT)
            this.moveY = MOVE_DIRECTION.UP;

        // 방향에 따른 공 움직임
        if (this.moveY === MOVE_DIRECTION.UP)
            this.y -= (this.speed_y);
        else if (this.moveY === MOVE_DIRECTION.DOWN)
            this.y += (this.speed_y);
        
        if (this.moveX === MOVE_DIRECTION.LEFT)
            this.x -= this.speed_x;
        else if (this.moveX === MOVE_DIRECTION.RIGHT)
            this.x += this.speed_x;
    }

    hitPlayerPaddle(leftPlayer, rightPlayer) {
        if (this.x - this.width <= leftPlayer.x && this.x >= leftPlayer.x - leftPlayer.width)
            if (this.y <= leftPlayer.y + leftPlayer.height && this.y + this.height >= leftPlayer.y)
            {
                this.x = leftPlayer.x + this.width;
                this.moveX = MOVE_DIRECTION.RIGHT;
            }

        if (this.x - this.width <= rightPlayer.x && this.x >= rightPlayer.x - rightPlayer.width)
            if (this.y <= rightPlayer.y + rightPlayer.height && this.y + this.height >= rightPlayer.y)
            {
                this.x = rightPlayer.x - this.width;
                this.moveX = MOVE_DIRECTION.LEFT;
            }
    }
};

/* export */
export { Ball };