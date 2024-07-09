import { MaterialAsset } from "../../static/aigame/asset/MaterialAsset.js";
import { MeshAsset } from "../../static/aigame/asset/MeshAsset.js";
import { TextureAsset } from "../../static/aigame/asset/TextureAsset.js";
import { PostProcessor } from "../../static/aigame/core/PostProcessor.js";
import { canvas_init } from "../../static/aigame/core/definition.js";
import { Table } from "../../static/aigame/gameObject/Table.js";
import { Player } from "../../static/aigame/gameObject/Player.js";
import { Bot } from "../../static/aigame/gameObject/Bot.js";
import { Time } from "../../static/aigame/core/Time.js";
import { Camera } from "../../static/aigame/core/Camera.js";
import { Vector3 } from "../../static/aigame/util/Vector3.js";
import { gl } from "../../static/aigame/core/definition.js";
import { ctx } from "../../static/aigame/core/definition.js";
import { gl_canvas } from "../../static/aigame/core/definition.js";
import { event_add_popstate } from "../utilities.js";

window.flag = 0;

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
	}
}

let scene = null;

async function main() {
    try {
        canvas_init();
        await MaterialAsset.init();
        await MeshAsset.init();
        await TextureAsset.init();
        await PostProcessor.init();
        scene = new Scene();
        scene.start();
        requestAnimationFrame(update);
    } catch (error) {
        console.error("Error during initialization:", error);
    }
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
	if (window.flag === 1) 
		return;
	requestAnimationFrame(update);
}

export function ai_game_js() {	
	main();
	event_add_popstate(ai_popstate);
}

function ai_popstate(event) {
	window.flag = 1;
}