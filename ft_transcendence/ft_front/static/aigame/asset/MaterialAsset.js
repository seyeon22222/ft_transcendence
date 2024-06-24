
class MaterialAsset {
	static default;
	static stick;
	static skybox;

	static async init() {
		MaterialAsset.default = await Loader.loadProgram(gl, "file:///D:/Web/Pingpong/shader/ball.vs", "file:///D:/Web/Pingpong/shader/ball.fs");
		MaterialAsset.stick = await Loader.loadProgram(gl, "file:///D:/Web/Pingpong/shader/stick.vs", "file:///D:/Web/Pingpong/shader/stick.fs");
		MaterialAsset.skybox = await Loader.loadProgram(gl, "file:///D:/Web/Pingpong/shader/skybox.vs", "file:///D:/Web/Pingpong/shader/skybox.fs");
	}
}
