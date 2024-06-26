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
		View.objects = Setting.setBasicObjects();
		View.cam = Setting.setCam();

    let ws = new WebSocket("wss://" + window.location.host + "/ws/custom/" + hash + "/");
    
    window.addEventListener("popstate", function () {
      // WebSocket 연결 닫기
      if (ws && ws.readyState !== WebSocket.CLOSED) {
        ws.close();
        ws = null;
        console.log("popstate : " + get_hash);
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
			// console.log("data", data);
			// console.log("data.custom", data.custom);
			// console.log("(data.custom)[0].custom", (data.custom)[0].custom);
			// console.log("(data.custom)[0].custom.r", (data.custom)[0].custom.r);
			// data.custom의 길이만큼 반복
			for (var i = 0; i < data.custom.length; i++) {
				let customObject = {
					r: data.custom[i].custom.r,
					g: data.custom[i].custom.g,
					b: data.custom[i].custom.b,
					x: data.custom[i].custom.x,
					y: data.custom[i].custom.y,
					z: data.custom[i].custom.z
				  };
				  View.objects.push(customObject);
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
    for (let i = 0; i < View.objects.length; i++){
      if (i == 1) continue;
      (View.objects[i]).draw(false);
    }
	}

	static update() {
		View.render();
		requestAnimationFrame(View.update);
	}
}
