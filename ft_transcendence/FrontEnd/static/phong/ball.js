export class Ball {
    constructor() {
        this.pos = [0, 0, 0];
        this.dir = [1, 0, 0];
    }
}


export class Stick {
    constructor(position) {
        this.top;
        this.bottom;
        this.pos = position;
        if (this.pos[0] < 0) {
            this.top = [this.pos[0] + 0.25, this.pos[1] + 1.5, 0];
            this.bottom = [this.pos[0] + 0.25, this.pos[1] - 1.5, 0];
        }
        else {
            this.top = [this.pos[0] - 0.25, this.pos[1] + 1.5, 0];
            this.bottom = [this.pos[0] - 0.25, this.pos[1] - 1.5, 0];
        }
        this.dir = [0, 0, 0];
    }
}