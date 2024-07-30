import { formatDateTime } from "../info/info_func.js";
import { change_date, showModal } from "../utilities.js";
import { setTextsbyLang } from "../language/language.js";

export async function profile_page_setting() {
	try {
		let data;
		const csrftoken = Cookies.get('csrftoken');
		
		const response = await fetch('user/info', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrftoken,
			},
			credentials: 'include',
		});
		if (response.ok) {
			data = await response.json();
			if (data) {
				const name = document.getElementById("username_input");
				const email = document.getElementById("email_input");
				name.placeholder = data[0].username;
				email.placeholder = data[0].email;

				profile_image_view(data, csrftoken);
				profile_game_stat_view(data);
				profile_match_info_view(data);
				check_match_list(data, csrftoken);
			}
			setTextsbyLang('profile');
		} else {
			const error = await response.json();
			console.error('API 요청 실패', error);
		}

		const edit_btn = document.getElementById("edit_button");
		profileChange(edit_btn, csrftoken);
	} catch (error) {
		console.error('API 요청 실패', error);
	}
}


async function profileChange(edit_btn, csrftoken) {
  edit_btn.addEventListener("click", async function (event) {
    event.preventDefault();
    try {
      const formData = new FormData();

      formData.append("username", document.getElementById("username_input").value);
      formData.append("email", document.getElementById("email_input").value);

      if (document.getElementById("new_image_input").files[0]) {
        formData.append("profile_picture", document.getElementById("new_image_input").files[0]);
      } else {
        formData.append("profile_picture", document.getElementById("profile-image").value || "");
      }

      const response = await fetch("user/change_info", {
        method: "POST",
        headers: {
          "X-CSRFToken": csrftoken,
        },
        body: formData,
      });

      if (response.ok) {
      const modal = document.querySelector('.modal');
      showModal('profile', 'change_noti');
      modal.addEventListener('hidden.bs.modal', function () {
	  		location.href = "/#";
		});
      } else {
		    showModal('profile', 'change_err');
      }
    } catch (error) {
      console.error("Profile 변경 중 오류 발생 : ", error);
    }
  });
}

async function profile_image_view(data, csrftoken) {
  const profile_image = document.getElementById("profile-image");
  profile_image.innerHTML = "";

  if (data[0].profile_picture) {
    const image = document.createElement("img");
    const response = await fetch(data[0].profile_picture, {
      method: "GET",
      headers: {
        "X-CSRFToken": csrftoken,
      },
      credentials: "include",
    });
    if (response.ok) {
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      image.src = imageUrl;
      image.alt = "프로필 이미지";

      profile_image.appendChild(image);
    }
  }
}

function profile_game_stat_view(data) {
  const game_stat = document.getElementById("game_status");
  const stats = data[0].game_stat[0] || {
    win_count: 0,
    defeat_count: 0,
    win_rate: "0",
  };

  const statElements = [
    createStatElement("승리 횟수", stats.win_count),
    createStatElement("패배 횟수", stats.defeat_count),
    createStatElement("승률", stats.win_rate + "%"),
  ];

  statElements.forEach((element) => game_stat.appendChild(element));
}

function profile_match_info_view(data) {
  const info = document.getElementById("match_info");

  const user_matchData = data[0].match_info[0] || {
    match_date: ["-"],
    match_result: ["-"],
  };
  const infoElements = [
    InfoElementcreate("최근 매치", data[0].match_info.length === 0 ? user_matchData.match_date : change_date(user_matchData.match_date)),
    InfoElementcreate("최근 매치 결과", user_matchData.match_result),
  ];

  infoElements.forEach((element) => info.appendChild(element));
}

async function respondToMatch(game_id, response, self_data, csrftoken) {
  const now = new Date();
  const startDate = formatDateTime(new Date(now.getTime() + 300));
  const username = self_data[0].username;
  const formData = {
    response: response,
    username: username,
    start_date: startDate,
  };

  const game_response = await fetch(`/match/response/${game_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(formData),
  });

  if (game_response.ok) {
    check_match_list(self_data, csrftoken);
  } else {
    const error = await game_response.json();
    console.error(error);
  }
}

async function match_list_view(self_data, match_data, csrftoken) {
  const matchList = document.getElementById("1:1_Match_List");
  matchList.innerHTML = "";
  match_data.forEach((match) => {
    if (match.status === "pending" && self_data[0].user_id !== match.requester) {
      const match_response = document.createElement("div");
      match_response.className = "match-item";
      match_response.innerHTML = `
            <p>${match.player1_username} vs ${match.player2_username}</p>
            <button class="btn btn-outline-light btn-sm accept-button" data-translate="accept" data-match-id="${match.id}">승인</button>
            <button class="btn btn-outline-light btn-sm reject-button" data-translate="reject" data-match-id="${match.id}">거절</button>
            `;
      matchList.appendChild(match_response);
    }
  });

  document.querySelectorAll(".accept-button").forEach((button) => {
    button.addEventListener("click", () =>
      respondToMatch(button.dataset.matchId, "accept", self_data, csrftoken)
    );
  });

  document.querySelectorAll(".reject-button").forEach((button) => {
    button.addEventListener("click", () =>
      respondToMatch(button.dataset.matchId, "reject", self_data, csrftoken)
    );
  });
}

async function check_match_list(user_data, csrftoken) {
  const response = await fetch("match/selfview", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    credentials: "include",
  });

  if (response.ok) {
    const match_data = await response.json();
    match_list_view(user_data, match_data, csrftoken);
  }
}

function createStatElement(label, value) {
  const keyword = { "승리 횟수": "wins", "패배 횟수": "loses", "승률": "win_percent"};
  const element = document.createElement("h4");

	element.innerHTML = `<span data-translate=${keyword[label]}>${label}</span><span>: ${value}</span>`;
  return element;
}

function InfoElementcreate(label, value) {
  const keyword = { "최근 매치": "recent_match", "최근 매치 결과": "recent_match_res"};

  const element = document.createElement("h4");
  if (value === "Win")
    element.innerHTML = `<span data-translate=${keyword[label]}>${label}</span><span>: </span><span data-translate="win">승리</span>`;
  else if (value === "Lose")
    element.innerHTML = `<span data-translate=${keyword[label]}>${label}</span><span>: </span><span data-translate="lose">패배</span>`;
  else
    element.innerHTML = `<span data-translate=${keyword[label]}>${label}</span><span>: ${value}</span>`;
  return element;
}