import { Setting } from "../../static/graphics/Setting.js"; // comp
import { Ray } from "../../static/phong/Ray.js"; // comp
import { EventManager } from "../../static/Event/EventManager.js"; // comp
import { delete_back_show } from "../utilities.js";
import { View } from "./app_view_t.js";

class Main {
	static objects = [];
	static add_button;
	static cam = null;
	static ray = null;
  static loop = true;

	static entry(hash, id) {
    let ws = new WebSocket("wss://" + window.location.host + "/ws/tcustom/" + hash + "/");

    window.addEventListener("popstate", function () {
      // WebSocket 연결 닫기
      if (ws && ws.readyState !== WebSocket.CLOSED) {
        ws.close();
        ws = null;
        console.log("popstate : " + hash);
      }
      EventManager.deleteEvent('mouse');
      Main.loop = false;
    });
    
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
      console.log("message : " + message);
      if (message === 'start' || time == 0) {
				location.href = "/#gamet/" + hash;
			}
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
		Main.render();
    if (Main.loop)
		  requestAnimationFrame(Main.update);
	}
}

export async function tcustom_view(hash) {
	delete_back_show();
	const get_hash = hash.slice(1);
	let flag = 0;
	let get_list_hash = get_hash.split("_"); //get_hash '_'를 기준으로 split
	let match_id = get_list_hash[get_list_hash.length - 1]; //

	const csrftoken = Cookies.get("csrftoken");
	console.log("t_matchview/${get_list_hash[0]}${get_list_hash[1]}${match_id}", `/t_matchview/${get_list_hash[0]}${get_list_hash[1]}${match_id}`);
	const response = await fetch(`/match/t_matchview/${get_list_hash[0]}${get_list_hash[1]}${match_id}`, {
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
		console.log(data.player1_uuid, "===", get_list_hash[0]);
		console.log(data.player2_uuid, "===", get_list_hash[1]);
		console.log(data.match_result, "===", "null");
		if (
			data.player1_uuid === get_list_hash[0] && //해당 match_id에 해당하는 player1 , player2 가 hash에 주어진 uuid와 일치하는지 확인
			data.player2_uuid === get_list_hash[1] &&
			data.match_result == '' //winner_username 이 값이 없는지 확인 ->값이 있으면 이미 완료된 게임이므로
		) {
			console.log("abc");
			const response_name = await fetch("user/info", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        credentials: "include",
        });
			if (response_name.ok) {
			//url에 해당 uuid값이 있는지
        let data = await response_name.json();
        let get_list_hash = get_hash.split("_");
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
            View.entry(get_hash, get_list_hash[0], get_list_hash[1], match_id);
        } else {
          location.href = "/#";
        }
      }
      else {
        location.href = "/#";
        const error = await response_name.json();
        console.log("UserInfo API 요청 실패", error);
			}
		} 
		else {
			location.href = "/#";
		}
	} 
	else {
		location.href = "/#";
		const error = await response.json();
		console.log("tournament match API 요청 실패", error);
	}
}