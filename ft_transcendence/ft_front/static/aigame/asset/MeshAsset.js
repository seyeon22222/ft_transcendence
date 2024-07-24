
class MeshAsset {
	static cube = null;
	static quad = null;
	static skybox = null;

	static async init() {
		MeshAsset.quad = await Loader.loadMesh(gl, "file:///D:/Web/Pingpong/mesh/quad.json");
		MeshAsset.cube = await Loader.loadMesh(gl, "file:///D:/Web/Pingpong/mesh/cube.json");
		MeshAsset.skybox = await Loader.loadMesh(gl, "file:///D:/Web/Pingpong/mesh/skybox.json");
		MeshAsset.table = await Loader.loadMesh(gl, "file:///D:/Web/Pingpong/mesh/TableUpper.json");
		MeshAsset.rim = await Loader.loadMesh(gl, "file:///D:/Web/Pingpong/mesh/Highlight.json");
		MeshAsset.control = await Loader.loadMesh(gl, "file:///D:/Web/Pingpong/mesh/Control.json");
		MeshAsset.glass = await Loader.loadMesh(gl, "file:///D:/Web/Pingpong/mesh/GlassModel.json");
		MeshAsset.screen_support = await Loader.loadMesh(gl, "file:///D:/Web/Pingpong/mesh/ScreenSupport.json");
	}
}