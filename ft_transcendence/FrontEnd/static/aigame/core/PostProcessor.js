import { gl,CANVAS_HEIGHT, CANVAS_WIDTH } from "./definition.js";
import { Loader } from "../util/Loader.js";
import { MeshAsset } from "../asset/MeshAsset.js";


export class PostProcessor {
	static fbo = [null, null];
	static texture = [null, null];
	static copy_shader = null; // 1 to 1 copy shader
	static test_shader = null;
	static hblur_shader = null;
	static vblur_shader = null;
	static blend_shader = null;
	static tonemap_shader = null;
	static current = 0;

	static run(subprograms, src, dst_fbo, params) {
		if (subprograms.length == 0)
			return ;
		gl.bindVertexArray(MeshAsset.quad);
		let src_texture = src;

		for (let subprogram of subprograms) {
			subprogram(src_texture, params);
			src_texture = PostProcessor.texture[PostProcessor.current ^ 1];
		}
		PostProcessor.copy(src_texture, dst_fbo);
		gl.bindVertexArray(null);
	}

	static test(src, dst_fbo, threshold) {
		gl.bindFramebuffer(gl.FRAMEBUFFER, dst_fbo);
		gl.useProgram(PostProcessor.test_shader);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, src);
		gl.uniform1i(gl.getUniformLocation(PostProcessor.test_shader, "src"), 0);
		gl.uniform1f(gl.getUniformLocation(PostProcessor.test_shader, "threshold"), threshold);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, null);

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}
	static hblur(src, dst_fbo, stddev) {
		gl.bindFramebuffer(gl.FRAMEBUFFER, dst_fbo);
		gl.useProgram(PostProcessor.hblur_shader);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, src);
		gl.uniform1i(gl.getUniformLocation(PostProcessor.hblur_shader, "src"), 0);
		gl.uniform1f(gl.getUniformLocation(PostProcessor.hblur_shader, "stddev"), stddev);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, null);

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}
	static vblur(src, dst_fbo, stddev) {
		gl.bindFramebuffer(gl.FRAMEBUFFER, dst_fbo);
		gl.useProgram(PostProcessor.vblur_shader);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, src);
		gl.uniform1i(gl.getUniformLocation(PostProcessor.vblur_shader, "src"), 0);
		gl.uniform1f(gl.getUniformLocation(PostProcessor.vblur_shader, "stddev"), stddev);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, null);

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}
	static blend(src0, src1, dst_fbo) {
		gl.bindFramebuffer(gl.FRAMEBUFFER, dst_fbo);
		gl.useProgram(PostProcessor.blend_shader);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, src0);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, src1);
		gl.uniform1i(gl.getUniformLocation(PostProcessor.blend_shader, "src0"), 0);
		gl.uniform1i(gl.getUniformLocation(PostProcessor.blend_shader, "src1"), 1);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, null);

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}
	static bloom(src, params) {
		let threshold = params.shift();
		let stddev = params.shift();

		let src_texture = src;
		let dst_fbo = PostProcessor.fbo[PostProcessor.current];
		PostProcessor.test(src_texture, dst_fbo, threshold);
		src_texture = PostProcessor.texture[PostProcessor.current];
		dst_fbo = PostProcessor.fbo[PostProcessor.current ^= 1];
		PostProcessor.hblur(src_texture, dst_fbo, stddev);
		src_texture = PostProcessor.texture[PostProcessor.current];
		dst_fbo = PostProcessor.fbo[PostProcessor.current ^= 1];
		PostProcessor.vblur(src_texture, dst_fbo, stddev);
		src_texture = PostProcessor.texture[PostProcessor.current];
		dst_fbo = PostProcessor.fbo[PostProcessor.current ^= 1];
		PostProcessor.blend(src, src_texture, dst_fbo);
		PostProcessor.current ^= 1;	
	}
	static tonemap(src, params) {
		let dst_fbo = PostProcessor.fbo[PostProcessor.current];
		PostProcessor.current ^= 1;

		gl.bindFramebuffer(gl.FRAMEBUFFER, dst_fbo);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, src);
		gl.useProgram(PostProcessor.tonemap_shader);
		gl.uniform1i(gl.getUniformLocation(PostProcessor.tonemap_shader, "src"), 0);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}
	static copy(src, dst_fbo) {
		gl.bindFramebuffer(gl.FRAMEBUFFER, dst_fbo);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, src);
		gl.useProgram(PostProcessor.copy_shader);
		gl.uniform1i(gl.getUniformLocation(PostProcessor.copy_shader, "src"), 0);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}

	static async init() {
		for (let i = 0; i < 2; ++i) {
			PostProcessor.fbo[i] = gl.createFramebuffer();
			PostProcessor.texture[i] = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, PostProcessor.texture[i]);
			gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA16F, CANVAS_WIDTH, CANVAS_HEIGHT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.bindTexture(gl.TEXTURE_2D, null);
			gl.bindFramebuffer(gl.FRAMEBUFFER, PostProcessor.fbo[i]);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, PostProcessor.texture[i], 0);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}
		PostProcessor.copy_shader = await Loader.loadProgram(gl, "../shader/postprocess.vs", "../shader/copy.fs");
		PostProcessor.test_shader = await Loader.loadProgram(gl, "../shader/postprocess.vs", "../shader/test.fs");
		PostProcessor.hblur_shader = await Loader.loadProgram(gl, "../shader/postprocess.vs", "../shader/hblur.fs");
		PostProcessor.vblur_shader = await Loader.loadProgram(gl, "../shader/postprocess.vs", "../shader/vblur.fs");
		PostProcessor.blend_shader = await Loader.loadProgram(gl, "../shader/postprocess.vs", "../shader/blend.fs");
		PostProcessor.tonemap_shader = await Loader.loadProgram(gl, "../shader/postprocess.vs", "../shader/tonemap.fs");
	}
}