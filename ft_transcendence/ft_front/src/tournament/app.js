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
                location.href = `/tournament/${tournament_name}`;
                // console.log(data);
            } else {
                const error = await response.json();
                // console.log(error);
            }
        } catch (error) {
            console.log(error);
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
    let tournament_id; // tournament_id 선언

    if (response.ok) {
        const data = await response.json();
        console.log(data)
        for (let i = 0; i < data.length; ++i) {
            if (equal_arr(arr, data[i].name.split(" "))) {
                tournament_id = data[i].id;
                for (let j = 0; j < data[i].participants.length; ++j) {
                    player.push(data[i].participants[j]);
                }
                break;
            }
        }
        console.log(player);
        if (player.length > 4 && player.length <= 8) {
            for (let i = 1; i <= player.length; ++i) {
                const round_16 = document.getElementById(`Round_16_${i}`);
                // 추가적인 로직 필요
            }

        } else if (player.length > 2 && player.length <= 4) {
            for (let i = 1; i <= player.length; ++i) {
                const quarter_final = document.getElementById(`quarter_final_${i}`);
                // 추가적인 로직 필요
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
