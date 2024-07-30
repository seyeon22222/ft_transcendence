import { GameObject } from "./GameObject.js";
import { Vector3 } from "../util/Vector3.js";
import { Transform } from "../component/Transform.js";
import { PongBall } from "../component/PongBall.js";
import { Renderer } from "../component/Renderer.js";

export class Ball extends GameObject {
	constructor() {
		super();
		this.transform = new Transform();
		this.transform.scale = new Vector3(0.03, 0.03, 0.03);
		this.pong_ball = new PongBall(this);
		this.renderer = new Renderer(this);
	}
	start(update) {
		this.pong_ball.start();
		this.transform.start(parent);
		this.renderer.start();
		super.start();
	}
	update(parent) {
		this.pong_ball.update();
		this.transform.update(parent);
		this.renderer.update();
		super.update();
	}
}
