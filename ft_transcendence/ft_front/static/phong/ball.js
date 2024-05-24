const MIN = 0.000000001;

function setSameDir(des, src) {
    if (des.length != src.length)
        return false;
    for (let i = 0; i < des.length; i++)
        des[i] = src[i];
    return true;
}

function sumDir(dir1, dir2) {
    let answer = [0, 0, 0];
    answer[0] = dir1[0] + dir2[0];
    answer[1] = dir1[1] + dir2[1];
    answer[2] = dir1[2] + dir2[2];
    return answer;
}

function subDir(dir1, dir2) {
    let answer = [0.0, 0.0, 0.0];
    answer[0] = dir1[0] - dir2[0];
    answer[1] = dir1[1] - dir2[1];
    answer[2] = dir1[2] - dir2[2];
    return answer;
}

function mulConst(num, dir) {
    let answer = [0.0, 0.0, 0.0];
    answer[0] = num * dir[0];
    answer[1] = num * dir[1];
    answer[2] = num * dir[2];
    return answer;
}

function setZero(dir) {
    for (let i = 0; i < dir.length; i++)
        dir[i] = 0;
}

function isZero(dir) {
    for (let i = 0; i < 3; i++) {
        if (Math.abs(dir[i]) > 0.0000000001) 
            return false;
    }
    return true;
}

function isSame(dir1, dir2) {
    if (dir1.length != dir2.length)
        return false;
    for (let i = 0; i < dir1.length; i++) {
        if (dir1[i] != dir2[i])
            return false;
    }
    return true;
}

class Ball {
    constructor() {
        this.pos = [0, 0, 0];
        this.dir = [1, 0, 0];
    }

    len(vec) {
        return vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2];
    }

    dist(vec1, vec2) {
        let answer = [];
        answer.push(vec1[0] - vec2[0]);
        answer.push(vec1[1] - vec2[1]);
        answer.push(vec1[2] - vec2[2]);
        return Math.sqrt(this.len(answer));
    }

    crash(posi) {
        let length = this.dist(this.pos, posi);
        if (length <= 0.5)
            return true;
        return false;
    }

    normalized(vec) {
        let answer = [vec[0], vec[1], vec[2]];
        let length = this.len(vec);
        if (Math.abs(length) < MIN) {
            answer[0] = 0;
            answer[1] = 0;
            answer[2] = 0;
            return answer;
        }
        length = Math.sqrt(length);
        answer[0] /= length;
        answer[1] /= length;
        answer[2] /= length;
        return answer;
    }

    crashStick(stk) {
        if (this.pos[1] > stk.top[1] || this.pos[1] < stk.bottom[1])
            return false;
        if (Math.abs(this.pos[0] - stk.top[0]) > 0.5)
            return false;
        return true;
    }

    dot(vec1, vec2) {
        return Math.abs(vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2]);
    }

    update(stick1, stick2, speed) {
        if (this.pos[0] > 15.5 || this.pos[0] < -15.5) {
            this.pos = [0, 0, 0];
            this.dir = [-1, 0, 0];
            return false;
        }
        let stick1_flag = 0;
        let stick2_flag = 0;
        let dir_norm = [0, 0, 0];
        if (this.crash([this.pos[0], 7.75, 0])) {
            dir_norm = sumDir(dir_norm, [0, -1, 0]);
        }
        if (this.crash([this.pos[0], -7.75, 0])) {
            let dir_tmp = [0, 1, 0];
            dir_norm = sumDir(dir_norm, dir_tmp);
        }
        if (this.crashStick(stick1)) {
            let dir_tmp = [1, 0, 0];
            dir_norm = sumDir(dir_norm, dir_tmp);
            dir_norm = sumDir(dir_norm, stick1.dir);
            stick1_flag = 1;
        }
        if (this.crashStick(stick2)) {
            let dir_tmp = [-1, 0, 0];
            dir_norm = sumDir(dir_norm, dir_tmp);
            dir_norm = sumDir(dir_norm, stick2.dir);
            stick2_flag = 1;
        }
        dir_norm = this.normalized(dir_norm);
        let len = this.dot(dir_norm, mulConst(-1, this.dir));
        let s_norm = mulConst(2 * len, dir_norm);
        dir_norm = sumDir(this.dir, s_norm);
        len = Math.abs(dir_norm[0]);
        if (len < MIN) {
            if (this.dir[0] > 0) {
                if (stick2_flag)
                    dir_norm[0] = -1;
                else
                    dir_norm[0] = 1;
            }
            else {
                if (stick1_flag)
                    dir_norm[0] = 1;
                else
                    dir_norm[0] = -1;
            }
            len = 1;
        }
        dir_norm = mulConst(1.0 / len, dir_norm);
        let move = mulConst(speed, dir_norm);
        let after = sumDir(this.pos, move);

        setSameDir(this.pos, after);
        setSameDir(this.dir, this.normalized(dir_norm));
        return true;
    }
}


class Stick {
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
    update(move) {
        if (this.top[1] + move > 7.75 || this.bottom[1] + move < -7.75) {
            this.dir = [0, 0, 0];
            return;
        }
        this.top[1] += move;
        this.bottom[1] += move;
        this.pos[1] += move;
        if (move > 0)
            this.dir = [0, 1, 0];
        else if (move < 0)
            this.dir = [0, -1, 0];
        else
            this.dir = [0, 0, 0];
    }
}