import { Loader } from "../util/Loader.js";
import { gl } from "../core/definition.js";
export class MeshAsset {
	static cube = null;
	static quad = null;
	static skybox = null;

	static async init() {
		MeshAsset.quad = await Loader.loadMesh(gl, "../mesh/quad.json");
		MeshAsset.cube = await Loader.loadMesh(gl, "../mesh/cube.json");
		MeshAsset.skybox = await Loader.loadMesh(gl, "../mesh/skybox.json");
		MeshAsset.table = await Loader.loadMesh(gl, "../mesh/TableUpper.json");
		MeshAsset.rim = await Loader.loadMesh(gl, "../mesh/Highlight.json");
		MeshAsset.control = await Loader.loadMesh(gl, "../mesh/Control.json");
		MeshAsset.glass = await Loader.loadMesh(gl, "../mesh/GlassModel.json");
		MeshAsset.screen_support = await Loader.loadMesh(gl, "../mesh/ScreenSupport.json");
	}
}