
/*
State {
Ready
Playing,
PostScore,
GameOver,
Pause
}
*/
import { Vector3 } from "../util/Vector3.js";
import { Time } from "../core/Time.js";
import { clamp } from "../util/MathUtil.js";

export class PongTable {
	constructor(gameObject) {
		this.gameObject = gameObject;
		this.transform = gameObject.transform;
		this.width = 2;
		this.height = 1;
		this.ball = null;
		this.ball_velocity = [-1, Math.random()];
		this.stick = [null, null];
		this.stick_velocity = [0, 0];

		this.stick[0] = this.gameObject.children[0];
		this.stick[1] = this.gameObject.children[1];
		this.ball = this.gameObject.children[2];
		this.fsm_state = "Ready";
		this.fsm_params = [3]; // 3초 기다리기
	}
	start() {
		this.stick[0].transform.position = new Vector3(-(this.width + this.stick[0].transform.scale.x) * 0.5, 0, 0);
		this.stick[1].transform.position = new Vector3((this.width + this.stick[1].transform.scale.x) * 0.5, 0, 0);
	}
	
	update() {
		while (true) {
			switch (this.fsm_state) {
				case "Ready":{
					const time = this.fsm_params.pop();
					if (time < 0) {
						this.ball.transform.position.x = 0; // 중심으로 이동
						this.ball.transform.position.z = 0; // 중심으로 이동
						this.stick[0].transform.position.z = 0;
						this.stick[1].transform.position.z = 0;
						// ball direction set
						this.fsm_state = "Playing";
						break;
					}
					this.ball.transform.position.x = (this.ball.transform.position.x) * 0.9;
					this.ball.transform.position.z = (this.ball.transform.position.z) * 0.9; // 중심으로 이동
					this.stick[0].transform.position.z = this.stick[0].transform.position.z * 0.9;
					this.stick[1].transform.position.z = this.stick[1].transform.position.z * 0.9;
					this.fsm_params.push(time - Time.deltaTime);
				}return;
				case "Playing":{
					this.updateStick();
					this.updateBall();
					if (this.fsm_state != "Playing")
						break;
				}return;
				case "PostScore":{
					const winner = this.fsm_params.pop();
					this.fsm_state = "Ready";
					this.fsm_params.push(3); //3초
					break;
				}return;
				case "GameOver":{

				}return;
				case "Pause":{

				}return;
			}
		}
	}

	updateStick() {
		this.stick[0].transform.position.z = clamp(
			this.stick[0].transform.position.z + this.stick_velocity[0] * Time.deltaTime,
			-this.height / 2, this.height / 2
		);
		this.stick[1].transform.position.z = clamp(
			this.stick[1].transform.position.z + this.stick_velocity[1] * Time.deltaTime,
			-this.height / 2, this.height / 2
		);
	}

	sweepTest(t) {
		let ret = {dt: t, type: "None"};

		if (this.ball_velocity[1] < 0) { // 내려가는 중
			const dt = (-this.height / 2 - (this.ball.transform.position.z - this.ball.transform.scale.z * 0.5)) / (this.ball_velocity[1]);

			if (dt < ret.dt)
				ret = {dt: dt, type: "Z+Wall"};
		} else if(this.ball_velocity[1] > 0) { // 올라가는중
			const dt = (this.height / 2 - (this.ball.transform.position.z + this.ball.transform.scale.z * 0.5)) / (this.ball_velocity[1]); 

			if (dt < ret.dt)
				ret = {dt: dt, type: "Z-Wall"};
		}
		if (this.ball_velocity[0] < 0) { // 왼쪽으로 가는 중
			const dt = (((-this.width / 2) - (this.ball.transform.position.x - this.ball.transform.scale.x * 0.5))) / (this.ball_velocity[0]);

			if (dt < ret.dt) {
				ret = {dt: dt, type: "X-Wall"};
			}
		} else if (this.ball_velocity[0] > 0) { // 오른쪽으로 가는 중
			const dt = (((this.width / 2) - (this.ball.transform.position.x + this.ball.transform.scale.x * 0.5))) / (this.ball_velocity[0]);

			if (dt < ret.dt) {
				ret = {dt: dt, type: "X+Wall"};
			}
		}
		return (ret);
	}

	updateBall() {
		let t = Time.deltaTime;
		while (t > 0) {
			let sweep = this.sweepTest(t);
			this.ball.transform.position.x += this.ball_velocity[0] * sweep.dt;
			this.ball.transform.position.z += this.ball_velocity[1] * sweep.dt;
			switch (sweep.type) {
			case "Z-Wall":
			case "Z+Wall":
				this.ball_velocity[1] *= -1;
				break;
			case "X-Wall":{
				let offset = this.ball.transform.position.z - this.stick[0].transform.position.z;
				const racket_size = this.stick[0].transform.scale.z;
				const ball_size = this.ball.transform.scale.z;
				if (-(racket_size + ball_size) * 0.5 <= offset && offset <= (racket_size + ball_size) * 0.5) {
					this.ball_velocity[1] = offset / racket_size * 3; // -1.5 ~ 1.5
					this.ball_velocity[0] *= -1;
				} else {
					this.fsm_state = "PostScore";
					this.fsm_params.push("2P");
					return;
				}
			}break;
			case "X+Wall":{
				let offset = this.ball.transform.position.z - this.stick[1].transform.position.z;
				const racket_size = this.stick[1].transform.scale.z;
				const ball_size = this.ball.transform.scale.z;
				if (-(racket_size + ball_size) * 0.5 <= offset && offset <= (racket_size + ball_size) * 0.5) {
					this.ball_velocity[1] = offset / racket_size * 3; // -1.5 ~ 1.5
					this.ball_velocity[0] *= -1;
				} else {
					this.fsm_state = "PostScore";
					this.fsm_params.push("1P");
					return;
				}
			}break;
			}
			t -= sweep.dt;
		}
	}

	setInput(id, v) {
		this.stick_velocity[id] = v;
	}
}
