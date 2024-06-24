
export class Input {
	static key_pressed = {};

	static getKey(c) {
		const t = Input.key_pressed[c];

		if (t)
			return t;
		return (0);
	}

	static {
		window.addEventListener("keydown", (e) => {
			if (e.repeat)
					return;
			if (Input.key_pressed[e.key])
				return;
			Input.key_pressed[e.key] = true;
		});
		window.addEventListener("keyup", (e) => {
			if (e.repeat)
				return;
			Input.key_pressed[e.key] = false;
		});
	}
}