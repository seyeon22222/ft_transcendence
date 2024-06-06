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
    match_render(data);
    console.log(data.requester === player_data[0].user_id);
    console.log(data.requester, player_data);
    if (data.requester === player_data[0].user_id) {
      const startButton = document.getElementById("match_start");
      startButton.addEventListener("click", async (event) => {
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
            // alert(`${player1.nickname}와 ${player2.nickname}에게 게임 초대가 전송되었습니다.`);
        } else {
            alert('게임 초대 전송에 실패했습니다.');
        }
      });
    } else {
      const startButton = document.getElementById("match_start");
      startButton.innerHTML = '';
    }
    //-------------------------------------------
  } else {
    const error = await response.json();
    alert(error);
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
      winner.innerHTML = data.match_result;
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