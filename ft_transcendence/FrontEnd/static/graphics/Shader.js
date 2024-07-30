export class Shader {
    constructor(gl, type) {
        const shader = gl.createShader(type);

        this.id = shader;
        this.gl = gl;
    }
    shaderSource(source) {
        this.gl.shaderSource(this.id, source);
    }
    compile() {
        this.gl.compileShader(this.id);
    }
}