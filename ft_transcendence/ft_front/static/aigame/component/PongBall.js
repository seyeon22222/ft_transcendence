import { Time } from "../core/Time.js";
export class PongBall {
	constructor(gameObject) {
		this.gameObject = gameObject;
		this.transform = gameObject.transform;
		this.velocity = {x: 0, y: 0, z: 0};
	}
	setVelocity(velocity) {
		this.velocity = Object.assign({}, velocity);
	}
	start() {}
	update() {
		this.transform.position.x += this.velocity.x * Time.deltaTime;
		this.transform.position.z += this.velocity.z * Time.deltaTime;
	}
}
