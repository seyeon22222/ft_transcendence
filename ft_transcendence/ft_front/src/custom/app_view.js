import { Setting } from "../../static/graphics/Setting.js"; // comp
import { EventManager } from "../../static/Event/EventManager.js"; // comp
import { MouseEvent } from "../../static/Event/MouseEvent.js";

export class View {
	static objects = [];
	static add_button;
	static cam = null;
	static ray = null;

	static entry(hash, id) {
		//TODO 정보를 받아야함 함수로 만들 것
		Setting.setPipe();
		View.cam = Setting.setCam();

    EventManager.mouse_list.push(new MouseEvent('gamestart', null, null, View.objects));
		requestAnimationFrame(View.update);
	}
	
	static render() {
		Setting.setRender();
		View.cam.putCam();
    for (let i = 0; i < View.objects.length; i++)
      View.objects.draw();
	}

	static update() {
		View.render();
		requestAnimationFrame(View.update);
	}
}
