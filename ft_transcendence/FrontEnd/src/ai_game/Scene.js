import { Table } from "../../static/aigame/gameObject/Table.js";
import { Player } from "../../static/aigame/gameObject/Player.js";
import { Bot } from "../../static/aigame/gameObject/Bot.js";
import { Vector3 } from "../../static/aigame/util/Vector3.js";

import { Time } from "../../static/aigame/core/Time.js";
import { Camera } from "../../static/aigame/core/Camera.js";
import { gl } from "../../static/aigame/core/definition.js";

export class Scene {
	constructor() {
		this.gameObjects = [
			new Table(),
			new Player(),
			new Bot()
		];

		this.gameObjects[0].transform.position = new Vector3(0, -0.3, 1.4);

		this.gameObjects[1].player_control.table = this.gameObjects[0].pong_table;
		this.gameObjects[1].player_control.player_id = 1;
		this.gameObjects[2].bot_control.table = this.gameObjects[0].pong_table;
		this.gameObjects[2].bot_control.player_id = 0;
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
