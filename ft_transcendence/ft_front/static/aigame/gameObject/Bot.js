import { GameObject } from "./GameObject.js";
import { BotControl } from "../component/BotControl.js";

export class Bot extends GameObject {
	constructor() {
		super();
		this.bot_control = new BotControl(this); // #TODO
	}
	start(parent) {
		this.bot_control.start();
		super.start();
	}
	update(parent) {
		this.bot_control.update();
		super.update();
	}
}