import { Mat4x4 } from "../utils/Mat4x4.js";

function subDir(dir1, dir2) {
    let ans = [];
    for (let i = 0; i < dir1.length; i++)
        ans.push(dir1[i] - dir2[i])
    return ans;
}

function dotDir(src, des) {
    let ans = 0;
    for (let i = 0; i < 3; i++)
        ans += src[i] * des[i];
    return ans;
}

function crossProduct(vec1, vec2) {
	let res = [0, 0, 0, 0];
	res[0] = vec1[1] * vec2[2] - vec1[2] * vec2[1];
	res[1] = vec1[2] * vec2[0] - vec1[0] * vec2[2];
	res[2] = vec1[0] * vec2[1] - vec1[1] * vec2[0];
	return res;
}

export class CollisionBox {
    constructor(width, height, depth) {
        this.pos = [0, 0, 0, 1]
        this.degree = 0
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.up = [0, 1, 0, 0];
        this.right = [1, 0, 0, 0];
        this.forward = [0, 0, 1, 0];
        this.upPoint = [0, height / 2, 0, 1];
        this.foPoint = [0, 0, depth / 2, 1];
        this.riPoint = [width / 2, 0, 0, 1];
        this.points = [];
        this.points.push([0, height / 2, 0, 1]); // up
        this.points.push([0, 0, depth / 2, 1]); // foward
        this.points.push([width / 2, 0, 0, 1]); // right
        this.model = Mat4x4.identityMat();
        this.t_mat = Mat4x4.identityMat();
        this.r_mat = Mat4x4.identityMat();
        this.s_mat = Mat4x4.identityMat();
        this.l_top = [-width / 2, height / 2, 0, 1];
        this.r_top = [width / 2, height / 2, 0, 1];
        this.l_bot = [-width / 2, -height / 2, 0, 1];
        this.r_bot = [width / 2, -height / 2, 0, 1];
        this.vertices = [];
        this.vertices.push([-width / 2, height / 2, 0, 1]);
        this.vertices.push([width / 2, height / 2, 0, 1]);
        this.vertices.push([-width / 2, -height / 2, 0, 1]);
        this.vertices.push([width / 2, -height / 2, 0, 1]);
    }

    rotBox(degree) {
        this.r_mat = Mat4x4.rotMatAxisZ(degree);
        this.model = Mat4x4.multipleMat4(this.r_mat, this.s_mat);
        this.model = Mat4x4.multipleMat4(this.t_mat, this.model);
        this.up = Mat4x4.multipleMat4AndVec4(this.r_mat, [0, 1, 0, 0]);
        this.right = Mat4x4.multipleMat4AndVec4(this.r_mat, [1, 0, 0, 0]);
        this.forward = Mat4x4.multipleMat4AndVec4(this.r_mat, [0, 0, 1, 0]);
        this.points[0] = Mat4x4.multipleMat4AndVec4(this.model, this.upPoint);
        this.points[1] = Mat4x4.multipleMat4AndVec4(this.model, this.foPoint);
        this.points[2] = Mat4x4.multipleMat4AndVec4(this.model, this.riPoint);
        this.vertices[0] = Mat4x4.multipleMat4AndVec4(this.model, this.l_top);
        this.vertices[1] = Mat4x4.multipleMat4AndVec4(this.model, this.r_top);
        this.vertices[2] = Mat4x4.multipleMat4AndVec4(this.model, this.l_bot);
        this.vertices[3] = Mat4x4.multipleMat4AndVec4(this.model, this.r_bot);
    }

    moveBox(mvX, mvY, mvZ) {
        this.t_mat = Mat4x4.transportMat([mvX, mvY, mvZ, 1])
        this.model = Mat4x4.multipleMat4(this.r_mat, this.s_mat);
        this.model = Mat4x4.multipleMat4(this.t_mat, this.model);
        this.pos = Mat4x4.multipleMat4AndVec4(this.model, [0, 0, 0, 1]);
        this.points[0] = Mat4x4.multipleMat4AndVec4(this.model, this.upPoint);
        this.points[1] = Mat4x4.multipleMat4AndVec4(this.model, this.foPoint);
        this.points[2] = Mat4x4.multipleMat4AndVec4(this.model, this.riPoint);
        this.vertices[0] = Mat4x4.multipleMat4AndVec4(this.model, this.l_top);
        this.vertices[1] = Mat4x4.multipleMat4AndVec4(this.model, this.r_top);
        this.vertices[2] = Mat4x4.multipleMat4AndVec4(this.model, this.l_bot);
        this.vertices[3] = Mat4x4.multipleMat4AndVec4(this.model, this.r_bot);
    }

    scaleBox(w_scale, h_scale) {
        this.s_mat = Mat4x4.identityMat();
        this.s_mat[0] = w_scale;
        this.s_mat[5] = h_scale;
        this.model = Mat4x4.multipleMat4(this.r_mat, this.s_mat);
        this.model = Mat4x4.multipleMat4(this.t_mat, this.model);
        this.points[0] = Mat4x4.multipleMat4AndVec4(this.model, this.upPoint);
        this.points[1] = Mat4x4.multipleMat4AndVec4(this.model, this.foPoint);
        this.points[2] = Mat4x4.multipleMat4AndVec4(this.model, this.riPoint);
        this.vertices[0] = Mat4x4.multipleMat4AndVec4(this.model, this.l_top);
        this.vertices[1] = Mat4x4.multipleMat4AndVec4(this.model, this.r_top);
        this.vertices[2] = Mat4x4.multipleMat4AndVec4(this.model, this.l_bot);
        this.vertices[3] = Mat4x4.multipleMat4AndVec4(this.model, this.r_bot);
        this.width = w_scale;
        this.height = h_scale;
    }

    collision(otherBox) {
        let ab = subDir(this.pos, otherBox.pos);
        let unique = [];
        for (let i = 0; i < 3; i++) {
            unique.push(subDir(this.points[i], this.pos));
            unique.push(subDir(otherBox.points[i], otherBox.pos));
        }
        let SAT = [this.up, this.right, this.forward, otherBox.up, otherBox.right, otherBox.forward];
        SAT.push(crossProduct(this.up, otherBox.up));
        SAT.push(crossProduct(this.up, otherBox.right));
        SAT.push(crossProduct(this.up, otherBox.forward));
        SAT.push(crossProduct(this.right, otherBox.up));
        SAT.push(crossProduct(this.right, otherBox.right));
        SAT.push(crossProduct(this.right, otherBox.forward));
        SAT.push(crossProduct(this.forward, otherBox.up));
        SAT.push(crossProduct(this.forward, otherBox.right));
        SAT.push(crossProduct(this.forward, otherBox.forward));
        for (let i = 0; i < SAT.length; i++) {
            let total = 0;
            for (let j = 0; j < 6; j++) {
                total += Math.abs(dotDir(SAT[i], unique[j]));
            }
            let dist = Math.abs(dotDir(ab, SAT[i]));
            if (dist > total)
                return false;
        }
        return true;
    }
};