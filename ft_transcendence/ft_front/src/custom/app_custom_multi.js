import { Setting } from "../../static/graphics/Setting.js";
import { Ray } from "../../static/phong/Ray.js";
import { EventManager } from "../../static/Event/EventManager.js";
import { delete_back_show } from "../utilities.js";
import { View } from "./app_view_multi.js";
import { event_add_popstate } from "../utilities.js";

class Main {
	static objects = [];
	static add_button;
	static cam = null;
	static ray = null;
  	static loop = true;

	static entry(hash, id) {
    	let ws = new WebSocket("wss://" + window.location.host + "/ws/multicustom/" + hash + "/");
		Main.loop = true;

		function multi_popstate(event) {
			if (ws && ws.readyState !== WebSocket.CLOSED) {
				ws.close();
				ws = null;
			}
			EventManager.deleteEvent('mouse');
			Main.loop = false;
		}
		
		event_add_popstate(multi_popstate);
    
		ws.onopen = () => {
			let message = {message: window.players};
			ws.send(JSON.stringify(message));
		};

		ws.onmessage = async function (e) {
			let data = JSON.parse(e.data);
			let message = data["message"];
			let time = data["time"];

			if (time != undefined)
				document.getElementById("time").innerHTML = time;
			if (message === 'start' || time == 0)
				location.href = "/#gamemulti/" + hash;
		};

		Setting.setPipe();
		Main.objects = Setting.setBasicObjects();
		Main.add_button = Setting.setAddButton();
		Main.cam = Setting.setCam();
		Main.ray = new Ray(Main.cam);

		EventManager.setEventMouse(Main.ray, Main.add_button, Main.objects, id, ws);
		requestAnimationFrame(Main.update);
	}
	
	static render() {
		Setting.setRender();
		Main.cam.putCam();
		for (let i = 0; i < 6; i++) {
			if (i === 1)
				continue;
			Main.objects[i].draw(false);
		}
		for (let i = 6; i < Main.objects.length; i++) {
			let flag = false;
			if (Main.objects[i].pos[0] >= 14 || Main.objects[i].pos[0] <= -14)
				flag = true;
			if (Main.objects[i].pos[1] >= 7 || Main.objects[i].pos[1] <= -7)
				flag = true;
			let max_x = -100, max_y = -100, min_x = 100, min_y = 100;
			for (let k = 0; k < 4; k++) {
				if (Main.objects[i].colbox.vertices[k][0] > max_x)
					max_x = Main.objects[i].colbox.vertices[k][0];
				if (Main.objects[i].colbox.vertices[k][0] < min_x)
					min_x = Main.objects[i].colbox.vertices[k][0];
				if (Main.objects[i].colbox.vertices[k][1] > max_y)
					max_y = Main.objects[i].colbox.vertices[k][1];
				if (Main.objects[i].colbox.vertices[k][1] < min_y)
					min_y = Main.objects[i].colbox.vertices[k][1];
			}
			if (max_x > 14 || min_x < -14 || max_y > 7 || min_y < -7)
				flag = true;
			if (flag === false) {
				for (let j = 1; j < i; j++) {
					if (Main.objects[i].collision(Main.objects[j]) === true) {
						flag = true;
						break;
					}
				}
			}
			Main.objects[i].draw(flag);
		}
		Main.add_button.draw(false);
	}

	static update() {
		if (Main.loop) {
			Main.render();
			requestAnimationFrame(Main.update);
		}
	}
}

export async function multicustom_view(hash) {
  delete_back_show();
  const get_hash = hash.slice(1);
  let flag = 0;
  let get_list_hash = get_hash.split("_");
  let match_id = get_list_hash[get_list_hash.length - 1];
  setLanguage("custom");
  const csrftoken = Cookies.get("csrftoken");
  const response = await fetch(`/match/multimatchview/${match_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    credentials: "include",
  });
  if (response.ok) {
    let data = await response.json();
    if (
      data.player1_uuid === get_list_hash[0] &&
      data.player2_uuid === get_list_hash[1] &&
      data.player3_uuid === get_list_hash[2] &&
      data.player4_uuid === get_list_hash[3] &&
      data.is_start === false &&
	  data.match_result === null
    ) {
      const response_name = await fetch("user/info", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        credentials: "include",
      });
      if (response_name.ok) {
        let data = await response_name.json();
        let get_list_hash = get_hash.split("_");
        window.players = 0;
        for (let i = 0; i < get_list_hash.length - 1; i++) {
          if (get_list_hash[i] == data[0].user_id) {
            window.uuid = data[0].user_id;
            window.players = i + 1;
            flag = 1;
          }
        }
        if (flag == 1) {
          if (window.players === 1)
            Main.entry(get_hash, match_id);
          else
            View.entry(get_hash, match_id);
        } else {
          location.href = "/#";
        }
      } else {
        location.href = "/#";
        const error = await response_name.json();
        console.error("UserInfo API 요청 실패", error);
      }
    } else {
      location.href = "/#";
    }
  } else {
    location.href = "/#";
    const error = await response.json();
    console.error("match API 요청 실패", error);
  }
}
