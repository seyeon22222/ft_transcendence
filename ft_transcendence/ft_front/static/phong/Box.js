import { Mat4x4 } from "../utils/Mat4x4.js";
import { CollisionBox } from "./CollisionBox.js";
import { Mesh } from "../graphics/Mesh.js";
import { Buffer } from "../graphics/Buffer.js";
import { VertexBuffer } from "../graphics/VertexBuffer.js";

export class Box {
    constructor (gl) {
        this.colbox;
        this.pos_mat = Mat4x4.identityMat();
        this.rot_mat = Mat4x4.identityMat();
        this.scale_mat = Mat4x4.identityMat();
        this.model = Mat4x4.identityMat();
        this.mesh;
        this.collision_mesh;
        this.c_buffer;
        this.gl = gl;
        this.model_loc;
        this.width;
        this.height;
        this.pos = [0, 0, 0, 1];
        this.color = [1, 1, 1, 1];
        this.degree = 0;
    }

    createBox(sizeWidth, sizeHeight) {
        this.id = "box";
        let x = sizeWidth / 2.0;
        let y = sizeHeight / 2.0;
        this.width = sizeWidth;
        this.height = sizeHeight;
        const verticesData = [
            // 앞면(Back face)
            -x, -y, 0.1,  -x, y, 0.1,  x, y, 0.1,  x, -y, 0.1,
            
            // 뒷면(Front face)
            -x, -y, -0.1,   x, -y, -0.1,   x, y, -0.1,  -x, y, -0.1,

            // 윗면(Top face)
            -x, y, -0.1,  -x, y, 0.1,   x, y, 0.1,   x, y, -0.1,

            // 아랫면(Bottom face)
            -x, -y, -0.1,  -x, -y, 0.1,  x, -y, 0.1,  x, -y, -0.1,

            // 오른쪽면(Right face)
            x, y, -0.1,  x, -y, -0.1,  x, -y, 0.1,  x, y, 0.1,

            // 왼쪽면(Left face)
            -x, y, -0.1,  -x, y, 0.1,   -x, -y, 0.1,  -x, -y, -0.1,
        ];
        let vertices = new Float32Array(verticesData);
        let v_buffer = new Buffer(this.gl, this.gl.ARRAY_BUFFER, vertices.length * 4, this.gl.STATIC_DRAW);
        v_buffer.setData(0, vertices, 0, vertices.length * 4);
        let pos_view = new VertexBuffer(this.gl, v_buffer, 3, this.gl.FLOAT, false);
        let indices = [ 0, 2, 1, 0, 3, 2, // 앞
                         4, 6, 5, 4, 7, 6, // 뒤
                         8, 9, 10, 8, 10, 11, // 위
                         12, 15, 13, 15, 14, 13, // 아래
                         16, 19, 18, 16, 18, 17, // 오른 
                         21, 20, 22, 22, 20, 23]; // 왼
        let color_data = [];
        for (let i = 0; i < 24; i++) {
            for (let j = 0; j < 4; j++) color_data.push(1);
        }
        color_data = new Float32Array(color_data);
        this.c_buffer = new Buffer(this.gl, this.gl.ARRAY_BUFFER, color_data.length * 4, this.gl.STATIC_DRAW);
        this.c_buffer.setData(0, color_data, 0, color_data.length * 4);
        let color_view = new VertexBuffer(this.gl, this.c_buffer, 4, this.gl.FLOAT, false);
        let buffer_view = {
            position: pos_view,
            color: color_view
        };
        this.mesh = Mesh.from(this.gl, buffer_view, indices);
        this.setCollisionMesh();
        this.colbox = new CollisionBox(this.width, this.height, 0.2);
    }

    setCollisionMesh() {
        let x = this.width / 2.0;
        let y = this.height / 2.0;
        const verticesData = [
            // 앞면(Back face)
            -x, -y, 0.12,  -x, y, 0.12,  x, y, 0.12,  x, -y, 0.12,
            
            // 뒷면(Front face)
            -x, -y, -0.12,   x, -y, -0.12,   x, y, -0.12,  -x, y, -0.12,

            // 윗면(Top face)
            -x, y, -0.12,  -x, y, 0.12,   x, y, 0.12,   x, y, -0.12,

            // 아랫면(Bottom face)
            -x, -y, -0.12,  -x, -y, 0.12,  x, -y, 0.12,  x, -y, -0.12,

            // 오른쪽면(Right face)
            x, y, -0.12,  x, -y, -0.12,  x, -y, 0.12,  x, y, 0.12,

            // 왼쪽면(Left face)
            -x, y, -0.12,  -x, y, 0.12,   -x, -y, 0.12,  -x, -y, -0.12,
        ];
        const vertices = new Float32Array(verticesData);
        const vertex_buffer = new Buffer(this.gl, this.gl.ARRAY_BUFFER, vertices.length * 4, this.gl.STATIC_DRAW);
        vertex_buffer.setData(0, vertices, 0, vertices.length * 4);
        const vertex_view = new VertexBuffer(this.gl, vertex_buffer, 3, this.gl.FLOAT, false);
        const color = [1, 0, 0, 1];
        let color_data = [];
        for (let i = 0; i < 24; i++) {
            for (let j = 0; j < 4; j++)
                color_data.push(color[j]);
        }
        color_data = new Float32Array(color_data);
        const color_buffer = new Buffer(this.gl, this.gl.ARRAY_BUFFER, color_data.length * 4, this.gl.STATIC_DRAW);
        color_buffer.setData(0, color_data, 0, color_data.length * 4);
        const color_view = new VertexBuffer(this.gl, color_buffer, 4, this.gl.FLOAT, false);
        const buffer_view = {
            position: vertex_view,
            color: color_view
        };
        let indices = [ 0, 2, 1, 0, 3, 2, // 앞
            4, 6, 5, 4, 7, 6, // 뒤
            8, 9, 10, 8, 10, 11, // 위
            12, 15, 13, 15, 14, 13, // 아래
            16, 19, 18, 16, 18, 17, // 오른 
            21, 20, 22, 22, 20, 23]; // 왼
        this.collision_mesh = Mesh.from(this.gl, buffer_view, indices);
    }

    movePos(pos) {
        this.pos_mat = Mat4x4.transportMat(pos);
        this.model = Mat4x4.multipleMat4(this.rot_mat, this.scale_mat);
        this.model = Mat4x4.multipleMat4(this.pos_mat, this.model);
        this.colbox.moveBox(pos[0], pos[1], pos[2]);
        for (let i = 0; i < 3; i++)
            this.pos[i] = pos[i];
        this.pos[3] = 1;
    }

    rotBox(degree) {
        this.rot_mat = Mat4x4.rotMatAxisZ(degree);
        this.model = Mat4x4.multipleMat4(this.rot_mat, this.scale_mat);
        this.model = Mat4x4.multipleMat4(this.pos_mat, this.model);
        this.colbox.rotBox(degree);
        this.degree = degree;
    }

    setScaleBox(width, height) {
        this.scale_mat = Mat4x4.identityMat();
        this.scale_mat[0] = width;
        this.scale_mat[5] = height;
        this.width = width;
        this.height = height;
        this.model = Mat4x4.multipleMat4(this.rot_mat, this.scale_mat);
        this.model = Mat4x4.multipleMat4(this.pos_mat, this.model);
        this.colbox.scaleBox(width, height);
    }

    setColor(color) {
        for (let i = 0; i < 4; i++)
            this.color[i] = color[i];
        let color_data = [];
        for (let i = 0; i < 24; i++) {
            for (let j = 0; j < 4; j++) color_data.push(color[j])
        }
        color_data = new Float32Array(color_data);
        this.c_buffer.setData(0, color_data, 0, color_data.length * 4);
    }

    setModelLoc(loc) {
        this.model_loc = loc;
    }

    draw(collision_flag) {
        this.gl.uniformMatrix4fv(this.model_loc, true, this.model);
        if (collision_flag === false)
            this.mesh.draw();
        else {
            this.collision_mesh.draw();
        }
    }

    collision(object) {
        return this.colbox.collision(object.colbox);
    }

    collisionRay(ray_des) {
        let inv_model = Mat4x4.invMat4(this.model);
        let des = Mat4x4.multipleMat4AndVec4(inv_model, ray_des);
        let h = this.height / 2;
        let w = this.width / 2;
        if (des[0] < w && des[0] > -w && des[1] < h && des[1] > -h)
            return true;
        return false;
    }
};
