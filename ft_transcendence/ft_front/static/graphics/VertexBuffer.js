class VertexBuffer{
    constructor(gl, buffer, size, type, normalize, stride = 0, offset = 0) {
        this.gl = gl;
        this.buffer = buffer;
        this.type = type;
        this.normalize = normalize;
        this.stride = stride;
        this.offset = offset;
        this.size = size;
    }

    _bind(idx) {
        this.buffer._bind();
        this.gl.enableVertexAttribArray(idx);
        this.gl.vertexAttribPointer(idx, this.size, this.type, this.normalize, this.stride, this.offset);
    }
}