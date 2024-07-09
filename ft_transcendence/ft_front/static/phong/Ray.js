import { Mat4x4, normalizeVec } from "../utils/Mat4x4.js";
import { Mat4 } from "../utils/Mat4.js";

export class Ray {
    constructor(cam) {
        this.origin = [0, 0, 0, 1];
        this.dir = [0, 0, 0, 0];
        this.canvas = document.getElementById("canvas");
        this.inv_porj = Mat4x4.invMat4(cam.proj_mat);
        this.inv_view = Mat4x4.invMat4(cam.view_mat);
        this.cam = cam;
        this.ray_des = null;
    }

    windowToCanvasNDC(x, y) {
        let box = this.canvas.getBoundingClientRect();
        let x_ndc = (x - box.left) * (this.canvas.width/ box.width);
        x_ndc = 2 * x_ndc / this.canvas.width - 1;
        let y_ndc = (y - box.top) * (this.canvas.height / box.height);
        y_ndc = 1 - 2 * y_ndc / this.canvas.height;
        return {
            x: x_ndc,
            y: y_ndc
        };
    }

    setRay(x, y) {
        this.inv_view = Mat4x4.invMat4(this.cam.view_mat);
        let ori = this.windowToCanvasNDC(x, y);
        let f_near = -this.cam.near;
        ori = [ori.x * -f_near, ori.y * -f_near, f_near, -f_near];
        ori = Mat4x4.multipleMat4AndVec4(this.inv_porj, ori);
        ori = Mat4x4.multipleMat4AndVec4(this.inv_view, ori);
        for (let i = 0; i < 3; i++)
            this.origin[i] = ori[i];
		let dir = Mat4.sub(this.origin, this.cam.pos);
		dir = normalizeVec(dir);
		this.dir = [dir[0], dir[1], dir[2], 0];
		let t = -Mat4.dot(this.cam.pos, [0, 0, 1, 0]) / Mat4.dot(this.dir, [0, 0, 1, 0]);
		this.ray_des = Mat4.sum(this.cam.pos, Mat4.mulConst(t, this.dir));
		this.ray_des[3] = 1;
    }
}