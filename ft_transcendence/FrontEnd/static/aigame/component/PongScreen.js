
import { gl } from "../core/definition.js";
import { TextureAsset } from "../asset/TextureAsset.js";
export class PongScreen {
	constructor(gameObject) {
		this.gameObject = gameObject;
		this.transform = gameObject.transform;
		this.canvas = new OffscreenCanvas(384, 256);
		// document.getElementById("screen_canvas");
		// this.canvas.width = 384;
		// this.canvas.height = 256;
		this.ctx = this.canvas.getContext("2d", {
			willReadFrequently: true
		});
		this.ball_x = 0;
		this.ball_y = 0;
		this.winner = 0;
		this.param = ["Invalid"];
	}
	start() {}
	update() {


		// this.ctx.fillStyle = "rgb(29, 35, 42)";
		// this.ctx.fillRect(0, 0, 384, 256);

		// this.ctx.strokeStyle = "rgb(210, 255, 255)";
		// this.ctx.lineWidth = 2;
		// this.ctx.beginPath();
		// this.ctx.moveTo(2, 0);
		// this.ctx.lineTo(2, 256);
		// this.ctx.moveTo(382, 0);
		// this.ctx.lineTo(382, 256);
		// this.ctx.stroke();

		// this.ctx.lineWidth = 1;
		// this.ctx.strokeStyle = "rgb(83, 144, 148)";
		// for (let i = 16; i < 256 - 8; i += 8) {
		// 	this.ctx.beginPath();
		// 	this.ctx.moveTo(16, i);
		// 	this.ctx.lineTo(368, i);
		// 	this.ctx.stroke();
		// }
		// for (let i = 16; i < 384 - 8; i += 8) {
		// 	this.ctx.beginPath();
		// 	this.ctx.moveTo(i, 16);
		// 	this.ctx.lineTo(i, 240);
		// 	this.ctx.stroke();
		// }

		this.renderScreen();
		gl.bindTexture(gl.TEXTURE_2D, TextureAsset.screen_emission);
		gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 384, 256, gl.RGBA, gl.UNSIGNED_BYTE, this.ctx.getImageData(0, 0, 384, 256).data);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
	setState(param) {
		this.state = param;
	}
	renderScreen() {
		this.ctx.clearRect(0, 0, 384, 256);
		this.ctx.fillStyle = "rgb(29, 35, 42)";
		this.ctx.fillRect(16, 16, 352, 32);
		this.ctx.fillRect(16, 208, 352, 32);

		this.ctx.fillStyle = "rgb(210, 255, 255)";
		this.ctx.fillRect((this.ball_x * 12 + 12) * 16, (this.ball_y * 8 + 8) * 16, 16, 16);
		
		switch(this.state[0]) {
			case "Ready":{
				const time = this.state[1];
				this.ctx.textBaseline = "middle";
				this.ctx.textAlign = "center";
				this.ctx.fillStyle = "rgb(210, 255, 255)";
				this.ctx.font = "bold 140pt Courier";
				this.ctx.fillText(""+Math.ceil(time), 192, 138);
			}return;
			case "Playing":{
			}return;
			case "Score":{
				this.winner = this.state[1];
			}return;
			case "PostScore":{
				const time = this.state[1];
				let score = [this.state[2], this.state[3]];
				let y = 0;
				if (time > 2) {
					y = 256 - (1 - Math.pow(1 - (3 - time), 4)) * 256;
					score[this.winner] -= 1;
				} else if (time > 1) {
					y = 0;
					if (time > 1.5) {
						score[this.winner] -= 1;
					}
				} else {
					y = Math.pow(1 - time, 4) * 256
				}
				this.ctx.clearRect(0, y, 384, 256);
				this.ctx.textBaseline = "middle";
				this.ctx.textAlign = "right";
				this.ctx.fillStyle = "rgb(210, 255, 255)";
				this.ctx.font = "bold 140pt Courier";
				this.ctx.fillText("" + score[0], 172, y + 138);
				this.ctx.textAlign = "center";
				this.ctx.fillText(":", 192, y + 138);
				this.ctx.textAlign = "left";
				this.ctx.fillText("" + score[1], 212, y + 138);
			}return;
			case "GameOver":{
				const text = this.state[1];
				const time = this.state[2];
				let y = 0;
				if (time > 4) {
					y = 256 - (1 - Math.pow(1 - (5 - time), 4)) * 256;
				} else if (time > 1.5) {
					y = 0;
				} else if (time > 0.5) {
					y = Math.pow(1.5 - time, 4) * 256
				} else if (time > 0) {
					y = 256;
				}
				this.ctx.clearRect(0, y, 384, 256);
				this.ctx.textBaseline = "middle";
				this.ctx.textAlign = "center";
				this.ctx.fillStyle = "rgb(210, 255, 255)";
				this.ctx.font = "bold 120pt sans-serif";
				this.ctx.fillText(text, 192, y + 128);
			}return;
		}
	}
}