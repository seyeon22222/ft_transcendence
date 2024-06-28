import { EventManager } from "../../static/Event/EventManager.js";
import { Setting } from "../../static/graphics/Setting.js";
import { ObjectManager } from "../../static/phong/ObjectManager.js";
// paddle_1 -> objects[1], paddle_2 -> objects[2], ball -> objects[0], up wall -> objects[3], down wall -> objects[4]
import { delete_back_show } from "../utilities.js";

class Main {
	static objects = [];
	static cam;
	static player = 0;
	static loop = true;

	static async webfunc(get_hash, match_id) {
		let flag = 1;
		// WebSocket 연결 시도
		let ws = new WebSocket(
			"wss://" + window.location.host + "/ws/tgame/" + get_hash + "/"
		);
		Setting.setPipe();
		Main.cam = Setting.setCam();
		Main.objects = Setting.setGameMap(false);
		EventManager.setEventKeyboard(Main.cam, ws);
		EventManager.setScreenEvent();
		Main.loop = true;

		const Fetch = async () => {
			const csrftoken = Cookies.get("csrftoken");
			let hash = window.location.hash.slice(1); // "#customt/..."의 '#'을 제거
			console.log(hash);

			// 해시 값을 슬래시(/)를 기준으로 먼저 분할합니다.
			let segments = hash.split('/'); // ["customt", "3e4096e9-caac-4c04-9055-91b65d963517_0f6c78a4-eb60-4469-aa97-7da2a75a6269_138"]

			// UUID 부분을 언더스코어(_)로 분할합니다.
			let uuids = segments[1].split('_'); // ["3e4096e9-caac-4c04-9055-91b65d963517", "0f6c78a4-eb60-4469-aa97-7da2a75a6269", "138"]
			
			// player1과 player2의 UUID를 추출합니다.
			let player1 = uuids[0];
			let player2 = uuids[1];
			
			console.log("Player 1 UUID:", player1);
			console.log("Player 2 UUID:", player2);
			const response = await fetch(`/match/updatetournamentcustom/${player1}${player2}${match_id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-CSRFToken": csrftoken,
			},
			credentials: "include",
			});
			if (response.ok) {
				let data =  await response.json();
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
		await Fetch();

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
			}
			Main.player = 0;
			EventManager.deleteEvent("keyboard");
			EventManager.deleteEvent("screen");
			Main.loop = false;
		});

		let messageQueue = [];
		let processingMessages = false;

		ws.onopen = () => {
			let message = { message: "", players: window.players};
			ws.send(JSON.stringify(message));
		}

		ws.onclose = () => {
			console.log("ws close : " + get_hash);
		};

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
			let score1 = data["score1"];
			let score2 = data["score2"];
			let is_active = data["is_active"];

			if (score1 == 5 || score2 == 5) {
				let get_list_hash = get_hash.split("_");
				is_active = 0;
				// console.log(
				// 	"===========href=========",
				// 	`/#tournament/${get_list_hash[get_list_hash.length - 1]}`
				// );
			} 
			else {
				if (document.getElementById("game-score"))
					document.getElementById("game-score").innerHTML = score1 + " : " + score2;
				Main.objects[0].movePos(ball_pos);
				Main.objects[1].movePos(paddle1_pos);
				Main.objects[2].movePos(paddle2_pos);
				if (Main.player == 0) {
					Main.player = window.players;
					flag = 0;
				}
				if (!flag && Main.loop) {
					Main.entry();
					flag = 1;
				}
			}

			if (is_active == 0) {
				let get_list_hash = get_hash.split("_");
				let match_id = get_list_hash[get_list_hash.length - 1];
				console.log(`/match/t_matchview/${get_list_hash[0]}${get_list_hash[1]}${match_id}`);
				const csrftoken_t = Cookies.get("csrftoken");
				const response_t = await fetch(`/match/t_matchview/${get_list_hash[0]}${get_list_hash[1]}${match_id}`, {
					method: "GET",
					headers: {
					"Content-Type": "application/json",
					"X-CSRFToken": csrftoken_t,
					},
					credentials: "include",
				});
				if (response_t.ok) {
					let data = await response_t.json();
					let name_t = data.name;
					console.log("name_t", name_t);
					await closeWebSocket();
					location.href = `/#tournament/${name_t}`;
				}
			}
		}

		async function closeWebSocket() {
			if (ws) {
				ws.close();
				ws = null;
			}
		}
	}
	static entry() {
		Main.objects[window.players].setColor([0, 1, 0, 1]);
		requestAnimationFrame(Main.update);
	}
	static render() {
		Setting.setRender();
		Main.cam.putCam();
		for (let i = 0; i < Main.objects.length; i++)
			Main.objects[i].draw(false);
	}
	static update() {
		Main.render();
		if (Main.loop)
			requestAnimationFrame(Main.update);
	}
}

export async function game_t_js(hash) {
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
		} 
		else {
			location.href = "/#";
		}
	} 
	else {
		location.href = "/#";
		const error = await response.json();
		console.log("match API 요청 실패", error);
	}
}
