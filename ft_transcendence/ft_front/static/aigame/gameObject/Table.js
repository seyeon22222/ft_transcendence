import { GameObject } from "./GameObject.js";
import { Stick } from "./Stick.js";
import { Ball } from "./Ball.js";
import { Transform } from "../component/Transform.js";
import { PongTable } from "../component/PongTable.js";
import { Renderer } from "../component/Renderer.js";
import { MeshAsset } from "../asset/MeshAsset.js";
import { MaterialAsset } from "../asset/MaterialAsset.js";

export class Table extends GameObject {
	constructor() {
		super();
		this.children = [
			new Stick(),
			new Stick(),
			new Ball(),
		];
		this.transform = new Transform();
		this.pong_table = new PongTable(this);
		this.renderer = new Renderer(this);

		this.renderer.vao = MeshAsset.cube;
		this.renderer.program = MaterialAsset.default;

		this.children[0].renderer.vao = MeshAsset.cube;
		this.children[1].renderer.vao = MeshAsset.cube;
		this.children[2].renderer.vao = MeshAsset.cube;
		this.children[0].renderer.program = MaterialAsset.stick;
		this.children[1].renderer.program = MaterialAsset.stick;
		this.children[2].renderer.program = MaterialAsset.default;
	}
	start(parent) {
		this.pong_table.start();
		this.transform.start(parent);
		// this.renderer.start();
		super.start();
	}
	update(parent) {
		this.pong_table.update();
		this.transform.update(parent);
		// this.renderer.update();
		super.update();
	}
}
