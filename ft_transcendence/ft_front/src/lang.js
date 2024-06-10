// import { check_login } from '../utilities.js'

const lang = {
	ko: {
		home: {
			login: "로그인",
			signup: "회원가입",
			my_profile: "내 프로필",
			chatting: "채팅",
			tournament: "토너먼트",
			matchmaking: "매치메이킹",
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
			change_pic: "사진 변경",
			change_id: "ID 변경",
			change_email: "이메일 변경",
			save_changes: "변경사항 저장",
			wins: "승리 횟수",
			loses: "패배 횟수",
			win_percent: "승률",
			reflections: "반사율",
			recent_match: "최근 매치",
			recent_match_res: "최근 매치 결과",
			accept: "승인",
			reject: "거절",
		},
		info: {
			match_request: "매치 신청",
			chat: "1:1 채팅",
			chat_block: "1:1 채팅 차단",
			chat_unblock: "1:1 채팅 차단 해제",
		},
		chat: {
			msg: "메세지를 입력하세요"
		},
		chatprivate: {
			msg: "메세지를 입력하세요"
		},
		chatlobby: {
			room_list: "채팅방 목록",
			user_list: "유저 목록",
			create_room: "채팅방 만들기",
			room_name: "새 채팅방 이름",
			create_btn: "생성",
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
			change_pic: "change profile image",
			change_id: "change id",
			change_email: "change email",
			save_changes: "Save Changes",
			wins: "Wins",
			loses: "Loses",
			win_percent: "Win Percentage",
			reflections: "Reflections",
			recent_match: "Recent Match",
			recent_match_res: "Recent Match Results",
			accept: "accept",
			reject: "reject",
		},
		info: {
			match_request: "Request Match",
			chat: "1:1 Chat",
			chat_block: "1:1 Chat Block",
			chat_unblock: "1:1 Chat Unblock",
		},
		chat: {
			msg: "Write Message Here"
		},
		chatprivate: {
			msg: "Write Message Here"
		},
		chatlobby: {
			room_list: "Room List",
			user_list: "User List",
			create_room: "Create a new room",
			room_name: "Write Room Name",
			create_btn: "Create",
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
			change_pic: "プロフィール画像を変更する",
			change_id: "IDを変更する",
			change_email: "メールを変更する",
			save_changes: "変更を保存する",
			wins: "勝利",
			loses: "負け",
			win_percent: "Win Percentage",
			reflections: "Reflections",
			recent_match: "Recent Match",
			recent_match_res: "Recent Match Results",
			accept: "受諾",
			reject: "拒否",
		},
		info: {
			match_request: "マッチリクエスト",
			chat: "1:1チャット",
			chat_block: "1:1 Chat Block",
			chat_unblock: "1:1 Chat Unblock",
		},
		chat: {
			msg: "Write Message Here"
		},
		chatprivate: {
			msg: "Write Message Here"
		},
		chatlobby: {
			room_list: "Room List",
			user_list: "User List",
			create_room: "Create a new room",
			room_name: "Write Room Name",
			create_btn: "Create",
		}
	}
};

let langNow = 'ko';


// newLang -> 언어의 값이 변경일어남
// 로그인이 되어있을 경우에는 newLang의 값을 '' 로 넘겨주면
// 유저의 데이터베이스에 있는 언어로 변경


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
			console.log(data);
			langNow = data[0].langauge;
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
		// console.log(key);
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
			const data = await response.json();
			console.log(data);
		}
	}
});
