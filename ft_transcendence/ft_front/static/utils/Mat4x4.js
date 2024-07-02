let MIN = 0.0000000001;

export class Mat4x4 {
	static identityMat() {
        let mat = [
            1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
        ];
        return mat;
    }

	static scaleMatrix(scale) {
		let mat = Mat4x4.identityMat();
		for (let i = 0; i < 3; i++)
			mat[i * 4 + i] = scale;
		return mat;
	}

	static scaleMatrixByX(scale) {
		let mat = Mat4x4.identityMat();
		mat[0] = scale;
		return mat;
	}

	static scaleMatrixByY(scale) {
		let mat = Mat4x4.identityMat();
		mat[5] = scale;
		return mat;
	}

	static scaleMatrixByZ(scale) {
		let mat = Mat4x4.identityMat();
		mat[10] = scale;
		return mat;
	}

	static multipleMat4(a, b) {
		let res = new Array(16);
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				res[i * 4 + j] = 0;
				for (let k = 0; k < 4; k++)
					res[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j];
			}
		}
		return res;
	}

	static rotMatAxis(rotAxis1x4, degree) {
		let radian = degree / 180.0 * Math.PI;
		let x = rotAxis1x4[0];
		let y = rotAxis1x4[1];
		let z = rotAxis1x4[2];
		let length = Math.sqrt(x * x + y * y + z * z);
		x /= length;
		y /= length;
		z /= length;
		let cosin = Math.cos(radian);
		let sin = Math.sin(radian);
		let affine = [
			cosin + (1 - cosin) * x * x, (1 - cosin) * x * y - sin * z, (1 - cosin) * x * z + sin * y, 0,
			(1 - cosin) * x * y + sin * z, cosin + (1 - cosin) * y * y, (1 - cosin) * y * z - sin * x, 0,
			(1 - cosin) * x * z - sin * y, (1 - cosin) * y * z + sin * x, cosin + (1 - cosin) * z * z, 0,
			0, 0, 0, 1
		];
		return affine;
	}

	static rotMatAxisX(degree) {
		let radian = (degree / 180.0) * Math.PI;
		let sin = Math.sin(radian);
		let cosin = Math.cos(radian);
		let res = [
			1, 0, 0, 0,
			0, cosin, -sin, 0,
			0, sin, cosin, 0,
			0, 0, 0, 1
		];
		return res;
	}

	static rotMatAxisY(degree) {
		let radian = (degree / 180.0) * Math.PI;
		let sin = Math.sin(radian);
		let cosin = Math.cos(radian);
		let res = [
			cosin, 0, sin, 0,
			0, 1, 0, 0,
			-sin, 0, cosin, 0,
			0, 0, 0, 1
		];
		return res;
	}

	static rotMatAxisZ(degree) {
		let radian = (degree / 180.0) * Math.PI;
		let sin = Math.sin(radian);
		let cosin = Math.cos(radian);
		let res = [
			cosin, -sin, 0, 0,
			sin, cosin, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
		return res;
	}

	static transposeMat(mat4x4) {
		let temp;
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < i; j++) {
				temp = mat4x4[i * 4 + j];
				mat4x4[i * 4 + j] = mat4x4[j * 4 + i];
				mat4x4[j * 4 + i] = temp;
			}
		}
	}

	static transportMat(mat4x1) {
		let res = [
			1, 0, 0, mat4x1[0],
			0, 1, 0, mat4x1[1],
			0, 0, 1, mat4x1[2],
			0, 0, 0, 1
		];
		return res;
	}

	static projectionMatrix(radian, near, far, aspect) {
		let cot = Math.tan(Math.PI * 0.5 - 0.5 * radian);
		let res = [
			cot / aspect, 0, 0, 0,
			0, cot, 0, 0,
			0, 0, (far + near) / (near - far), 2 * far * near / (near - far),
			0, 0, -1, 0
		];
		return res;
	}

	static camMatrix(forward, Up, pos) {
		forward = normalizeVec(forward);
		Up = normalizeVec(Up);
		let xaxis = crossProduct(Up, forward);
		xaxis = normalizeVec(xaxis);
		let yaxis = crossProduct(forward, xaxis);
		yaxis = normalizeVec(yaxis);
		let zaxis = [forward[0], forward[1], forward[2]];
		let res = [
			xaxis[0], xaxis[1], xaxis[2], pos[0],
			yaxis[0], yaxis[1], yaxis[2], pos[1],
			zaxis[0], zaxis[1], zaxis[2], pos[2],
			0, 0, 0, 1
		];
		return res;
	}

	static viewMatrix(camMat) {
		let invRot = [
			camMat[0], camMat[1], camMat[2], 0,
			camMat[4], camMat[5], camMat[6], 0,
			camMat[8], camMat[9], camMat[10], 0,
			0, 0, 0, 1
		];
		this.transposeMat(invRot);
		let invTransport = [
			1, 0, 0, -camMat[3],
			0, 1, 0, -camMat[7],
			0, 0, 1, -camMat[11],
			0, 0, 0, 1
		];
		let res = Mat4x4.multipleMat4(invRot, invTransport);
		return res;
	}

	static multipleMat4AndVec4(mat, vec) {
		let res = [];
		for (let i = 0; i < 4; i++) {
			let total = 0;
			for (let j = 0; j < 4; j++)
				total += mat[i * 4 + j] * vec[j];
			res.push(total);
		}
		return res;
	}

	static invMat4(m)
	{
		let inv = Mat4x4.identityMat();
		let invOut = Mat4x4.identityMat();
		let det;
		let i;

		inv[0] = m[5]  * m[10] * m[15] - 
				m[5]  * m[11] * m[14] - 
				m[9]  * m[6]  * m[15] + 
				m[9]  * m[7]  * m[14] +
				m[13] * m[6]  * m[11] - 
				m[13] * m[7]  * m[10];

		inv[1] = -m[1]  * m[10] * m[15] + 
				m[1]  * m[11] * m[14] + 
				m[9]  * m[2] * m[15] - 
				m[9]  * m[3] * m[14] - 
				m[13] * m[2] * m[11] + 
				m[13] * m[3] * m[10];

		inv[2] = m[1]  * m[6] * m[15] - 
				m[1]  * m[7] * m[14] - 
				m[5]  * m[2] * m[15] + 
				m[5]  * m[3] * m[14] + 
				m[13] * m[2] * m[7] - 
				m[13] * m[3] * m[6];

		inv[3] = -m[1] * m[6] * m[11] + 
				m[1] * m[7] * m[10] + 
				m[5] * m[2] * m[11] - 
				m[5] * m[3] * m[10] - 
				m[9] * m[2] * m[7] + 
				m[9] * m[3] * m[6];

		inv[4] = -m[4]  * m[10] * m[15] + 
				m[4]  * m[11] * m[14] + 
				m[8]  * m[6]  * m[15] - 
				m[8]  * m[7]  * m[14] - 
				m[12] * m[6]  * m[11] + 
				m[12] * m[7]  * m[10];

		inv[5] = m[0]  * m[10] * m[15] - 
				m[0]  * m[11] * m[14] - 
				m[8]  * m[2] * m[15] + 
				m[8]  * m[3] * m[14] + 
				m[12] * m[2] * m[11] - 
				m[12] * m[3] * m[10];

		inv[6] = -m[0]  * m[6] * m[15] + 
				m[0]  * m[7] * m[14] + 
				m[4]  * m[2] * m[15] - 
				m[4]  * m[3] * m[14] - 
				m[12] * m[2] * m[7] + 
				m[12] * m[3] * m[6];

		inv[7] = m[0] * m[6] * m[11] - 
				m[0] * m[7] * m[10] - 
				m[4] * m[2] * m[11] + 
				m[4] * m[3] * m[10] + 
				m[8] * m[2] * m[7] - 
				m[8] * m[3] * m[6];

		inv[8] = m[4]  * m[9] * m[15] - 
				m[4]  * m[11] * m[13] - 
				m[8]  * m[5] * m[15] + 
				m[8]  * m[7] * m[13] + 
				m[12] * m[5] * m[11] - 
				m[12] * m[7] * m[9];

		inv[9] = -m[0]  * m[9] * m[15] + 
				m[0]  * m[11] * m[13] + 
				m[8]  * m[1] * m[15] - 
				m[8]  * m[3] * m[13] - 
				m[12] * m[1] * m[11] + 
				m[12] * m[3] * m[9];

		inv[10] = m[0]  * m[5] * m[15] - 
				m[0]  * m[7] * m[13] - 
				m[4]  * m[1] * m[15] + 
				m[4]  * m[3] * m[13] + 
				m[12] * m[1] * m[7] - 
				m[12] * m[3] * m[5];

		inv[11] = -m[0] * m[5] * m[11] + 
				m[0] * m[7] * m[9] + 
				m[4] * m[1] * m[11] - 
				m[4] * m[3] * m[9] - 
				m[8] * m[1] * m[7] + 
				m[8] * m[3] * m[5];

		inv[12] = -m[4]  * m[9] * m[14] + 
				m[4]  * m[10] * m[13] +
				m[8]  * m[5] * m[14] - 
				m[8]  * m[6] * m[13] - 
				m[12] * m[5] * m[10] + 
				m[12] * m[6] * m[9];

		inv[13] = m[0]  * m[9] * m[14] - 
				m[0]  * m[10] * m[13] - 
				m[8]  * m[1] * m[14] + 
				m[8]  * m[2] * m[13] + 
				m[12] * m[1] * m[10] - 
				m[12] * m[2] * m[9];

		inv[14] = -m[0]  * m[5] * m[14] + 
				m[0]  * m[6] * m[13] + 
				m[4]  * m[1] * m[14] - 
				m[4]  * m[2] * m[13] - 
				m[12] * m[1] * m[6] + 
				m[12] * m[2] * m[5];

		inv[15] = m[0] * m[5] * m[10] - 
				m[0] * m[6] * m[9] - 
				m[4] * m[1] * m[10] + 
				m[4] * m[2] * m[9] + 
				m[8] * m[1] * m[6] - 
				m[8] * m[2] * m[5];

		det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];
		det = 1.0 / det;

		for (i = 0; i < 16; i++) {
			invOut[i] = inv[i] * det;
			if (Math.abs(invOut[i]) < MIN)
				invOut[i] = 0;
		}

		return invOut;
	}
}


export function crossProduct(vec1, vec2) {
	let res = [0, 0, 0];
	res[0] = vec1[1] * vec2[2] - vec1[2] * vec2[1];
	res[1] = vec1[2] * vec2[0] - vec1[0] * vec2[2];
	res[2] = vec1[0] * vec2[1] - vec1[1] * vec2[0];
	return res;
}

export function normalizeVec(vec) {
	let length = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
	let res = new Array(3);
	res[0] = vec[0] / length;
	res[1] = vec[1] / length;
	res[2] = vec[2] / length;
	return res;
}
