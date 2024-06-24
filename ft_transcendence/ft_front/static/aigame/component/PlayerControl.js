
class PlayerControl {
	constructor(gameObject) {
		this.gameObject = gameObject;
		this.table = null;
		this.player_id = -1;
	}
	start() {}
	update() {
		this.table.setInput(this.player_id, (Input.getKey('q') ? 1 : 0) - (Input.getKey('a') ? 1 : 0));
	}
}