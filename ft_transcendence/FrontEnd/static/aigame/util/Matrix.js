
export class Matrix {
	static translation(v) {
		return [
			1, 0, 0, v.x,
			0, 1, 0, v.y,
			0, 0, 1, v.z,
			0, 0, 0, 1
		];
	}
	static rotation(v) {//y x z
		return Matrix.mul(Matrix.mul(Matrix.rotateY(v.y), Matrix.rotateX(v.x)), Matrix.rotateZ(v.z));
	}
	static rotateX(a) {
		let c = Math.cos(a);
		let s = Math.sin(a);
		return [
			1, 0, 0, 0,
			0, c, -s, 0,
			0, s, c, 0,
			0, 0, 0, 1
		];
	}
	static rotateY(a) {
		let c = Math.cos(a);
		let s = Math.sin(a);
		return [
			c, 0, s, 0,
			0, 1, 0, 0,
			-s, 0, c, 0,
			0, 0, 0, 1
		];
	}
	static rotateZ(a) {
		let c = Math.cos(a);
		let s = Math.sin(a);
		return [
			c, -s, 0, 0,
			s, c, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
	}
	static scale(v) {
		return [
			v.x, 0, 0, 0,
			0, v.y, 0, 0,
			0, 0, v.z, 0,
			0, 0, 0, 1
		];
	}
	static mul(a, b) {
		let result = new Array(16);

		for (let i = 0; i < 4; ++i) {
			for (let j = 0; j < 4; ++j) {
				result[i * 4 + j] = a[i * 4 + 0] * b[0 * 4 + j]
				+ a[i * 4 + 1] * b[1 * 4 + j]
				+ a[i * 4 + 2] * b[2 * 4 + j]
				+ a[i * 4 + 3] * b[3 * 4 + j];
			}
		}
		return (result);
	}
	static identity() {
		return [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
	}
}