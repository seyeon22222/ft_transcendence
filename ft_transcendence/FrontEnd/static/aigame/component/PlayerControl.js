import { Input } from "../core/Input.js";
export class PlayerControl {
	constructor(gameObject) {
		this.gameObject = gameObject;
		this.table = null;
		this.player_id = -1;
	}
	start() {}
	update() {
		this.table.setInput(this.player_id, (Input.getKey('ArrowRight') ? 1 : 0) - (Input.getKey('ArrowLeft') ? 1 : 0));
	}
}