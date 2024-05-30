import { formatDateTime } from "../info/info_func.js";
import { check_login } from "../utilities.js"

let socket;

export async function tournament_view(hash) {
    if (socket) {
        socket.close();
        socket = null;
    }

    // check login status
    const check = await check_login();
    if (check === false) {
        location.href = `/#`;
        return;
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
        // console.log("socket open");
    }
    socket.onmessage = async function(e) {
        const data = JSON.parse(e.data);
        // console.log(data.message);

        // 필요한 DOM 업데이트 로직
        const result = await updateTournamentInfo(arr);
        const { player, tournament_id } = result;
        
    };
    console.log(player);
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
        const game_csrftoken = Cookies.get('csrftoken');
        const game_check = await fetch(`match/t_list/${tournament_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': game_csrftoken,
            },
            credentials: 'include',
        });
        if (game_check.ok) {
            const game_data = await game_check.json();
            if (game_data.is_active === false) {
                alert('해당 토너먼트는 이미 시작되었습니다.');
                return ;
            }
        }
        const nickname = document.getElementById('nickname_input').value;
        try {
            if (player.length >= 8) {
                alert("최대 인원(8명)을 초과했습니다.");
                return;
            }
            console.log("asd",t_data[0]);
            const formData = {
                user_id: t_data[0].user_id,
                tournament_name: tournament_name,
                nickname : nickname,
                index : player.length + 1,
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
 await fetch(`match/t_list/${tournament_id}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
    },
    body : JSON.stringify({is_active : false})
});
 if (response.ok) {
     const data = await response.json();
     const players = data.participants;
     
     // 만약 참가자가 홀수인 경우, 마지막 참가자를 부전승 처리
     if (players.length % 2 !== 0) {
        const byePlayer = players[players.length - 1];
         await handleByePlayer(byePlayer, players);
     }

     // 2. 매칭될 인원에게 게임 접속 메시지 전송
    //  for (let i = 0; i < players.length; i += 2) {
    //      const player1 = players[i];
    //      const player2 = players[i + 1];
    //      await sendGameInvitation(player1, player2);
    //  }
 } else {
     alert('토너먼트 정보를 불러오는 데 실패했습니다.');
 }
}

// 부전승 처리 함수
async function handleByePlayer(player, players) {
    console.log(player);
    let level;
    let nickname;
    let index;
    let user_id = player.player;  // Assuming username is part of the player object
    let tournament_id = player.tournament;
    if (players.length === 3) {
        const semi_final = document.getElementById("semi_final2");
        semi_final.innerHTML = player.nickname;
        level = 2;
        nickname = player.nickname;
        index = player.index;
    } else if (players.length === 5) {
        const quarter_final = document.getElementById("quarter_final3");
        quarter_final.innerHTML = player.nickname;
        level = 4;
        nickname = player.nickname;
        index = player.index;
    } else if (players.length === 7) {
        const quarter_final = document.getElementById("quarter_final5");
        quarter_final.innerHTML = player.nickname;
        level = 4;
        nickname = player.nickname;
        index = player.index;
    }

    const formData = {
        user_id: user_id,
        nickname: nickname,
        index: index,
        level: level
    };
    console.log(formData);
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
        console.log(`${nickname}는 부전승 처리되었습니다.`);
    } else {
        const error = await response.json();
        console.error('부전승 처리 실패:', error);
    }
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

    let player = [];
    let tournament_id;

    if (response.ok) {
        const data = await response.json();
        let operator;
        let flag;
        // console.log(data)
        for (let i = 0; i < data.length; ++i) {
            if (equal_arr(arr, data[i].name.split(" "))) {
                tournament_id = data[i].id;
                operator = data[i].operator;
                flag = data[i].is_active;
                for (let j = 0; j < data[i].participants.length; ++j) {
                    player.push(data[i].participants[j]);
                }
                break;
            }
        }
        
        player = player.sort((a, b) => a.index - b.index);
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
            // console.log("oper",oper_data);
            // if (operator === oper_data[0].user_id && flag == true) {
            if (operator === oper_data[0].user_id) {
                const tournament_start = document.getElementById("tournament_start");
                tournament_start.addEventListener("click", (event) => {
                    event.preventDefault();
                    startTournament(tournament_id);
                });
            } else {
                const tournament_start = document.getElementById("button_container");
                tournament_start.innerHTML = '';
            }
        } else {
            alert("API error");
            location.href = '/#';
        }

        if (player_check(player) === true) {
            tour_view(player);
        } else {
            tourstart_view(player);
        }
    } else {
        const error = await response.json();
        alert(error);
    }

    return { player, tournament_id };
}

function player_check(player) {
    for (let i = 0; i < player.length; ++i) {
        if (player[i].level !== 0)
            return false;
    }
    return true;
}

function tour_view(player) {
    console.log("tour_view", player);
    if (player.length > 4 && player.length <= 8) {
        for (let i = 1; i <= 4; ++i) {
            const quarter_final = document.getElementById(`quarter_final${i}`);
            quarter_final.innerHTML = '';
        }
        for (let i = 1; i <= player.length; ++i) {
            const round_16 = document.getElementById(`Round_8_${i}`);
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
}

function tourstart_view(player) {
    
    tour_view(player);
    
    if (player.length <= 2) {
        player_2(player);
    } else if (player.length <= 4) {
        player_4(player);
    } else if (player.length <= 8) {
        player_8(player);
    }
    
}

function player_2(player) {
    for (let i = 1; i <= player.length; ++i) {
        if (player[i - 1].level === 1) {
            const winner = document.getElementById(`final`);
            winner.innerHTML = player[i - 1].nickname;
        }
    }
}

function player_4(player) {
    for (let i = 1; i <= player.length; ++i) {
        console.log(player.length, player[i - 1]);
        if (player[i - 1].level === 2) {
            let semi_final;
            if (player[i - 1].index <= 2) {
                semi_final = document.getElementById(`semi_final1`);
            } else if (player[i - 1].index <= 4) {
                semi_final = document.getElementById(`semi_final2`);
            }
            semi_final.innerHTML = player[i - 1].nickname;
        } else if (player[i - 1].level === 1) {
            const winner = document.getElementById(`final`);
            winner.innerHTML = player[i - 1].nickname;
        }
    }

    for (let i = 1; i < 3; ++i) {
        let semiFinalElement = document.getElementById(`semi_final${i}`);
        if (semiFinalElement && semiFinalElement.innerHTML === '') {
            let finalElement = document.getElementById('final');
            if (finalElement && finalElement.innerHTML !== '') {
                semiFinalElement.innerHTML = finalElement.innerHTML;
            }
        }
    }
}


function player_8(player) {
    for (let i = 1; i <= player.length; ++i) {
        console.log(player.length, player[i - 1]);
        if (player[i - 1].level === 4) {
            let quarter_final;
            if (player[i - 1].index <= 2) {
                quarter_final = document.getElementById(`quarter_final1`);
            } else if (player[i - 1].index <= 4) {
                quarter_final = document.getElementById(`quarter_final2`);
            } else if (player[i - 1].index <= 6) {
                quarter_final = document.getElementById(`quarter_final3`);
            } else if (player[i - 1].index <= 8) {
                quarter_final = document.getElementById(`quarter_final4`);
            }
            quarter_final.innerHTML = player[i - 1].nickname;
        } else if (player[i - 1].level === 2) {
            let semi_final;
            if (player[i - 1].index <= 4) {
                semi_final = document.getElementById(`semi_final1`);
            } else if (player[i - 1].index <= 8) {
                semi_final = document.getElementById(`semi_final2`);
            }
            semi_final.innerHTML = player[i - 1].nickname;
        } else if (player[i - 1].level === 1) {
            const winner = document.getElementById(`final`);
            winner.innerHTML = player[i - 1].nickname;
        }
    }

    for (let i = 1; i < 3; ++i) {
        let semiFinalElement = document.getElementById(`semi_final${i}`);
        if (semiFinalElement && semiFinalElement.innerHTML === '') {
            let finalElement = document.getElementById('final');
            if (finalElement && finalElement.innerHTML !== '') {
                semiFinalElement.innerHTML = finalElement.innerHTML;
            }
        }
    }
    if (player.length === 5) {
        for (let i = 1; i < 3; ++i) {
            let quarterFinalElement = document.getElementById(`quarter_final${i}`);
            if (quarterFinalElement && quarterFinalElement.innerHTML === '') {
                if (i === 1 || i === 2) {
                    let semiFinalElement = document.getElementById(`semi_final1`);
                    if (semiFinalElement && semiFinalElement.innerHTML !== '') {
                        quarterFinalElement.innerHTML = semiFinalElement.innerHTML;
                    }
                }
            }
        }

        let quarterFinalElement = document.getElementById(`quarter_final3`);
        if (quarterFinalElement && quarterFinalElement.innerHTML === '') {
            let semiFinalElement = document.getElementById(`semi_final2`);
            if (semiFinalElement && semiFinalElement.innerHTML !== '') {
                quarterFinalElement.innerHTML = semiFinalElement.innerHTML;
            }
        }
    } else {
        for (let i = 1; i < 5; ++i) {
            let quarterFinalElement = document.getElementById(`quarter_final${i}`);
            if (quarterFinalElement && quarterFinalElement.innerHTML === '') {
                if (i === 1 || i === 2) {
                    let semiFinalElement = document.getElementById(`semi_final1`);
                    if (semiFinalElement && semiFinalElement.innerHTML !== '') {
                        quarterFinalElement.innerHTML = semiFinalElement.innerHTML;
                    }
                } else if (i === 3 || i === 4) {
                    let semiFinalElement = document.getElementById(`semi_final2`);
                    if (semiFinalElement && semiFinalElement.innerHTML !== '') {
                        quarterFinalElement.innerHTML = semiFinalElement.innerHTML;
                    }
                }
            }
        }
    }
}