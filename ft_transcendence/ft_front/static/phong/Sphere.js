import { Mat4x4 } from "../utils/Mat4x4.js";
import { Mesh } from "../graphics/Mesh.js";
import { Buffer } from "../graphics/Buffer.js";
import { VertexBuffer } from "../graphics/VertexBuffer.js";
import { CollisionBox } from "./CollisionBox.js";

export class Sphere {
    constructor (gl) {
        this.colbox;
        this.model = Mat4x4.identityMat();
        this.mesh;
        this.c_buffer;
        this.gl = gl;
        this.model_loc;
        this.pos = [0, 0, 0, 1];
        this.radius = 0.5;
    }
    
    createSphere() {
        const dTheta = 180.0 / 20.0;
        const theta = 360.0 / 20.0;

        let vertices = [];
        for (let i = 0; i <= 20; i++) {
            let startPoint = Mat4x4.multipleMat4AndVec4(Mat4x4.rotMatAxisZ(dTheta * i), [0.0, -0.5, 0.0, 1.0]);
            for (let j = 0; j <= 20; j++) {
                let v = Mat4x4.multipleMat4AndVec4(Mat4x4.rotMatAxisY(theta * j), startPoint);
                vertices.push(v[0]);
                vertices.push(v[1]);
                vertices.push(v[2]);
            }
        }
        vertices = new Float32Array(vertices);
        let indices = [];
        for (let i = 0; i < 20; i++) {
            let offset = 21 * i;
            for (let j = 0; j < 20; j++) {
                indices.push(offset + j);
                indices.push(offset + j + 1);
                indices.push(offset + 21 + j);

                indices.push(offset + j + 1);
                indices.push(offset + 21 + j + 1);
                indices.push(offset + 21 + j);
            }
        }
        let v_buffer = new Buffer(this.gl,  this.gl.ARRAY_BUFFER, vertices.length * 4, this.gl.STATIC_DRAW);
        v_buffer.setData(0, vertices, 0, vertices.length * 4);
        let pos_view = new VertexBuffer(this.gl, v_buffer, 3, this.gl.FLOAT, false);
        let color_data = [];
        for (let i = 0; i < 21 * 21; i++) {
            for (let j = 0; j < 4; j++) 
                color_data.push(1);
        }
        color_data = new Float32Array(color_data);
        this.c_buffer = new Buffer(this.gl, this.gl.ARRAY_BUFFER, color_data.length * 4, this.gl.STATIC_DRAW);
        this.c_buffer.setData(0, color_data, 0, color_data.length * 4);
        let color_view = new VertexBuffer(this.gl, this.c_buffer, 4, this.gl.FLOAT, false);
        let buffer_view = {
            position: pos_view,
            color: color_view,
        };
        this.mesh = Mesh.from(this.gl, buffer_view, indices);
        this.colbox = new CollisionBox(1, 1, 1);
    }

    movePos(pos) {
        this.model = Mat4x4.transportMat(pos);
        this.colbox.moveBox(pos[0], pos[1], pos[2]);
        this.pos = [pos[0], pos[1], pos[2], 1];
    }

    setColor(color4) {
        let color_data = [];
        for (let i = 0; i < 21 * 21; i++) {
            for (let j = 0; j < 4; j++) color_data.push(color4[j]);
        }
        color_data = new Float32Array(color_data);
        this.c_buffer.setData(0, color_data, 0, color_data.length * 4);
    }

    setModelLoc(loc) {
        this.model_loc = loc;
    }

    draw(flag) {
        this.gl.uniformMatrix4fv(this.model_loc, true, this.model);
        this.mesh.draw();
    }

    collision(object) {
        return this.colbox.collision(object.colbox);
    }
};
