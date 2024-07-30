import { GameObject } from "./GameObject.js";
import { Transform } from "../component/Transform.js";
import { Renderer } from "../component/Renderer.js";
import { PongStick } from "../component/PongStick.js";
import { Vector3 } from "../util/Vector3.js";

export class Stick extends GameObject {
	constructor() {
		super();
		this.transform = new Transform();
		this.transform.scale = new Vector3(0.04, 0.04, 0.3);
		this.pong_stick = new PongStick(this);
		this.renderer = new Renderer(this);
	}
	start(parent) {
		this.pong_stick.start();
		this.transform.start(parent);
		this.renderer.start();
		super.start();
	}
	update(parent) {
		this.pong_stick.update();
		this.transform.update(parent);
		this.renderer.update();
		super.update();
	}
}