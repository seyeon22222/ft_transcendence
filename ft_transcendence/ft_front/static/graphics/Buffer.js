export class Buffer {
    constructor(gl, type, size, usage) {
        const buffer = gl.createBuffer();
        gl.bindBuffer(type, buffer);
        gl.bufferData(type, size, usage);
        gl.bindBuffer(type, null);

        this.id = buffer;
        this.gl = gl;
        this.size = size;
        this.usage = usage;
        this.type = type;
    }

    setData(dstByteOffset, srcData, srcByteOffset, size) {
        const length = size / srcData.BYTES_PER_ELEMENT;
        this._bind();
        this.gl.bufferSubData(this.type, dstByteOffset, srcData, srcByteOffset, length);
        this._unbind();
    }

    _bind() {
        this.gl.bindBuffer(this.type, this.id);
    }

    _unbind() {
        this.gl.bindBuffer(this.type, null);
    }
}