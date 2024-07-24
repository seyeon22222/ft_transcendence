import { GameObject } from "./GameObject.js";
import { Transform } from "../component/Transform.js";
import { PongScreen } from "../component/PongScreen.js";
import { Renderer } from "../component/Renderer.js";
import { MaterialAsset } from "../asset/MaterialAsset.js";
import { TextureAsset } from "../asset/TextureAsset.js";
import { Vector3 } from "../util/Vector3.js";
import { gl } from "../core/definition.js";

export class Screen extends GameObject {
	constructor() {
		super();
		this.transform = new Transform();
		this.pong_screen = new PongScreen(this);
		this.renderer = new Renderer(this);
		this.renderer.count = 6;
	}
	start(parent) {
		this.pong_screen.start();
		this.transform.start(parent);
		this.renderer.start();
		this.transform.position = new Vector3(-1.05, 0.4, 0);
		this.transform.rotation = new Vector3(0, -Math.PI / 2, 0);
		this.transform.scale = new Vector3(0.6, 0.4, 1.0);
		super.start();
	}
	update(parent) {
		this.pong_screen.update();
		this.transform.update(parent);
		gl.useProgram(MaterialAsset.screen);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, TextureAsset.screen_background);
		gl.uniform1i(gl.getUniformLocation(MaterialAsset.screen, "background_texture"), 0);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, TextureAsset.screen_emission);
		gl.uniform1i(gl.getUniformLocation(MaterialAsset.screen, "foreground_texture"), 1);
		gl.useProgram(null);
		this.renderer.update();
		super.update();
	}
}