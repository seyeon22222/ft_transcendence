
class Player extends GameObject {
	constructor() {
		super();
		this.player_control = new PlayerControl(this);
	}
	start(parent) {
		this.player_control.start();
		super.start();
	}
	update(parent) {
		this.player_control.update();
		super.update();
	}
}