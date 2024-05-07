import { MOVE_DIRECTION, CANVAS_HEIGHT, CANVAS_WIDTH } from './global.js';

const PLAYER_WIDTH = 18;
const PLAYER_HEIGHT = 70;
const PLAYER_DIST_X = 150;
const PLAYER_SPEED = 10;
const PLAYER_COLOR = '#ffffff';

class Player {
    constructor(dir) {
        this.width = PLAYER_WIDTH;
        this.height = PLAYER_HEIGHT;
        this.x = dir === 'left' ? PLAYER_DIST_X : CANVAS_WIDTH - PLAYER_DIST_X;
        this.y = (CANVAS_HEIGHT / 2) - (PLAYER_WIDTH * 2);
        this.move = MOVE_DIRECTION.IDLE;
        this.speed = PLAYER_SPEED;
        this.side = dir;
        this.color = PLAYER_COLOR;
    }

    drawPlayer(context) {
        context.fillStyle = this.color;
        context.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    movePlayer() {
        if (this.move === MOVE_DIRECTION.UP)
            this.y -= this.speed;
        else if (this.move === MOVE_DIRECTION.DOWN)
            this.y += this.speed;
        
        if (this.y <= 0)
            this.y = 0;
        else if (this.y >= CANVAS_HEIGHT - PLAYER_HEIGHT)
            this.y = CANVAS_HEIGHT - PLAYER_HEIGHT;
    }

    getMoveDirection() {
        return this.move;
    }

    setMoveDirection(dir) {
        this.move = dir;
    }

    getPlayerPositionInfo() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
};

/* export */
export { Player };