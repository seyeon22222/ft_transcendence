
export class Vector3 {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	static sub(a, b) {
		return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
	}
	static normalize(a) {
		const hypot = Math.hypot(a.x, a.y, a.z);

		return new Vector3(a.x / hypot, a.y / hypot, a.z / hypot);
	}
	static cross(a, b) {
		return new Vector3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
	}
	static dot(a, b) {
		return a.x * b.x + a.y * b.y + a.z * b.z;
	}
}