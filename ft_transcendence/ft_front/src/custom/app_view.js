import { Setting } from "../../static/graphics/Setting.js"; // comp
import { EventManager } from "../../static/Event/EventManager.js"; // comp
import { MouseEvent } from "../../static/Event/MouseEvent.js";

export class View {
	static objects = [];
	static add_button;
	static cam = null;
	static ray = null;

	static entry() {
		Setting.setPipe();
		//TODO 정보를 받아야함 함수로 만들 것
		Main.cam = Setting.setCam();

        EventManager.mouse_list.push(new MouseEvent('gamestart', null, null, Main.objects));
		requestAnimationFrame(Main.update);
	}
	
	static render() {
		Setting.setRender();
		Main.cam.putCam();
        for (let i = 0; i < Main.objects.length; i++)
            Main.objects.draw();
	}

	static update() {
		Main.render();
		requestAnimationFrame(Main.update);
	}
}