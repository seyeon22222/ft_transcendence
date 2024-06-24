
class TextureAsset {
	static basic;
	static test;

	static async init() {
		TextureAsset.test = await Loader.loadTexture(gl, "file:///D:/Web/Pingpong/skybox/front.jpg");
		TextureAsset.skybox = await Loader.loadCubemap(gl, [
			"file:///D:/Web/Pingpong/skybox/right.jpg",
			"file:///D:/Web/Pingpong/skybox/left.jpg",
			"file:///D:/Web/Pingpong/skybox/top.jpg",
			"file:///D:/Web/Pingpong/skybox/bottom.jpg",
			"file:///D:/Web/Pingpong/skybox/front.jpg",
			"file:///D:/Web/Pingpong/skybox/back.jpg"
		], 2048);
	}
}