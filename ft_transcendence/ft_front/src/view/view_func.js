import { formatDateTime } from "../info/info_func.js";

export async function dataChange(changeData) {
    changeData.addEventListener("click", async function (event) {
      event.preventDefault();
      try {
        const csrftoken = Cookies.get('csrftoken');
        const formData = new FormData();
        formData.append('username', document.getElementById("username_input").value);
        formData.append('email', document.getElementById("email_input").value);
        if (document.getElementById("new_image_input").files[0]) {
          formData.append('profile_picture', document.getElementById("new_image_input").files[0]);
        } else {
          formData.append('profile_picture', document.getElementById("profile-image").value || '');
        }
  
        const response = await fetch('user/change_info', {
          method: 'POST',
          headers: {
            'X-CSRFToken': csrftoken,
          },
          body: formData
        });
  
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
        console.log("error:", error);
      }
    });
  }
  
export async function image_view(data) {
  const imageContainer = document.getElementById("profile-image");
  imageContainer.innerHTML = "";

  if (data[0].profile_picture) {
      const img = document.createElement("img");
      const csrftoken = Cookies.get('csrftoken');
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

export function game_stat_view(data) {
    const gamestatus = document.getElementById("game_status");
    const winCount = document.createElement("h4");
    const defeatCount = document.createElement("h4");
    const winRate = document.createElement("h4");
    const reflectRate = document.createElement("h4");
    if (!data.game_stat) {       
        winCount.textContent = "승리 횟수: 0";
        defeatCount.textContent = "패배 횟수: 0";
        winRate.textContent = "승률: 0%";
        reflectRate.textContent = "반사율: 0%";
    } else {
        winCount.textContent = data.game_stat.win_count;
        defeatCount.textContent = data.game_stat.defeat_count;
        winRate.textContent = data.game_stat.win_rate;
        reflectRate.textContent = data.game_stat.reflect_rate;
    }

    gamestatus.appendChild(winCount);
    gamestatus.appendChild(defeatCount);
    gamestatus.appendChild(winRate);
    gamestatus.appendChild(reflectRate);
}

export function match_info_view(data) {
  const match_info = document.getElementById("match_info");
  const match_date = document.createElement("h4");
  const match_result = document.createElement("h4");
      if (!data.match_info) {
      match_date.textContent = "최근 매치: 없음";
      match_result.textContent = "최근 매치 결과: 없음";
      } else {
      match_date.textContent = "최근 매치:" + data.match_info.match_date[0];
      match_result.textContent = "최근 매치 결과:" + data.match_info.match_result[0];
      }
  match_info.appendChild(match_date);
  match_info.appendChild(match_result);
}

async function respondToMatch(matchId, response, name) {
  const now = new Date();
  const startDate = formatDateTime(new Date(now.getTime() + 300));
  const csrftoken = Cookies.get('csrftoken');
  const username = name;
  const formData = {
      response: response,
      username: username,
      start_date : startDate,
  };

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
      fetchMatchList();  // 목록을 새로 고침
  } else {
      const error = await responseFetch.json();
      console.log(error);
  }
}



export async function match_list_view(data, username) {
  
  console.log("In match_list_view func ",data);
  // 개인 정보창 불러오기
  let self_data;
  try {
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
      self_data = await response.json();
    } else {
      const error = await response.json();
      console.error('API 요청 실패', error);
    }
  } catch (error) {
    console.error('API 요청 실패', error);
  }
  // 자기자신이 신청한 1:1 매치 제외하고 리스트 받아오기
  const matchListContainer = document.getElementById('1:1_Match_List');
  matchListContainer.innerHTML = '';
  data.forEach(match => {
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

  document.querySelectorAll('.accept-button').forEach(button => {
      button.addEventListener('click', () => respondToMatch(button.dataset.matchId, 'accept', username));
  });

  document.querySelectorAll('.reject-button').forEach(button => {
      button.addEventListener('click', () => respondToMatch(button.dataset.matchId, 'reject', username));
  });
}


export async function fetchMatchList(username) {
  const csrftoken = Cookies.get('csrftoken');

  const response = await fetch('match/selfview', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
      },
      credentials: 'include',
  });

  if (response.ok) {
      const data = await response.json();
      match_list_view(data, username);
  } else {
      const error = await response.json();
      console.log(error);
  }
}