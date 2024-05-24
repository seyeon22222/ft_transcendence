import { formatDateTime } from "../info/info_func.js";
let socket;

export async function tournament_view(hash) {
    if (socket) {
        socket.close();
        socket = null;
    }
    const tournament_name = hash.slice(1);
    const arr = tournament_name.split(`%20`);
    let cnt = 0;
    let tournament_id; // tournament_id 초기화
    arr.forEach(element => {
        cnt++;
        if (cnt == arr.length)
            document.getElementById("tournament_name").innerHTML += element;
        else
            document.getElementById("tournament_name").innerHTML += element + " ";
    });

    // 토너먼트에 대한 정보 출력
    const result = await updateTournamentInfo(arr);
    const { player, tournament_id: updatedTournamentId } = result;
    tournament_id = updatedTournamentId;

    socket = new WebSocket(
        `wss://${window.location.host}/ws/tournament/${tournament_id}/`
    );
    socket.onopen = function(e) {
        console.log("socket open");
    }
    socket.onmessage = async function(e) {
        const data = JSON.parse(e.data);
        console.log(data.message);

        // 필요한 DOM 업데이트 로직
        const result = await updateTournamentInfo(arr);
        const { player, tournament_id } = result;
        
    };

    socket.onclose = function(e) {
        console.log('Chat socket closed unexpectedly');
    };

    let t_data;
    try {
        const csrftoken = Cookies.get('csrftoken');
        const response_t = await fetch('user/info', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            credentials: 'include',
        });
        if (response_t.ok) {
            t_data = await response_t.json();
        } else {
            const error = await response_t.json();
            console.error('API 요청 실패', error);
        }
    } catch (error) {
        alert(error);
    }

    const apply_button = document.getElementById('tournament_button');
    apply_button.addEventListener("click", async (event) => {
        event.preventDefault();
        const nickname = document.getElementById('nickname_input').value;
        try {
            if (player.length >= 8) {
                alert("최대 인원(8명)을 초과했습니다.");
                return;
            }
            const formData = {
                username: t_data[0].username,
                tournament_name: tournament_name,
                nickname : nickname,
            };
            const csrftoken = Cookies.get('csrftoken');
            const response = await fetch(`match/matchapply/${tournament_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const data = await response.json();
                document.getElementById('nickname_input').value = '';
                location.href = `/#tournament/${tournament_name}`;
            } else {
                const error = await response.json();
                console.log(error);
            }
        } catch (error) {
            alert(error);
        }
    });
}

function equal_arr(arr1, arr2) {
    if (arr1.length != arr2.length)
        return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i])
            return false;
    }
    return true;
}

async function startTournament(tournament_id) {
/*
1. start가 눌렸을 때, 게임을 해야하는 인원이 매칭이 되는지 확인 -> 2명이 아닐경우, 바로 부전승 처리
2. 매칭이 될 경우, 해당 매칭될 인원들에게 게임접속 메세지 전송(팝업 또는 기타 다른 방법)
3. 수락 -> 게임 페이지로 리다이렉션 / 거절 -> 게임 자동 패배 처리
4. 게임의 결과를 받았을 때, 해당 결과를 데이터베이스에서 매칭을 찾아서 정리 및 랜더링
5. 다음 게임을 시작하는 로직
*/

 // 1. 매칭 인원 확인 및 부전승 처리
 const csrftoken = Cookies.get('csrftoken');
 const response = await fetch(`match/t_list/${tournament_id}`, {
     method: 'GET',
     headers: {
         'Content-Type': 'application/json',
         'X-CSRFToken': csrftoken,
     },
     credentials: 'include',
 });

 if (response.ok) {
     const data = await response.json();
     const players = data.participants;
     
     // 만약 참가자가 홀수인 경우, 마지막 참가자를 부전승 처리
     if (players.length % 2 !== 0) {
         const byePlayer = players.pop();
         alert(`${byePlayer.nickname}는 부전승 처리되었습니다.`);
         // 부전승 처리 로직 추가
         await handleByePlayer(byePlayer);
     }

     // 2. 매칭될 인원에게 게임 접속 메시지 전송
     for (let i = 0; i < players.length; i += 2) {
         const player1 = players[i];
         const player2 = players[i + 1];
         await sendGameInvitation(player1, player2);
     }
 } else {
     alert('토너먼트 정보를 불러오는 데 실패했습니다.');
 }
}

// 부전승 처리 함수
async function handleByePlayer(player) {
 // 부전승 처리에 대한 추가 로직 구현
 console.log(`${player.nickname}는 부전승 처리되었습니다.`);
}

// 게임 초대 전송 함수
async function sendGameInvitation(player1, player2) {
 const csrftoken = Cookies.get('csrftoken');
 const response = await fetch(`match/invite`, {
     method: 'POST',
     headers: {
         'Content-Type': 'application/json',
         'X-CSRFToken': csrftoken,
     },
     credentials: 'include',
     body: JSON.stringify({ player1: player1.id, player2: player2.id }),
 });

 if (response.ok) {
     alert(`${player1.nickname}와 ${player2.nickname}에게 게임 초대가 전송되었습니다.`);
 } else {
     alert('게임 초대 전송에 실패했습니다.');
 }
}

// 게임 결과 처리 함수
async function handleGameResult(player1, player2, result) {
 const csrftoken = Cookies.get('csrftoken');
 const response = await fetch(`match/result`, {
     method: 'POST',
     headers: {
         'Content-Type': 'application/json',
         'X-CSRFToken': csrftoken,
     },
     credentials: 'include',
     body: JSON.stringify({ player1: player1.id, player2: player2.id, result }),
 });

 if (response.ok) {
     const data = await response.json();
     alert(`${data.winner.nickname}가 승리하였습니다.`);
     // 다음 게임 시작 로직 추가
     await startNextRound();
 } else {
     alert('게임 결과 처리에 실패했습니다.');
 }
}

// 다음 라운드 게임 시작 함수
async function startNextRound() {
 // 다음 라운드 시작에 대한 추가 로직 구현
 console.log('다음 라운드를 시작합니다.');
}




async function updateTournamentInfo(arr) {
    const csrftoken = Cookies.get('csrftoken');
    const response = await fetch('match/list', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        credentials: 'include',
    });

    const player = [];
    let tournament_id;

    if (response.ok) {
        const data = await response.json();
        let operator;
        console.log(data)
        for (let i = 0; i < data.length; ++i) {
            if (equal_arr(arr, data[i].name.split(" "))) {
                tournament_id = data[i].id;
                operator = data[i].operator;
                for (let j = 0; j < data[i].participants.length; ++j) {
                    player.push(data[i].participants[j]);
                }
                break;
            }
        }
        
        const oper_csrftoken = Cookies.get('csrftoken');
        const oper_response = await fetch('user/info', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': oper_csrftoken,
            },
            credentials: 'include',
        }) 
        if (oper_response.ok) {
            const oper_data = await oper_response.json();
            console.log(oper_data[0]);
            if (operator === oper_data[0].user_id) {
                const tournament_start = document.createElement("button");
                tournament_start.textContent = "토너먼트 시작";
                tournament_start.className = "px-5 py-3 rounded-xl text-black bg-teal-800 hover:bg-teal-700";
                tournament_start.addEventListener("click", startTournament(tournament_id));
                document.getElementById("button_container").appendChild(tournament_start);
            }
        } else {
            alert("API error");
            location.href = '/#';
        }
        if (player.length > 4 && player.length <= 8) {
            for (let i = 1; i <= 4; ++i) {
                const quarter_final = document.getElementById(`quarter_final${i}`);
                quarter_final.innerHTML = '';
            }
            for (let i = 1; i <= player.length; ++i) {
                const round_16 = document.getElementById(`Round_16_${i}`);
                round_16.innerHTML = player[i - 1].nickname;
            }

        } else if (player.length > 2 && player.length <= 4) {
            for (let i = 1; i <= 2; ++i) {
                const semi_final = document.getElementById(`semi_final${i}`);
                semi_final.innerHTML = '';
            }
            for (let i = 1; i <= player.length; ++i) {
                const quarter_final = document.getElementById(`quarter_final${i}`);
                quarter_final.innerHTML = player[i - 1].nickname;
            }
        } else {
            for (let i = 1; i <= player.length; ++i) {
                const semi_final = document.getElementById(`semi_final${i}`);
                semi_final.innerHTML = player[i - 1].nickname;
            }
        }
    } else {
        const error = await response.json();
        alert(error);
    }

    return { player, tournament_id };
}