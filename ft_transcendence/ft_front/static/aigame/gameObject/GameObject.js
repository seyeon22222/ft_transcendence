

export class GameObject {
	constructor() {
		this.children = [];
	}
	start() {
		for (let gameObject of this.children) {
			gameObject.start(this);
		}
	}
	update() {
		for (let gameObject of this.children) {
			gameObject.update(this);
		}
	}
}