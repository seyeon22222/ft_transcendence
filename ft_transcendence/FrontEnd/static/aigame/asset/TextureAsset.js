import { Loader } from "../util/Loader.js";
import { gl } from "../core/definition.js";

export class TextureAsset {
	static basic;
	static test;

	static async init() {
		TextureAsset.test = await Loader.loadTexture(gl, "../skybox/front.jpg");
		TextureAsset.skybox = await Loader.loadCubemap(gl, [
			"../skybox/right.jpg",
			"../skybox/left.jpg",
			"../skybox/top.jpg",
			"../skybox/bottom.jpg",
			"../skybox/front.jpg",
			"../skybox/back.jpg"
		], 2048);
		TextureAsset.control_albedo = await Loader.loadTexture(gl, "../texture/ControlPad_albedo.png");
		TextureAsset.control_emission = await Loader.loadTexture(gl, "../texture/ControlPad_emission.png");
		TextureAsset.screen_emission = gl.createTexture();
		TextureAsset.screen_background = await Loader.loadTexture(gl, "../texture/Screen_bg.png");
		gl.bindTexture(gl.TEXTURE_2D, TextureAsset.screen_background);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);

		gl.bindTexture(gl.TEXTURE_2D, TextureAsset.screen_emission);
		gl.texStorage2D(gl.TEXTURE_2D, 8, gl.SRGB8_ALPHA8, 384, 256);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
}