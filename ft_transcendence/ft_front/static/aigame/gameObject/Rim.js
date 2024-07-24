import { GameObject } from "./GameObject.js";
import { Transform } from "../component/Transform.js";
import { Renderer } from "../component/Renderer.js";

export class Rim extends GameObject {
	constructor() {
		super();
		this.transform = new Transform();
		this.renderer = new Renderer(this);
		this.renderer.count = 444;
	}
	start(parent) {
		this.transform.start(parent);
		this.renderer.start();
		super.start();
	}
	update(parent) {
		this.transform.update(parent);
		this.renderer.update();
		super.update();
	}
}