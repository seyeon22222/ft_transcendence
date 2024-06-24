import { Loader } from "../util/Loader.js";
import { gl } from "../core/definition.js";

export class MaterialAsset {
	static default;
	static stick;
	static skybox;

	static async init() {
		MaterialAsset.default = await Loader.loadProgram(gl, "./../shader/ball.vs", "./../shader/ball.fs");
		MaterialAsset.stick = await Loader.loadProgram(gl, "./../shader/stick.vs", "./../shader/stick.fs");
		MaterialAsset.skybox = await Loader.loadProgram(gl, "./../shader/skybox.vs", "./../shader/skybox.fs");
	}
}
