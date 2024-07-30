
export class Input {
	static key_pressed = {};

	static keyDown(e) {
		if (e.repeat)
			return;
		if (Input.key_pressed[e.key])
			return;
		Input.key_pressed[e.key] = true;
	}

	static keyUp(e) {
		if (e.repeat)
			return;
		Input.key_pressed[e.key] = false;
	}

	static init() {
		Input.key_pressed = {};
		window.addEventListener("keyup", Input.keyUp);
		window.addEventListener("keydown", Input.keyDown);
	}
	
	static cleanup() {
		window.removeEventListener("keyup", Input.keyUp);
		window.removeEventListener("keydown", Input.keyDown);
	}

	static getKey(c) {
		const t = Input.key_pressed[c];

		if (t)
			return t;
		return (0);
	}
}