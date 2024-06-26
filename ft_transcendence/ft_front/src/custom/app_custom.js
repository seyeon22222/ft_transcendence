import { Setting } from "../../static/graphics/Setting.js"; // comp
import { Ray } from "../../static/phong/Ray.js"; // comp
import { EventManager } from "../../static/Event/EventManager.js"; // comp
import { delete_back_show } from "../utilities.js";
import { View } from "./app_view.js";

function deleteEvent() {
  Setting.deleteEvent('mouse');
}

window.removeEventListener('unload', deleteEvent);
window.addEventListener('unload', deleteEvent);

class Main {
	static objects = [];
	static add_button;
	static cam = null;
	static ray = null;

	static entry(hash, id) {
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
		requestAnimationFrame(Main.update);
	}
}

export async function custom_view(hash) {
	//TODO: 분기를 나눠 줄 것 (Main(custom page), View(보는 페이지) 둘 중 어느 것을 실행 시킬 지 결정)
    delete_back_show();
    const get_hash = hash.slice(1);
    let flag = 0;
    let get_list_hash = get_hash.split("_"); //get_hash '_'를 기준으로 split
    let match_id = get_list_hash[get_list_hash.length - 1]; //
  
    const csrftoken = Cookies.get("csrftoken");
    console.log("matchvie/${match_id}", `/matchview/${match_id}`);
    const response = await fetch(`/match/matchview/${match_id}`, {
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
      console.log(data.winner_username, "===", "null");
      if (
        data.player1_uuid === get_list_hash[0] && //해당 match_id에 해당하는 player1 , player2 가 hash에 주어진 uuid와 일치하는지 확인
        data.player2_uuid === get_list_hash[1] &&
        data.winner_username === null //winner_username 이 값이 없는지 확인 ->값이 있으면 이미 완료된 게임이므로
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
          console.log("user info API 요청 실패", error);
        }
      } else {
        location.href = "/#";
      }
    } else {
      location.href = "/#";
      const error = await response.json();
      console.log("match API 요청 실패", error);
    }
}