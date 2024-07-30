import { Loader } from "../util/Loader.js";
import { gl } from "../core/definition.js";
export class MaterialAsset {
	static default;
	static stick;
	static skybox;

	static async init() {
		MaterialAsset.default = await Loader.loadProgram(gl, "../shader/ball.vs", "../shader/ball.fs");
		MaterialAsset.stick = await Loader.loadProgram(gl, "../shader/stick.vs", "../shader/stick.fs");
		MaterialAsset.skybox = await Loader.loadProgram(gl, "../shader/skybox.vs", "../shader/skybox.fs");
		MaterialAsset.table = await Loader.loadProgram(gl, "../shader/table.vs", "../shader/table.fs");
		MaterialAsset.rim = await Loader.loadProgram(gl, "../shader/rim.vs", "../shader/rim.fs");
		MaterialAsset.control = await Loader.loadProgram(gl, "../shader/control.vs", "../shader/control.fs");
		MaterialAsset.screen =  await Loader.loadProgram(gl, "../shader/screen.vs", "../shader/screen.fs");
		MaterialAsset.screen_support =  await Loader.loadProgram(gl, "../shader/screen_support.vs", "../shader/screen_support.fs");
	}
}
