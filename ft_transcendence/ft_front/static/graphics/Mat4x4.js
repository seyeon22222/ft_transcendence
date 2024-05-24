class Mat4x4 {
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

	/**
	 * 
	 * @param {*} radian ->fov 
	 * @param {*} near 
	 * @param {*} far 
	 * @param {*} aspect 
	 * @returns 
	 */
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

	static camMatrix(normalizedLook, normalizedUp, pos) {
		normalizedLook = normalizeVec(normalizedLook);
		normalizedUp = normalizeVec(normalizedUp);
		let xaxis = crossProduct(normalizedUp, normalizedLook);
		xaxis = normalizeVec(xaxis);
		let yaxis = crossProduct(normalizedLook, xaxis);
		yaxis = normalizeVec(yaxis);
		let zaxis = [normalizedLook[0], normalizedLook[1], normalizedLook[2]];
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
}


function crossProduct(vec1, vec2) {
	let res = new Array(4);
	res[0] = vec1[1] * vec2[2] - vec1[2] * vec2[1];
	res[1] = vec1[2] * vec2[0] - vec1[0] * vec2[2];
	res[2] = vec1[0] * vec2[1] - vec1[1] * vec2[0];
	res[3] = 0
	return res;
}


function displayMat4(mat, name) {
	console.log(name);
	for (let i = 0; i < 4; i++) {
		console.log("%f %f %f %f", mat[4 * i + 0], mat[4 * i + 1], mat[4 * i + 2], mat[4 * i + 3]);
	}
	console.log('\n');
}


function normalizeVec(vec) {
	let length = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
	let res = new Array(3);
	res[0] = vec[0] / length;
	res[1] = vec[1] / length;
	res[2] = vec[2] / length;
	return res;
}
