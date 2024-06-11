export async function match_view(hash) {
  const matchId = hash.slice(1);
  const csrftoken = Cookies.get("csrftoken");
  const response = await fetch(`match/matchview/${matchId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    credentials: "include",
  });

  if (response.ok) {
    const data = await response.json();
    const player_data = await get_name();
    const Button = document.getElementById("button_container");
    match_render(data);
    makeButton(Button, matchId, data, player_data);
  } else {
    const error = await response.json();
    alert(error);
  }
}

function makeButton(Button, matchId, data, player_data) {
  if (data.requester === player_data[0].user_id && data.is_active === true) {
    const existingButton = document.getElementById("match_start_button");
    if (existingButton) {
        existingButton.removeEventListener("click", (event) => start_match(event, matchId, data));
        Button.removeChild(existingButton);
    }
    const startButton = document.createElement("button");
    startButton.innerHTML = "매치 시작";
    startButton.id = "match_start_button";
    Button.appendChild(startButton);
    
    startButton.addEventListener("click", (event) => start_match(event, matchId, data));
  } else {
    const existingButton = document.getElementById("match_start_button");
      if (existingButton) {
          existingButton.removeEventListener("click", start_match);
          Button.removeChild(existingButton);
      }
  }
}

async function start_match(event, matchId, data) {
  event.preventDefault();
  const csrftoken = Cookies.get('csrftoken');
  const response = await fetch(`match/invite_m/${matchId}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
      },
      credentials: 'include',
      body: JSON.stringify({ player1: data.player1, player2: data.player2, id : matchId}),
  });
  if (response.ok) {
      console.log(`${data.player1_username}와 ${data.player2_username}에게 게임 초대가 전송되었습니다.`);
  } else {
      alert('게임 초대 전송에 실패했습니다.');
  }
}

function match_render(data) {
  document.getElementById("tournament_name").innerHTML = data.name;
  const player1_name = data.player1_username;
  const player2_name = data.player2_username;

  const player1 = document.getElementById("semi_final1");
  if (player1) {
    player1.innerHTML = player1_name;
  }

  const player2 = document.getElementById("semi_final2");
  if (player2) {
    player2.innerHTML = player2_name;
  }

  if (data.match_result !== "") {
    const winner = document.getElementById("final");
    if (winner) {
      let winner_name;
      data.match_result === 1 ? winner_name = player1_name : winner_name = player2_name;
      winner.innerHTML = winner_name;
    }
  }
}

async function get_name() {
  let data_name;
  const csrftoken = Cookies.get('csrftoken');
  const response_name = await fetch("user/info", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    credentials: "include",
  });
  if (response_name.ok) {
    data_name = await response_name.json();
  } else {
    const error = await response.json();
    console.error("API 요청 실패", error);
  }
  
  return (data_name);
}
