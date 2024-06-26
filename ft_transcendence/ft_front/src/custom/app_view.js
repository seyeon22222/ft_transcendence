import { Setting } from "../../static/graphics/Setting.js"; // comp
import { EventManager } from "../../static/Event/EventManager.js";
import { MouseEvent } from "../../static/Event/MouseEvent.js";
import { ObjectManager } from "../../static/phong/ObjectManager.js";

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
		//TODO 정보를 받아야함 함수로 만들 것
		Setting.setPipe();
		View.objects = Setting.setGameMap(false);
		View.cam = Setting.setCam();

		let ws = new WebSocket("wss://" + window.location.host + "/ws/custom/" + hash + "/");
		
		window.addEventListener("popstate", function () {
		// WebSocket 연결 닫기
		if (ws && ws.readyState !== WebSocket.CLOSED) {
			ws.close();
			ws = null;
			console.log("popstate : " + hash);
		}
		});

		ws.onmessage = async function (e) {
			let data = JSON.parse(e.data);
			let message = data["message"];

			console.log(message);
			if (message === "complete") {
				const csrftoken = Cookies.get("csrftoken");
				const response = await fetch(`/match/updatematchcustom/${id}`, {
					//match serializer 반환값 가져옴
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"X-CSRFToken": csrftoken,
					},
					credentials: "include",
				});
				if (response.ok) {
					let data = await response.json();
					for (let i = 0; i < data.length; i++)
						ObjectManager.addObstacle(View.objects, [data.r, data.g, data.b, 1], [data.x, data.y, 0.0], data.z, data.w, data.h);
				}
			}
		};

		EventManager.mouse_list.push(new MouseEvent('gamestart', null, null, View.objects));
		requestAnimationFrame(View.update);
	}
	
	static render() {
		Setting.setRender();
		View.cam.putCam();
        for (let i = 0; i < View.objects.length; i++)
			View.objects[i].draw(false);
	}

	static update() {
		View.render();
		requestAnimationFrame(View.update);
	}
}
