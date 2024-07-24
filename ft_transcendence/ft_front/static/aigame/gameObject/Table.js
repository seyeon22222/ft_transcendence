import { GameObject } from "./GameObject.js";
import { Stick } from "./Stick.js";
import { Ball } from "./Ball.js";
import { Rim } from "./Rim.js";
import { Control } from "./Control.js";
import { Screen } from "./Screen.js";
import { ScreenSupport } from "./ScreenSupport.js";
import { Transform } from "../component/Transform.js";
import { PongTable } from "../component/PongTable.js";
import { Renderer } from "../component/Renderer.js";
import { MeshAsset } from "../asset/MeshAsset.js";
import { MaterialAsset } from "../asset/MaterialAsset.js";
import { TextureAsset } from "../asset/TextureAsset.js";
import { gl } from "../core/definition.js";

export class Table extends GameObject {
	constructor() {
		super();
		this.children = [
			new Stick(),
			new Stick(),
			new Ball(),
			new Rim(),
			new Control(),
			new Screen(),
			new ScreenSupport()
		];
		this.transform = new Transform();
		this.pong_table = new PongTable(this);
		this.renderer = new Renderer(this);

		this.renderer.vao = MeshAsset.table;
		this.renderer.program = MaterialAsset.table;
		this.renderer.count = 1968;
		
		this.pong_table.screen = this.children[5].pong_screen;
		// console.log("screen:", this.screen);

		this.children[0].renderer.vao = MeshAsset.cube;
		this.children[1].renderer.vao = MeshAsset.cube;
		this.children[2].renderer.vao = MeshAsset.cube;
		this.children[0].renderer.program = MaterialAsset.stick;
		this.children[1].renderer.program = MaterialAsset.stick;
		this.children[2].renderer.program = MaterialAsset.default;

		this.children[3].renderer.vao = MeshAsset.rim;
		this.children[3].renderer.program = MaterialAsset.rim;
		
		this.children[4].renderer.vao = MeshAsset.control;
		this.children[4].renderer.program = MaterialAsset.control;

		this.children[5].renderer.vao = MeshAsset.quad;
		this.children[5].renderer.program = MaterialAsset.screen;
	}
	start(parent) {
		this.pong_table.start();
		this.transform.start(parent);
		this.renderer.start();
		super.start();
	}
	update(parent) {
		this.pong_table.update();
		this.transform.update(parent);

		gl.useProgram(MaterialAsset.table);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, TextureAsset.skybox);
		gl.uniform1i(gl.getUniformLocation(MaterialAsset.table, "skybox"), 0);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, TextureAsset.emission_texture);
		gl.uniform1i(gl.getUniformLocation(MaterialAsset.table, "screen_emission"), 1);


		gl.uniform1i(gl.getUniformLocation(MaterialAsset.table, "screen_emission"), 1);
		gl.uniformMatrix4fv(gl.getUniformLocation(MaterialAsset.table, "skybox_world_to_local"), true, 
			[0.625, 0, 0, 0,
				0, 1, 0, -0.1,
				0, 0, 1, -1.4,
				0, 0, 0, 1
			]
		);


		gl.useProgram(null);
		this.renderer.update();
		super.update();
	}
}
