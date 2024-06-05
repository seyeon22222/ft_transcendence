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
      document.getElementById("tournament_name").innerHTML = data.name;
      const player1_name = data.player1_username;
      const player2_name = data.player2_username;
  
      const player1 = document.getElementById("semi_final1");
      player1.innerHTML = "";
      player1.innerHTML += player1_name;
  
      const player2 = document.getElementById("semi_final2");
      player2.innerHTML = "";
      player2.innerHTML += player2_name;
  
      if (data.match_result !== "") {
        const winner = document.getElementById("final");
        winner.innerHTML = "";
        winner.innerHTML += data.match_result;
      }
  
      //seycheon_only players can connect to 1:1 match
      let data_name;
      // get current user's name
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
      const user_name = data_name[0].username;
      if (
        data.player1_username === user_name ||
        data.player2_username === user_name
      ) {
        let temp_data;
        try {
          const response_hash = await fetch(`match/matchgethash/${matchId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrftoken,
            },
            credentials: "include",
          });
          if (response_hash.ok) {
            temp_data = await response_hash.json();
          } else {
            const error = await response_hash.json();
            console.error("API 요청 실패", error);
          }
        } catch (error) {
          console.error("API 요청 실패", error);
        }
  
        const startButton = document.getElementById("start_button");
        startButton.addEventListener("click", async (event) => {
          location.href = `/#game/${temp_data.hash}`;
        });
      } else {
        location.href = `/#matchlobby`;
      }
      //-------------------------------------------
    } else {
      const error = await response.json();
      alert(error);
    }
  }
  
  /*
        
        1. 토너먼트 모델에 토너먼트 방을 만든 사람에게 권한을 부여 -> order 부분 추가
        2. 방장 권한이 있으면 토너먼트 시작버튼으로 토너먼트를 시작할 수 있도록 추가하기
        3. 1:1 매칭의 경우, 이름을 생성하는 것이 아닌, 고유한 id를 통해서 해당 매치에 접근을 할 수 있도록 하기
        
        */