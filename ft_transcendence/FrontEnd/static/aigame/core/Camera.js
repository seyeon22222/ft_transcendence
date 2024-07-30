import {Matrix} from "../util/Matrix.js";
import { gl, CANVAS_WIDTH, CANVAS_HEIGHT } from "./definition.js";
import { MeshAsset } from "../asset/MeshAsset.js";
import { MaterialAsset } from "../asset/MaterialAsset.js";
import { TextureAsset } from "../asset/TextureAsset.js";
import { Vector3 } from "../util/Vector3.js";
export class Camera {
	static position = {x: 2.0, y: 0.2, z: 1.4};
	static lookat = {x: 0, y: 0, z: 1.4};
	static fov = 60 / 180 * Math.PI;
	static near = 0.3;
	static far = 50;
	static view = Matrix.identity();
	static projection = Matrix.identity();
	static fbo = null;
	static color_texture = null;
	static depth_texture = null;

	static init() {
		Camera.fbo = gl.createFramebuffer();
		Camera.color_texture = gl.createTexture();
		Camera.depth_texture = gl.createTexture();

		gl.bindTexture(gl.TEXTURE_2D, Camera.color_texture);
		gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA16F, CANVAS_WIDTH, CANVAS_HEIGHT);
		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.bindTexture(gl.TEXTURE_2D, Camera.depth_texture);
		gl.texStorage2D(gl.TEXTURE_2D, 1, gl.DEPTH_COMPONENT24, CANVAS_WIDTH, CANVAS_HEIGHT);
		gl.bindTexture(gl.TEXTURE_2D, null);

		gl.bindFramebuffer(gl.FRAMEBUFFER, Camera.fbo);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, Camera.color_texture, 0);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, Camera.depth_texture, 0);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}
	static update() {
		// let t = performance.now() / 1000;
		// Camera.position = 
		// 	new Vector3(Math.cos(t) * 2, 1, Math.sin(t) * 2);

		Camera.updateView();
		Camera.updateProjection();
		
		gl.bindVertexArray(MeshAsset.skybox);
		gl.useProgram(MaterialAsset.skybox);
		
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, TextureAsset.skybox);

		gl.uniform1i(gl.getUniformLocation(MaterialAsset.skybox, "skybox"), 0);
		gl.uniformMatrix4fv(gl.getUniformLocation(MaterialAsset.skybox, "V"), true, Camera.view);
		gl.uniformMatrix4fv(gl.getUniformLocation(MaterialAsset.skybox, "P"), true, Camera.projection);
		gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_INT, 0);
		gl.bindVertexArray(null);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
	}
	static updateView() {
		const forward = Vector3.normalize(Vector3.sub(Camera.lookat, Camera.position));
		const right = Vector3.normalize(Vector3.cross({x: 0, y: 1, z: 0}, forward));
		const up = Vector3.cross(forward, right);
		const tx = -Vector3.dot(right, Camera.position);
		const ty = -Vector3.dot(up, Camera.position);
		const tz = -Vector3.dot(forward, Camera.position);

		Camera.view = [
			right.x, right.y, right.z, tx,
			up.x, up.y, up.z, ty,
			forward.x, forward.y, forward.z, tz,
			0.0, 0.0, 0.0, 1.0
		];
	}
	static updateProjection() {
		let aspect_ratio = CANVAS_WIDTH / CANVAS_HEIGHT;
		let c = 1 / Math.tan(Camera.fov * 0.5);
		let a = (Camera.near + Camera.far) / (Camera.far - Camera.near);
		let b = (2 * Camera.near * Camera.far) / (Camera.near - Camera.far);

		Camera.projection = [
			c / aspect_ratio, 0, 0, 0,
			0, c, 0, 0,
			0, 0, a, b,
			0, 0, 1, 0
		];
	}
}