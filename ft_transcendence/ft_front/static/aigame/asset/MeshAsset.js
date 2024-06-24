
class MeshAsset {
	static cube = null;
	static quad = null;
	static skybox = null;

	static async init() {
		MeshAsset.quad = await Loader.loadMesh(gl, "file:///D:/Web/Pingpong/mesh/quad.json");
		MeshAsset.cube = await Loader.loadMesh(gl, "file:///D:/Web/Pingpong/mesh/cube.json");
		MeshAsset.skybox = await Loader.loadMesh(gl, "file:///D:/Web/Pingpong/mesh/skybox.json");
	}
}