import { CANVAS_HEIGHT, CANVAS_WIDTH, WINNABLE_ROUND } from './global.js';

const NET_WIDTH = 10;
const NET_DIST = 140;
const NET_COLOR = '#ffffff';

const TEXT_COLOR = '#ffffff';
const TEXT_DIST = 300;

const BACK_COLOR = '#2c3e50';

class Game {
    constructor() {
        this.running = false;
        this.over = false;
        this.timer = 0;
        this.color = BACK_COLOR;
        this.score_left = 0;
        this.score_right = 0;
        this.winner = null;
    }

    resetGame(loser) {
        if (loser === 'left')
            this.score_right += 1;
        else
            this.score_left += 1;
        
        if (loser === 'left' && this.score_right >= WINNABLE_ROUND)
        {
            this.over = true;
            this.winner = 'right';
        }
        else if (loser === 'right' && this.score_left >= WINNABLE_ROUND)
        {
            this.over = true;
            this.winner = 'left';
        }
    }

    drawBack(context) {
        // draw backgroud
        context.fillStyle = this.color;
        context.fillRect(
            0,
            0,
            CANVAS_WIDTH,
            CANVAS_HEIGHT
        );
    }

    drawMessage(context, message) {
        // draw small rectangle for message background
        context.font = '50px Courier New';
        context.fillStyle = BACK_COLOR;
        context.fillRect(
            CANVAS_WIDTH / 2 - 350,
            CANVAS_HEIGHT / 2 - 48,
            700,
            100
        );

        // draw message
        context.fillStyle = TEXT_COLOR;
        context.fillText(
            message,
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT / 2 + 15
        );
    }

    drawNet(context) {
        context.beginPath();
		context.setLineDash([7, 15]);
		context.moveTo((CANVAS_WIDTH / 2), CANVAS_HEIGHT - NET_DIST);
		context.lineTo((CANVAS_WIDTH / 2), NET_DIST);
		context.lineWidth = NET_WIDTH;
		context.strokeStyle = NET_COLOR;
		context.stroke();
    }

    drawScore(context) {
        context.fillStyle = TEXT_COLOR;
        context.font = '100px Courier New';
        context.textAlign = 'center';

        context.fillText(
            this.score_left.toString(),
            (CANVAS_WIDTH / 2) - TEXT_DIST,
            200
        );

        context.fillText(
            this.score_right.toString(),
            (CANVAS_WIDTH / 2) + TEXT_DIST,
            200
        );

        context.font = '40px Courier';

        context.fillText(
            WINNABLE_ROUND,
            (CANVAS_WIDTH / 2),
            100
        );
    }

    getRunningState() {
        return this.running;
    }

    setRunningState(state) {
        this.running = state;
    }

    getOverState() {
        return this.over;
    }

    setOverState(state) {
        this.over = state;
    }

    getWinner() {
        return this.winner;
    }
};

/* export */
export { Game };