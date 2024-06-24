export function ai_game_js() {

}

class Scene {
	constructor() {
		this.gameObjects = [
			new Table(),
			new Player(),
			new Bot()
		];

		this.gameObjects[0].transform.position = new Vector3(0, -0.4, 1.4);

		this.gameObjects[1].player_control.table = this.gameObjects[0].pong_table;
		this.gameObjects[1].player_control.player_id = 0;
		this.gameObjects[2].bot_control.table = this.gameObjects[0].pong_table;
		this.gameObjects[2].bot_control.player_id = 1;
	}
	start() {
		Time.init();
		Camera.init();
		for (let gameObject of this.gameObjects) {
			gameObject.start(null);
		}
	}
	update() {
		Time.update();
		Camera.update();
		gl.clear(gl.DEPTH_BUFFER_BIT);
		for (let gameObject of this.gameObjects) {
			gameObject.update(null);
		}
		// console.log(gl.getError());
	}
}

let scene = null;

async function main() {
	await MaterialAsset.init();
	await MeshAsset.init();
	await TextureAsset.init();
	await PostProcessor.init();
	scene = new Scene();
	scene.start();
	requestAnimationFrame(update);
}

async function update() {
	gl.bindFramebuffer(gl.FRAMEBUFFER, Camera.fbo);
	gl.clearColor(0.4, 0.4, 0.4, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	scene.update();
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.disable(gl.DEPTH_TEST);
	PostProcessor.run([
		PostProcessor.bloom,
		PostProcessor.tonemap
	], Camera.color_texture, null, [1.0, 5.0]);
	ctx.drawImage(gl_canvas, 0, 0);
	requestAnimationFrame(update);
}

main();