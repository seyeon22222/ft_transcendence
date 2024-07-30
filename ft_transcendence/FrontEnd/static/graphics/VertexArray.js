export class VertexArray {
    constructor(gl) {
        const vertex_array = gl.createVertexArray();

        this.id = vertex_array;
        this.gl = gl;
    }

    attach(vbo, idx) {
        this.gl.bindVertexArray(this.id);
        vbo._bind(idx);
        this.gl.bindVertexArray(null);
    }

    _bind() {
        this.gl.bindVertexArray(this.id);
    }

    _unbind() {
        this.gl.bindVertexArray(null);
    }
}