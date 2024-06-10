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
    const winCount = document.createElement("h4");
    const defeatCount = document.createElement("h4");
    const winRate = document.createElement("h4");
    const reflectRate = document.createElement("h4");
    if (data.game_stat.length === 0) {
        winCount.textContent = "승리 횟수: 0";
        defeatCount.textContent = "패배 횟수: 0";
        winRate.textContent = "승률: 0%";
        reflectRate.textContent = "반사율: 0%";
    } else {
        winCount.textContent = "승리 횟수: " + data.game_stat[0].win_count;
        defeatCount.textContent = "패배 횟수: " + data.game_stat[0].defeat_count;
        winRate.textContent = "승률: " + data.game_stat[0].win_rate + "%";
        reflectRate.textContent = "반사율: " + data.game_stat[0].reflect_rate + "%";
    }

    gamestatus.appendChild(winCount);
    gamestatus.appendChild(defeatCount);
    gamestatus.appendChild(winRate);
    gamestatus.appendChild(reflectRate);
}

export function select_match_info_view(data) {
  const match_info = document.getElementById("match_info");
  const match_date = document.createElement("h4");
  const match_result = document.createElement("h4");
      if (data.match_info.length === 0) {
      match_date.textContent = "최근 매치: 없음";
      match_result.textContent = "최근 매치 결과: 없음";
      } else {
      match_date.textContent = "최근 매치:" + change_date(data.match_info[0].match_date);
      match_result.textContent = "최근 매치 결과:" + data.match_info[0].match_result;
      }
  match_info.appendChild(match_date);
  match_info.appendChild(match_result);
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

