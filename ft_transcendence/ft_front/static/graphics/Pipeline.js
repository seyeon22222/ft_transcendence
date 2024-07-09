import { Shader } from "./Shader.js";
import { Program } from "./Program.js";

export class Pipeline {
    static gl;
    static program;
	static canvas;

    static initPipeline() {
        Pipeline.canvas = document.getElementById("canvas");
		Pipeline.canvas.height = 909;
    	Pipeline.canvas.width = 1678;

		const gl = Pipeline.canvas.getContext("webgl2");
		if (!gl)
			alert("Webgl2 not supported!");
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		const vs = new Shader(gl, gl.VERTEX_SHADER);
		const fs = new Shader(gl, gl.FRAGMENT_SHADER);
		vs.shaderSource(`#version 300 es
			in vec4	position;
			in vec4 color;

			uniform mat4 model;
			uniform mat4 vp;

			out vec4	col;

			vec4 moveMatrix = vec4(0, 0, 0, 0);
			void	main() {
				gl_Position = vp * model * position;
				col = color;
			}`);
		fs.shaderSource(`#version 300 es
			precision mediump float; // float의 바이트를 정함

			in vec4	col;

			out vec4	fragColor;

			void	main() {
				fragColor = col;
			}`);
		vs.compile();
		fs.compile();
		const program = new Program(gl);
		program.attach(vs);
		program.attach(fs);
		program.link();
        Pipeline.gl = gl;
        Pipeline.program = program;
    }
}