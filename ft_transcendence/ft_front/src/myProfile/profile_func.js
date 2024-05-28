import { formatDateTime } from "../info/info_func.js";

// 유저 프로필에서 변경사항 저장 버튼 이벤트 핸들러 등록
export async function dataChange(changeData, csrftoken) {
    changeData.addEventListener("click", async function (event) {
    	event.preventDefault();
		try {
			const formData = new FormData();

			formData.append('username', document.getElementById("username_input").value);
			formData.append('email', document.getElementById("email_input").value);

			// 새로운 이미지가 등록됬을 경우 해당 이미지로, 없으면 기존 이미지 사용
			if (document.getElementById("new_image_input").files[0]) {
				formData.append('profile_picture', document.getElementById("new_image_input").files[0]);
			} else {
				formData.append('profile_picture', document.getElementById("profile-image").value || '');
			}
	
			// API 요청 - 유저 정보 변경
			const response = await fetch('user/change_info', {
				method: 'POST',
				headers: {
					'X-CSRFToken': csrftoken,
				},
				body: formData
			});
	
			// 변경 성공시, 홈 화면으로 이동
			if (response.ok) {
				const data = await response.json();
				alert(data.message);
				location.href = '/#';
			}
			else {
				const error = await response.json();
				alert(error.message);
			}
		} catch (error) {
			console.log("Profile 변경 중 오류 발생 : ", error);
		}
    });
  }

// 유저 프로필에서 이미지 불러와 HTML에 렌더링
export async function image_view(data, csrftoken) {
	const imageContainer = document.getElementById("profile-image");
	imageContainer.innerHTML = "";

	// 유저에게 등록된 이미지가 있다면
	if (data[0].profile_picture) {
		const img = document.createElement("img");
		// API 요청 - 유저 프로필 이미지 요청
		const response = await fetch(data[0].profile_picture, {
			method: 'GET',
			headers: {
				'X-CSRFToken': csrftoken,
			},
			credentials: 'include',
		});
		if (response.ok) {
			const imageBlob = await response.blob();
			const imageUrl = URL.createObjectURL(imageBlob);
			img.src = imageUrl;
			img.alt = '프로필 이미지';
			
			imageContainer.appendChild(img);
		}
	}
}

// 유저 프로필에서 게임 스탯 불러와 HTML에 렌더링
export function game_stat_view(data) {
    const gamestatus = document.getElementById("game_status");

    const createStatElement = (label, value) => {
        const element = document.createElement("h4");
        element.textContent = `${label}: ${value}`;
        return element;
    };

    const stats = data.game_stat || {
        win_count: 0,
        defeat_count: 0,
        win_rate: "0%",
        reflect_rate: "0%"
    };

    const statElements = [
        createStatElement("승리 횟수", stats.win_count),
        createStatElement("패배 횟수", stats.defeat_count),
        createStatElement("승률", stats.win_rate),
        createStatElement("반사율", stats.reflect_rate)
    ];

    statElements.forEach(element => gamestatus.appendChild(element));
}

// 유저 프로필에서 매치 정보 불러와 HTML에 렌더링
export function match_info_view(data) {
    const match_info = document.getElementById("match_info");

    const createInfoElement = (label, value) => {
        const element = document.createElement("h4");
        element.textContent = `${label}: ${value}`;
        return element;
    };

    const matchData = data.match_info || {
        match_date: ["없음"],
        match_result: ["없음"]
    };

    const infoElements = [
        createInfoElement("최근 매치", matchData.match_date[0]),
        createInfoElement("최근 매치 결과", matchData.match_result[0])
    ];

    infoElements.forEach(element => match_info.appendChild(element));
}

// 1:1 매치 수락 또는 거절에 대한 이벤트 핸들러 등록
async function respondToMatch(matchId, response, self_data, csrftoken) {
	const now = new Date();
	const startDate = formatDateTime(new Date(now.getTime() + 300));
	const username = self_data[0].username;
	const formData = {
		response: response,
		username: username,
		start_date: startDate,
	};

	// API 요청 - 매치 정보 확인 후 수락 / 거절
	const responseFetch = await fetch(`/match/response/${matchId}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrftoken,
		},
		body: JSON.stringify(formData),
	});

	if (responseFetch.ok) {
		const data = await responseFetch.json();
		console.log(`Match ${response}ed:`, data);
		fetchMatchList(self_data, csrftoken);  // 목록을 새로 고침
	} else {
		const error = await responseFetch.json();
		console.log(error);
	}
}

// 자신이 신청한 걸 제외한 1:1 매치 리스트와 수락/거절 버튼 및 이벤트핸들러 등록
export async function match_list_view(self_data, match_data, csrftoken) {
	const matchListContainer = document.getElementById('1:1_Match_List');
	matchListContainer.innerHTML = '';
	match_data.forEach(match => { // 자기 자신이 신청한 1:1 매치 제외한 리스트에 대해, html에 삽입
		if (match.status === "pending" && self_data[0].user_id !== match.requester) {
			const matchElement = document.createElement('div');
			matchElement.className = 'match-item';
			matchElement.innerHTML = `
            <p>${match.player1_username} vs ${match.player2_username}</p>
            <button class="accept-button" data-match-id="${match.id}">Accept</button>
            <button class="reject-button" data-match-id="${match.id}">Reject</button>
            `;
			matchListContainer.appendChild(matchElement);
		}
	});

	// 모든 1:1 매치에 대해 수락 시 이벤트 핸들러 등록
	document.querySelectorAll('.accept-button').forEach(button => {
		button.addEventListener('click', () => respondToMatch(button.dataset.matchId, 'accept', self_data, csrftoken));
	});

	// 모든 1:1 매치에 대해 거절 시 이벤트 핸들러 등록
	document.querySelectorAll('.reject-button').forEach(button => {
		button.addEventListener('click', () => respondToMatch(button.dataset.matchId, 'reject', self_data, csrftoken));
	});
}

// 유저 프로필에서 일대일 매치 리스트 목록을 불러와 HTML에 렌더링
export async function fetchMatchList(user_data, csrftoken) {
	// API 요청 - 현재 유저가 참여한 모든 매치 정보를 요청
	const response = await fetch('match/selfview', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrftoken,
		},
		credentials: 'include',
	});

	if (response.ok) {
		const match_data = await response.json();
		// 1:1 매치 리스트 목록을 HTML에 렌더링, 수락/거절 이벤트핸들러 등록
		match_list_view(user_data, match_data, csrftoken);
	} else {
		const error = await response.json();
		console.log(error);
	}
}