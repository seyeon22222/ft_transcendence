import { MaterialAsset } from "../../static/aigame/asset/MaterialAsset.js";
import { MeshAsset } from "../../static/aigame/asset/MeshAsset.js";
import { TextureAsset } from "../../static/aigame/asset/TextureAsset.js";
import { PostProcessor } from "../../static/aigame/core/PostProcessor.js";
import { Camera } from "../../static/aigame/core/Camera.js";
import { gl } from "../../static/aigame/core/definition.js";
import { ctx } from "../../static/aigame/core/definition.js";
import { gl_canvas } from "../../static/aigame/core/definition.js";
import { event_add_popstate } from "../utilities.js";
import { Scene } from "./Scene.js";
import { canvas_init } from "../../static/aigame/core/definition.js";
import { Input } from "../../static/aigame/core/Input.js";
window.flag = 0;


let scene = null;
let loop = false;

async function main() {
	
	canvas_init();
	Input.init();
	await MaterialAsset.init();
	await MeshAsset.init();
	await TextureAsset.init();
	await PostProcessor.init();
	scene = new Scene();
	scene.start();
	requestAnimationFrame(update);
}

async function update() {
	gl.bindFramebuffer(gl.FRAMEBUFFER, Camera.fbo);
	gl.clearColor(0.4, 0.4, 0.4, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	scene.update();
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.disable(gl.DEPTH_TEST);
	PostProcessor.run([
		PostProcessor.bloom,
		PostProcessor.tonemap
	], Camera.color_texture, null, [1.0, 5.0]);
	ctx.drawImage(gl_canvas, 0, 0);
	if (loop)
		requestAnimationFrame(update);
}

export function ai_game_js() {	
	loop = true;
	main();
	event_add_popstate(ai_popstate);
}

function ai_popstate(event) {
	Input.cleanup();
	loop = false;
	window.flag = 1;
}