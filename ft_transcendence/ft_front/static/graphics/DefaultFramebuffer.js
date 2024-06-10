
export class DefaultFramebuffer {
	static	r = 0;
	static	g = 0;
	static	b = 0;
	static	a = 0;

	static setClearColor(r, g, b, a) {
		DefaultFramebuffer.r = r;
		DefaultFramebuffer.g = g;
		DefaultFramebuffer.b = b;
		DefaultFramebuffer.a = a;
	}
	static clearColor(gl) {
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.clearColor(DefaultFramebuffer.r, DefaultFramebuffer.g, DefaultFramebuffer.b, DefaultFramebuffer.a);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}
}