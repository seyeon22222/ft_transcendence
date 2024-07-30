import { Time } from "../core/Time.js";
export class BotControl {
	constructor(gameObject) {
		this.gameObject = gameObject;
		this.table = null;
		this.player_id = -1;
		this.racket_x = 0;
		this.ball_x = 0;
		this.ball_y = 0;
		this.ball_vx = 0;
		this.ball_vy = 0;
		this.target_y = 0;
		this.type = "UNFRIENDLY";
		this.counter = 0;
	}
	start() {}
	predict() {
		let ball_x = this.table.ball.transform.position.x;
		let ball_y = this.table.ball.transform.position.z;
		let ball_vx = this.table.ball_velocity[0];
		let ball_vy = this.table.ball_velocity[1];
		let ball_size = this.table.ball.transform.scale.x;
		let width = this.table.width;
		let height = this.table.height;

		this.racket_y = this.table.stick[this.player_id].transform.position.z;
		this.ball_x = ball_x;
		this.ball_y = ball_y;
		while (true) {
			let min_dt = Number.POSITIVE_INFINITY;
			let min_type = "None";
			if (ball_vy < 0) {
				const dt = (-height / 2 - (ball_y - ball_size * 0.5)) / (ball_vy);

				if (dt < min_dt) {
					min_dt = dt;
					min_type = "Y-Wall";
				}
			} else if (ball_vy > 0) {
				const dt = (height / 2 - (ball_y + ball_size * 0.5)) / (ball_vy); 

				if (dt < min_dt) {
					min_dt = dt;
					min_type = "Y+Wall";
				}
			}
			if (ball_vx < 0) {
				const dt = (-width / 2 - (ball_x - ball_size * 0.5)) / (ball_vx);

				if (dt < min_dt) {
					min_dt = dt;
					min_type = "X-Wall";
				}
			} else if (ball_vx > 0) {
				const dt = (width / 2 - (ball_x + ball_size * 0.5)) / (ball_vx); 

				if (dt < min_dt) {
					min_dt = dt;
					min_type = "X+Wall";
				}
			}
			ball_x += ball_vx * min_dt;
			ball_y += ball_vy * min_dt;
			switch (min_type) {
				case "Y-Wall":
				case "Y+Wall":
					ball_vy *= -1;
					continue;
				case "X-Wall:":
				case "X+Wall:":
					break;
				default:
					break;
			}
			break;
		}
		switch(this.type) {
			case "FRIENDLY":
				this.target_y = ball_y;
				break;
			case "UNFRIENDLY":
				this.target_y = ball_y + this.table.stick[this.player_id].transform.scale.z * 0.5;
				break;
		}
	}
	update() {
		this.counter += Time.deltaTime;
		if (this.counter > 1) {
			this.counter -= 1;
			this.predict();
			//console.log("PREDICT");
		}
		let direction = Math.sign(this.target_y - this.racket_y)
		this.racket_y += direction * Time.deltaTime;
		this.table.setInput(this.player_id, direction); // 초보
	}
}