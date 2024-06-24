import { Vector3 } from "../util/Vector3.js";
import { Matrix } from "../util/Matrix.js";
export class Transform {
	constructor() {
		this.position = new Vector3(0, 0, 0);
		this.rotation = new Vector3(0, 0, 0);
		this.scale = new Vector3(1, 1, 1);
		this.local = [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
		this.world = [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
	}
	start(parent) {}
	update(parent) {
		this.local = Matrix.mul(
			Matrix.translation(this.position),
			Matrix.mul(
				Matrix.rotation(this.rotation),
				Matrix.scale(this.scale)
			)
		);
		if (parent == null)
			this.world = this.local.slice(); //Deeeep copy
		else
			this.world = Matrix.mul(parent.transform.world, this.local);
	}
}
