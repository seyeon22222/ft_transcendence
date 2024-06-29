import { EventManager } from "../../static/Event/EventManager.js";
import { Setting } from "../../static/graphics/Setting.js";
import { ObjectManager } from "../../static/phong/ObjectManager.js";
// paddle_1 -> objects[1], paddle_2 -> objects[2], paddle_3 -> objects[3], paddle_4 -> objects[4], ball->objects[0]
// [-15, 1.5]              [15, 1.5]               [-15, -1.5]              [15, -1.5]
import { delete_back_show } from "../utilities.js";

class Main {
	static objects = [];
	static cam;
	static loop = true;
	static player = 0;

	static webfunc(get_hash, id) {
		let ws = new WebSocket(
		"wss://" + window.location.host + "/ws/multigame/" + get_hash + "/"
		);
		Setting.setPipe();
		Main.cam = Setting.setCam();
		Main.objects = Setting.setGameMap(true);
		Main.loop = true;
		EventManager.setEventKeyboard(Main.cam, ws);
		EventManager.setScreenEvent();

		const Fetch = async () => {
			const csrftoken = Cookies.get("csrftoken");
			const response = await fetch(`/match/updatemulticustom/${id}`, {
			//match serializer 반환값 가져옴
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-CSRFToken": csrftoken,
			},
			credentials: "include",
			});
			if (response.ok) {
				let data =  await response.json();
				console.log("app_m data: ", data);
				for (let i = 0; i < data.customs.length; i++) {
					let color = [data.customs[i].r / 255, data.customs[i].g / 255, data.customs[i].b / 255, 1];
					let pos = [data.customs[i].x, data.customs[i].y, 0, 1];
					let degree = data.customs[i].z;
					let w = data.customs[i].w;
					let h = data.customs[i].h;
					ObjectManager.addObstacle(Main.objects, color, pos, degree, w, h);
				}
			}
		}
		Fetch();

		function sleep(ms) {
			const start = new Date().getTime();
			while (new Date().getTime() < start + ms) {
				// 아무것도 하지 않고 대기
			}
		}

		window.addEventListener("popstate", function () {
			// WebSocket 연결 닫기
			if (ws && ws.readyState !== WebSocket.CLOSED) {
			ws.close();
			sleep(1000);
			ws = null;
			console.log("popstate : " + get_hash);
			}
			Main.player = 0;
			Main.loop = false;
			EventManager.deleteEvent('keyboard');
			EventManager.deleteEvent('screen');
		});

		ws.onopen = () => {
			let message = { message: "", pid: window.players};
			ws.send(JSON.stringify(message));
		}
  
		let messageQueue = [];
		let processingMessages = false;

		ws.onmessage = async function (e) {
			messageQueue.push(e);
			if (!processingMessages) {
				processingMessages = true;
				while (messageQueue.length > 0) {
				let event = messageQueue.shift();
				await processMessage(event);
				}
				processingMessages = false;
			}
		};
    
		async function processMessage(e) {
			let data = JSON.parse(e.data);
			let ball_pos = data["ball_pos"];
			let paddle1_pos = data["paddle1_pos"];
			let paddle2_pos = data["paddle2_pos"];
			let paddle3_pos = data["paddle3_pos"];
			let paddle4_pos = data["paddle4_pos"];
			let score1 = data["score1"];
			let score2 = data["score2"];
			let is_active = data["is_active"];

			if (score1 == 5 || score2 == 5) {
				let get_list_hash = get_hash.split("_");
				is_active = 0;
				console.log(
					"===========href=========",
					`/#multi/${get_list_hash[get_list_hash.length - 1]}`
				);
			} 
			else {
				document.getElementById("game-score").innerHTML =
					score1 + " : " + score2;
				Main.objects[0].movePos(ball_pos);
				Main.objects[1].movePos(paddle1_pos);
				Main.objects[2].movePos(paddle2_pos);
				Main.objects[3].movePos(paddle3_pos);
				Main.objects[4].movePos(paddle4_pos);
				if (Main.player == 0) {
					Main.player = window.players;
				}
			}
			if (is_active == 0) {
				console.log("is_active ============ 0")
				let get_list_hash = get_hash.split("_");
				location.href = `/#multi/2:2 Match ${get_list_hash[get_list_hash.length - 1]}`;
			}
		};
		Main.entry();
	}

	static entry() {
		Main.objects[window.players].setColor([0, 1, 0, 1]);
		requestAnimationFrame(Main.update);
	}

	static render() {
		Setting.setRender();
		Main.cam.setCam();
		for (let i = 0; i < Main.objects.length; i++)
			Main.objects[i].draw(false);
	}

	static update() {
		Main.render();
		if (Main.loop)
			requestAnimationFrame(Main.update);
	}
}

export async function game_multi_js(hash) {
  delete_back_show();
  const get_hash = hash.slice(1);
  let flag = 0;
  let get_list_hash = get_hash.split("_"); //get_hash '_'를 기준으로 split
  let match_id = get_list_hash[get_list_hash.length - 1]; //

  const csrftoken = Cookies.get("csrftoken");
  console.log("matchview/${match_id}", `/multimatchview/${match_id}`);
  const response = await fetch(`/match/multimatchview/${match_id}`, {
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
    console.log(data.player3_uuid, "===", get_list_hash[2]);
    console.log(data.player4_uuid, "===", get_list_hash[3]);
    console.log(data.winner_username, "===", "null");
    if (
      data.player1_uuid === get_list_hash[0] && //해당 match_id에 해당하는 player1 , player2 가 hash에 주어진 uuid와 일치하는지 확인
      data.player2_uuid === get_list_hash[1] &&
      data.player3_uuid === get_list_hash[2] &&
      data.player4_uuid === get_list_hash[3] &&
      data.match_result === null //winner_username 이 값이 없는지 확인 ->값이 있으면 이미 완료된 게임이므로
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
          Main.webfunc(get_hash, match_id);
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
