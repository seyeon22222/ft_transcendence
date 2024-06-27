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
					for (var i = 0; i < data.custom.length; i++) {
						let color = [data.custom[i].custom.r, data.custom[i].custom.g, data.custom[i].custom.b, 1];
						let pos = [data.custom[i].custom.x, data.custom[i].custom.y, 0, 1];
						let degree = data.custom[i].custom.z;
						let w = data.custom[i].custom.w;
						let h = data.custom[i].custom.h;
						ObjectManager.addObstacle(View.objects, color, pos, degree, w, h);
					}
				}
				console.log('view objects', View.objects);
			}
    }

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
