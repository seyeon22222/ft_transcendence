import { change_date } from "../utilities.js";

export async function select_image_view(data) {
    const imageContainer = document.getElementById("profile-image");
    imageContainer.innerHTML = "";
    if (data.profile_picture) {
        const img = document.createElement("img");
        const csrftoken = Cookies.get('csrftoken');
        const response = await fetch(data.profile_picture, {
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
        const profileImageDiv = document.getElementById("profile-image");
        profileImageDiv.innerHTML = '';
        profileImageDiv.appendChild(img);
        }

    }
}

export function select_game_stat_view(data) {

	const gamestatus = document.getElementById("game_status");

	const createStatElement = (label, value) => {
	  const keyword = { "승리 횟수": "wins", "패배 횟수": "loses", "승률": "win_percent"};
	  const element = document.createElement("h4");
  
	  element.innerHTML = `<span data-translate=${keyword[label]}>${label}</span><span>: ${value}</span>`;
	  return element;
	};
  
	const stats = data.game_stat[0] || {
	  win_count: 0,
	  defeat_count: 0,
	  win_rate: "0",
	  
	};
  
	const statElements = [
	  createStatElement("승리 횟수", stats.win_count),
	  createStatElement("패배 횟수", stats.defeat_count),
	  createStatElement("승률", stats.win_rate + "%"),
	];
  
	statElements.forEach((element) => gamestatus.appendChild(element));	
}

export function select_match_info_view(data) {
	const match_info = document.getElementById("match_info");

	const createInfoElement = (label, value) => {
		const keyword = { "최근 매치": "recent_match", "최근 매치 결과": "recent_match_res",
							"Win": "win", "Lose": "lose", "-": "none"};

		const element = document.createElement("h4");
		if (label === "최근 매치")
			element.innerHTML = `<span data-translate=${keyword[label]}>${label}</span><span>: ${value}</span>`;
		else
			element.innerHTML = `<span data-translate=${keyword[label]}>${label}</span><span>: </span><span data-translate=${keyword[value]}>${value}</span>`;
		return element;
	};

	const matchData = data.match_info[0] || {
		match_date: ["-"],
		match_result: ["-"],
	};

	const infoElements = [
		createInfoElement(
		"최근 매치",
		data.match_info.length === 0
			? matchData.match_date
			: change_date(matchData.match_date)
		),
		createInfoElement("최근 매치 결과", matchData.match_result),
	];

	infoElements.forEach((element) => match_info.appendChild(element));
}

export function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

