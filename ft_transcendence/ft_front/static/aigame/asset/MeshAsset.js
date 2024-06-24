import { Loader } from "../util/Loader.js";
import { gl } from "../core/definition.js";

export class MeshAsset {
	static cube = null;
	static quad = null;
	static skybox = null;

	static async init() {
		MeshAsset.quad = await Loader.loadMesh(gl, "./../mesh/quad.json");
		MeshAsset.cube = await Loader.loadMesh(gl, "./../mesh/cube.json");
		MeshAsset.skybox = await Loader.loadMesh(gl, "./../mesh/skybox.json");
	}
}