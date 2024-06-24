import { Loader } from "../util/Loader.js";
import { gl } from "../core/definition.js";

export class TextureAsset {
	static basic;
	static test;

	static async init() {
		TextureAsset.test = await Loader.loadTexture(gl, "./../skybox/front.jpg");
		TextureAsset.skybox = await Loader.loadCubemap(gl, [
			"./../skybox/right.jpg",
			"./../skybox/left.jpg",
			"./../skybox/top.jpg",
			"./../skybox/bottom.jpg",
			"./../skybox/front.jpg",
			"./../skybox/back.jpg"
		], 2048);
	}
}