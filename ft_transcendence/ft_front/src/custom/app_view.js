import { Setting } from "../../static/graphics/Setting.js"; // comp
import { EventManager } from "../../static/Event/EventManager.js";
import { MouseEvent } from "../../static/Event/MouseEvent.js";

function deleteEvent() {
	Setting.deleteEvent('mouse');
}

window.removeEventListener('unload', deleteEvent);
window.addEventListener('unload', deleteEvent);

export class View {
	static objects = [];
	static add_button;
	static cam = null;
	static ray = null;

	static entry(hash, id) {
		Setting.setPipe();
		View.objects = Setting.setBasicObjects();
		View.cam = Setting.setCam();


        EventManager.mouse_list.push(new MouseEvent('gamestart', null, null, View.objects));
		requestAnimationFrame(View.update);
	}
	
	static render() {
		Setting.setRender();
		View.cam.putCam();
        for (let i = 0; i < View.objects.length; i++) {
            if (i == 1) continue;
			View.objects[i].draw(false);
		}
	}

	static update() {
		View.render();
		requestAnimationFrame(View.update);
	}
}
