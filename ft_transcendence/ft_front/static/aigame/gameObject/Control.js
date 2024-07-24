import { GameObject } from "./GameObject.js";
import { Transform } from "../component/Transform.js";
import { Renderer } from "../component/Renderer.js";
import { MaterialAsset } from "../asset/MaterialAsset.js";
import { TextureAsset } from "../asset/TextureAsset.js";
import { gl } from "../core/definition.js";

export class Control extends GameObject {
	constructor() {
		super();
		this.transform = new Transform();
		this.renderer = new Renderer(this);
		this.renderer.count = 3228;
	}
	start(parent) {
		this.transform.start(parent);
		this.renderer.start();
		super.start();
	}
	update(parent) {
		this.transform.update(parent);
		gl.useProgram(MaterialAsset.control);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, TextureAsset.control_albedo);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, TextureAsset.control_emission);
		gl.uniform1i(gl.getUniformLocation(MaterialAsset.control, "albedo_texture"), 0);
		gl.uniform1i(gl.getUniformLocation(MaterialAsset.control, "emission_texture"), 1);
		gl.useProgram(null);
		this.renderer.update();
		super.update();
	}
}