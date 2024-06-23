import { Setting } from "../../static/graphics/Setting.js"; // comp
import { EventManager } from "../../static/Event/EventManager.js"; // comp
import { MouseEvent } from "../../static/Event/MouseEvent.js";

class Main {
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

export async function custom_view(hash) {
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
            Main.entry(get_hash);
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