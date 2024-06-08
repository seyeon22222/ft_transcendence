
export class Program {
	static attribute_location = {
		"position": 0,
		"color": 1,
		// "uv": 1
	};
	constructor(gl) {
		const	program = gl.createProgram();

		for (const attribute in Program.attribute_location) {
			const	location = Program.attribute_location[attribute];
			gl.bindAttribLocation(program, location, attribute);
		}
		this.id = program;
		this.gl = gl;
	}
	attach(shader) {
		this.gl.attachShader(this.id, shader.id);
	}
	link() {
		this.gl.linkProgram(this.id);
	}
	use() {
		this.gl.useProgram(this.id);
	}
}
