export async function profile_view() {
  const profile_view = document.getElementById("profile_form");
  let data;
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
      data = await response.json();
    } else {
      const error = await response.json();
      console.error('API 요청 실패', error);
    }
  } catch (error) {
    console.error('API 요청 실패', error);
  }
  console.log(data);
  if (data) {
    const name = document.getElementById("username_input");
    const email = document.getElementById("email_input");
    const image = document.getElementById("image");
    const gamestatus = document.getElementById("game_status");
    const matchinfo = document.getElementById("match_info");

    name.placeholder = data[0].username;
    email.placeholder = data[0].email;
    image_view(data);
    game_stat_view(data);
    match_info_view(data);
    
    
  }

  const changeData = document.getElementById("edit_button");
  changeData.addEventListener("click", async function() {

  });

}

function image_view(data) {
    if (!data.image) {
        console.log("qwe");
    } else {

    }
}

function game_stat_view(data) {
    const gamestatus = document.getElementById("game_status");
    const winCount = document.createElement("h1");
    const defeatCount = document.createElement("h1");
    const winRate = document.createElement("h1");
    const reflectRate = document.createElement("h1");
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

function match_info_view(data) {
    if (!data.match_info) {
        console.log("zxc");
    } else {

    }
}