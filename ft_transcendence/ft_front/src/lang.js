// import { check_login } from '../utilities.js'

window.lang = {
	ko: {
		home: {
			login: "로그인",
			signup: "회원가입",
			my_profile: "내 프로필",
			chatting: "채팅",
			tournament: "토너먼트",
			matchmaking: "매치메이킹",
			multimatchmaking: "2:2 매치",
			logout: "로그아웃",
		},
		login: {
			login: "로그인",
			signup: "회원가입",
			home: "홈으로",
			id: "아이디",
			password: "비밀번호",
		},
		signup: {
			login: "로그인",
			signup: "회원가입",
			home: "홈으로",
			id: "아이디",
			password: "비밀번호",
			email: "이메일",
		},
		profile: {
			title: "유저 프로필",
			change_pic: "사진 변경",
			change_id: "ID 변경",
			change_email: "이메일 변경",
			save_changes: "변경사항 저장",
			game_stat: "게임 스탯",
			wins: "승리 횟수",
			loses: "패배 횟수",
			win_percent: "승률",
			reflections: "반사율",
			match_his: "매치 히스토리",
			recent_match: "최근 매치",
			recent_match_res: "최근 매치 결과",
			win: "승리",
			lose: "패배",
			match_list: "1:1 매치 초대",
			accept: "승인",
			reject: "거절",
		},
		info: {
			title: "유저 프로필",
			match_request: "매치 신청",
			chat: "1:1 채팅",
			chat_block: "1:1 채팅 차단",
			chat_unblock: "1:1 채팅 차단 해제",
			game_stat: "게임 스탯",
			wins: "승리 횟수",
			loses: "패배 횟수",
			win_percent: "승률",
			reflections: "반사율",
			match_his: "매치 히스토리",
			recent_match: "최근 매치",
			recent_match_res: "최근 매치 결과",
			win: "승리",
			lose: "패배",
		},
		chat: {
			msg: "메세지를 입력하세요"
		},
		chatprivate: {
			msg: "메세지를 입력하세요",
			submit: "전송",
		},
		chatlobby: {
			room_list: "채팅방 목록",
			user_list: "유저 목록",
			create_room: "채팅방 만들기",
			room_name: "새 채팅방 이름",
			create_btn: "생성",
		},
		matchlobby: {
			tournament_list: "토너먼트 매치",
			create_tournament: "토너먼트 만들기",
			tournament_name: "토너먼트 이름",
			create_btn: "생성",
			two_match_list: "2:2 매치",
			one_match_list: "1:1 매치",
		},
		tournament: {
			nick_input: "별칭을 입력하세요",
			apply: "토너먼트 신청",
			start: "토너먼트 시작",
		},
		message: {
			match_complete: "매칭 완료: ",
			accept: "수락",
			err: "경고",
			notify: "알림",
			info_nouser_err: "해당 유저가 없습니다",
			info_selfmatch_err: "자기 자신에게는 매치 신청이 불가능합니다",
			info_selfchat_err: "자기 자신에게는 채팅 신청이 불가능합니다",
			info_selfblock_err: "자기 자신을 차단할 수 없습니다",
			info_selfunblock_err: "자기 자신을 차단 해제할 수 없습니다",
			info_match_req: "매치 신청 성공",
			info_match_req_err: "이미 매치를 신청했습니다",
			info_unblock_err: "차단되지 않은 상대입니다",
			info_block_err: "이미 차단된 상대입니다",
			info_block_noti: "채팅 차단 성공",
			info_unblock_noti: "채팅 차단 해제 성공",
			info_is_blocked: "채팅 차단 상태입니다",
		}
	},
	en: {
		home: {
			login: "Login",
			signup: "Sign Up",
			my_profile: "My Profile",
			chatting: "Chatting",
			tournament: "Tournament",
			matchmaking: "Matchmaking",
			multimatchmaking: "2:2 Match",
			logout: "Logout",
		},
		login: {
			login: "Login",
			signup: "Sign Up",
			home: "Go Home",
			id: "Write Your ID",
			password: "Write Your Password",
		},
		signup: {
			login: "Login",
			signup: "Sign Up",
			home: "Go Home",
			id: "Write Your ID",
			password: "Write Your Password",
			email: "Write Your Email",
		},
		profile: {
			title: "USER INFOMATION",
			change_pic: "change profile image",
			change_id: "change id",
			change_email: "change email",
			save_changes: "Save Changes",
			game_stat: "GAME STAT",
			wins: "Wins",
			loses: "Loses",
			win_percent: "Win Percentage",
			reflections: "Reflections",
			match_his: "MATCH HISTORY",
			recent_match: "Recent Match",
			recent_match_res: "Recent Match Result",
			win: "Win",
			lose: "Lose",
			match_list: "1:1 Match Invite List",
			accept: "accept",
			reject: "reject",
		},
		info: {
			title: "USER INFORMATION",
			match_request: "Request Match",
			chat: "1:1 Chat",
			chat_block: "1:1 Chat Block",
			chat_unblock: "1:1 Chat Unblock",
			game_stat: "GAME STAT",
			wins: "Wins",
			loses: "Loses",
			win_percent: "Win Percentage",
			reflections: "Reflections",
			match_his: "MATCH HISTORY",
			recent_match: "Recent Match",
			recent_match_res: "Recent Match Results",
			win: "Win",
			lose: "Lose",
		},
		chat: {
			msg: "Write Message Here"
		},
		chatprivate: {
			msg: "Write Message Here",
			submit: "Submit",
		},
		chatlobby: {
			room_list: "Room List",
			user_list: "User List",
			create_room: "Create a new room",
			room_name: "Write Room Name",
			create_btn: "Create",
		},
		matchlobby: {
			tournament_list: "Tournament List",
			create_tournament: "Create a tournament",
			tournament_name: "Tournamennt Name",
			create_btn: "Create",
			two_match_list: "2:2 Match List",
			one_match_list: "1:1 Match List",
		},
		tournament: {
			nick_input: "Wirte nickname here",
			apply: "Tournament Apply",
			start: "Tournament Start",
		},
		message: {
			match_complete: "Matching Completed: ",
			accept: "Accept",
			err: "ERROR",
			info_selfmatch_err: "en) 자기 자신에게는 매치 신청이 불가능합니다!",
			info_selfchat_err: "en) 자기 자신에게는 채팅 신청이 불가능합니다!",
		}
	},
	ja: {
		home: {
			login: "ログイン",
			signup: "登録する",
			my_profile: "私のプロフィール",
			chatting: "チャット",
			tournament: "トーナメント",
			matchmaking: "マッチメイキング",
			multimatchmaking: "2:2マッチ",
			logout: "ログアウト",
		},
		login: {
			login: "ログイン",
			signup: "登録する",
			home: "ホームへ戻る",
			id: "IDを書く",
			password: "パスワードを書く",
		},
		signup: {
			login: "ログイン",
			signup: "登録する",
			home: "ホームへ戻る",
			id: "IDを書く",
			password: "パスワードを書く",
			email: "メールを書く",
		},
		profile: {
			title: "ユーザー情報",
			change_pic: "プロフィール画像を変更する",
			change_id: "IDを変更する",
			change_email: "メールを変更する",
			save_changes: "変更を保存する",
			game_stat: "ゲームスタッツ",
			wins: "勝利回数",
			loses: "負け回数",
			win_percent: "勝率",
			reflections: "反射率",
			match_his: "試合履歴",
			recent_match: "最近の試合",
			recent_match_res: "最近の試合結果",
			win: "勝利",
			lose: "負け",
			match_list: "1:1試合招待リスト",
			accept: "受諾",
			reject: "拒否",
		},
		info: {
			title: "ユーザー情報",
			match_request: "マッチリクエスト",
			chat: "1:1チャット",
			chat_block: "1:1チャットブロック",
			chat_unblock: "1:1チャットブロック解除",
			game_stat: "ゲームスタッツ",
			wins: "勝利回数",
			loses: "負け回数",
			win_percent: "勝率",
			reflections: "反射率",
			match_his: "試合履歴",
			recent_match: "最近の試合",
			recent_match_res: "最近の試合結果",
			win: "勝利",
			lose: "負け",
		},
		chat: {
			msg: "メッセージを入力してください"
		},
		chatprivate: {
			msg: "メッセージを入力してください",
			submit: "転送",
		},
		chatlobby: {
			room_list: "チャットルーム一覧",
			user_list: "ユーザー一覧",
			create_room: "チャットルームの作成",
			room_name: "新しいチャットルーム名",
			create_btn: "作成",
		},
		matchlobby: {
			tournament_list: "トーナメントマッチ",
			create_tournament: "トーナメント作成",
			tournament_name: "トーナメント名",
			create_btn: "作成",
			two_match_list: "2:2マッチ",
			one_match_list: "1:1マッチ",
		},
		tournament: {
			nick_input: "エイリアスを入力してください",
			apply: "トーナメント申込",
			start: "トーナメント開始",
		},
		message: {
			match_complete: "マッチング完了: ",
			accept: "受諾",
			err: "エラー",
			info_selfmatch_err: "ja) 자기 자신에게는 매치 신청이 불가능합니다!",
			info_selfchat_err: "ja) 자기 자신에게는 채팅 신청이 불가능합니다!",
		}
	}
};

let langNow = 'ko';

async function setLanguage(category) {
	if (await check_login() === true) {
		const csrftoken = Cookies.get('csrftoken');
		const response = await fetch('user/info', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrftoken,
			},
		});
		
		if (response.ok) {
			const data = await response.json();
			console.log("setLanguage", data);
			langNow = data[0].language;
			document.getElementById("languageSelector").value = langNow;
		}
	}
	else
		langNow = document.getElementById("languageSelector").value;
	updateTexts(langNow, category);
	console.log(langNow, category);
}

function updateTexts(langNow, category) {
	document.querySelectorAll('[data-translate]').forEach(element => {
		const key = element.getAttribute('data-translate');
		element.innerText = lang[langNow][category][key];
    });

	document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
		const key = element.getAttribute('data-translate-placeholder');
		element.setAttribute('placeholder', lang[langNow][category][key]);
    });
}


async function check_login() {
	try {
		const csrftoken = Cookies.get('csrftoken');
		const response = await fetch('user/check_login', {
		  method: 'GET',
		  headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrftoken,
		  },
		});
	
		if (response.status === 301) {
		  return false;
		}
		return true;
	  } catch (error) {
		console.error('로그인 여부 확인 중 오류 발생 : ', error);
	  }
}


const language = document.getElementById("languageSelector");
language.addEventListener("change", async (event) => {
	event.preventDefault();

	if (await check_login() === true) {
		let data;
		const csrftoken = Cookies.get('csrftoken');
		const test_res = await fetch(`user/language`, {
			method : 'GET',
			headers : {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrftoken,
			},
			credentials: 'include',
		});

		if (test_res.ok) {
			data = await test_res.json();
			console.log(data);
		}
	
		const response = await fetch('user/language', {
			method: 'POST',
			headers: {
				'Content-Type' : 'application/json',
				'X-CSRFToken' : csrftoken,
			},
			body: JSON.stringify({user_id : data[0].user_id, language: document.getElementById('languageSelector').value})
		});
		
		if (response.ok) {
			// const t_data = await response.json();
			// console.log(t_data);
			// console.log("change!", document.getElementById('languageSelector').value);
		}
	}
	user_location = location.hash.slice(1).toLocaleLowerCase().split("/");
	category = user_location[0];
	if (category.length === 0)
		category = "home";
	setLanguage(category);
});