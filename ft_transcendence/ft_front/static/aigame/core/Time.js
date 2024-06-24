
export class Time {
	static time = 0;
	static deltaTime = 0;

	static init() {
		Time.time = performance.now();
		Time.deltaTime = 0;
	}
	static update() {
		Time.deltaTime = (performance.now() - Time.time) / 1000	;
		Time.time = performance.now();
	}
}