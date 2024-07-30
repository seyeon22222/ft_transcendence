import { gl } from "../core/definition.js";
import { Camera } from "../core/Camera.js";
export class Renderer {
	constructor(gameObject) {
		this.gameObject = gameObject;
		this.transform = gameObject.transform;
		this.program = null;
		this.vao = null;
		this.count = 36;
	}
	start() {}
	update() {
		gl.bindVertexArray(this.vao);
		gl.useProgram(this.program);

		gl.uniformMatrix4fv(gl.getUniformLocation(this.program, "M"), true, this.transform.world);
		gl.uniformMatrix4fv(gl.getUniformLocation(this.program, "V"), true, Camera.view);
		gl.uniformMatrix4fv(gl.getUniformLocation(this.program, "P"), true, Camera.projection);
		gl.uniform3f(gl.getUniformLocation(this.program, "camera_position"), Camera.position.x, Camera.position.y, Camera.position.z);
		gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_INT, 0);
		gl.bindVertexArray(null);
	}
}