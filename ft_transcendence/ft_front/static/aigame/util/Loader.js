
export class Loader {
	static async loadTexture(gl, src) {
		let texture = gl.createTexture();
		let response = await fetch(src);
		let blob = await response.blob();
		let bitmap = await createImageBitmap(blob);

		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texStorage2D(gl.TEXTURE_2D, 1, gl.SRGB8_ALPHA8, bitmap.width, bitmap.height);
		gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, bitmap.width, bitmap.height, gl.RGBA, gl.UNSIGNED_BYTE, bitmap);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.bindTexture(gl.TEXTURE_2D, null);
		return (texture);
	}
	static async loadCubemap(gl, srcs, size) {
		let texture = gl.createTexture();

		gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
		gl.texStorage2D(gl.TEXTURE_CUBE_MAP, 12, gl.SRGB8_ALPHA8, size, size);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		// gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		// gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
		for (let i = 0; i < 6; ++i) {
			let response = await fetch(srcs[i]);
			let blob = await response.blob();
			let bitmap = await createImageBitmap(blob);
			gl.texSubImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, 0, 0, size, size, gl.RGBA, gl.UNSIGNED_BYTE, bitmap);
		}
		gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
		return (texture);
	}
	static async loadProgram(gl, vs_src, fs_src) {
		let vs = gl.createShader(gl.VERTEX_SHADER);
		let fs = gl.createShader(gl.FRAGMENT_SHADER);
		let program = gl.createProgram();

		gl.shaderSource(vs, await (await fetch(vs_src)).json());
		gl.shaderSource(fs, await (await fetch(fs_src)).json());
		gl.compileShader(vs);
		gl.compileShader(fs);
		gl.attachShader(program, vs);
		gl.attachShader(program, fs);

		for (let i = 0; i < 3; ++i) {
			const key = ["position", "uv", "normal"][i];

			gl.bindAttribLocation(program, i, key);
		}

		gl.linkProgram(program);
		// console.log(gl.getShaderInfoLog(vs));
		// console.log(gl.getShaderInfoLog(fs));
		return (program);
	}
	static async loadMesh(gl, src) {
		// console.log("test ",src);
		let json = await (await fetch(src)).json();
		let vao = gl.createVertexArray();

		gl.bindVertexArray(vao);
		for (let key of Object.keys(json)) {
			if (key == "index") {
				const data = json[key];
				let buffer = gl.createBuffer();
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data.length * 4, gl.STATIC_DRAW);
				gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, new Int32Array(data));
				continue;
			}
			// console.log(key);
			const idx = ["position", "uv", "normal"].indexOf(key);

			if (idx == -1) {
				gl.bindVertexArray(null);
				gl.deleteVertexArray(vao);
				throw "Invalid key name";
			}
			const data = json[key];
			const size = [3, 2, 3][idx];
			let buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ARRAY_BUFFER, data.length * 4, gl.STATIC_DRAW);
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(data));
			gl.vertexAttribPointer(idx, size, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(idx);
		}
		gl.bindVertexArray(null);
		return (vao);
	}
}
