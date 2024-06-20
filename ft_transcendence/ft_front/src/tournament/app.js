import { check_login, showModal } from "../utilities.js"

export async function tournament_view(hash) {
    const style = document.getElementById("style");
    style.innerHTML = tournament_style();
	setLanguage('tournament');

    if (window.t_socket) {
        window.t_socket.close();
        window.t_socket = null;
    }

    const check = await check_login();
    if (check === false) {
        location.href = `/#`;
        return;
    }

    const tournament_name = hash.slice(1);
    const arr = tournament_name.split(`%20`);
    let cnt = 0;
    let tournament_id;
    arr.forEach(element => {
        cnt++;
        if (cnt == arr.length)
            document.getElementById("tournament_name").innerHTML += element;
        else
            document.getElementById("tournament_name").innerHTML += element + " ";
    });

    const result = await updateTournamentInfo(arr);
    const { player, tournament_id: updatedTournamentId } = result;
    tournament_id = updatedTournamentId;

    window.t_socket = new WebSocket(
        `wss://${window.location.host}/ws/tournament/${tournament_id}/`
    );

    window.t_socket.onopen = function(e) {
        console.log("window.t_socket open");
    }

    window.t_socket.onmessage = async function() {

        const current_hash = window.location.hash;

        if (current_hash !== `#tournament/${tournament_name}`)
            return;
        else
            await updateTournamentInfo(arr);
    };

    window.t_socket.onclose = function(e) {
        console.log('window.t_socket closed');
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
        }
    } catch (error) {
        
    }
    const tournament_start = document.getElementById("tournament_start");
    if (tournament_start !== null)
        tournament_start.addEventListener("click", (event) => startTournamentListener(event, tournament_id));

    const apply_button = document.getElementById('tournament_button');
    tournament_apply(apply_button, tournament_id, player, tournament_name, t_data);
}

function tournament_apply(apply_button, tournament_id, player, tournament_name, t_data) {
    apply_button.addEventListener("click", async (event) => {
        event.preventDefault();
        const nicknameInput = document.getElementById('nickname_input');
        const nickname = nicknameInput.value;

        if (nickname.length === 0) {
			showModal('tournament', 'nick_noti');
            nicknameInput.value = '';
            return;
        }

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

            if (game_data.is_active === false || game_data.is_flag === false) {
				showModal('tournament', 'already_noti');
                return ;
            }
        }

        try {
            if (player.length >= 8) {
				showModal('tournament', 'over_noti');
                return;
            }
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
                const modal = document.querySelector('.modal');
				document.getElementById('nickname_input').value = '';
				if (data.message !== null)
					showModal('tournament', 'ready_noti');
				modal.addEventListener('hidden.bs.modal', function () {
					location.href = `/#tournament/${tournament_name}`;
				});
            } else {
				showModal('tournament', 'dupready_noti');
            }
        } catch (error) {
            
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
        if (data.is_active === false || data.is_flag === false) {
            showModal('tournament', 'already_noti');
            return;
        }
        const players = data.participants;
        
        if (players.length < 2) {
            showModal('tournament', 'under_noti');
            return;
        }
        await fetch(`match/t_list/${tournament_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body : JSON.stringify({is_active : true, is_flag : false})
        });

        const result = await handleByePlayer(players);

        for (let i = 0; i < result; i += 2) {
            const player1 = players[i];
            const player2 = players[i + 1];

            await createTournamentMatch(tournament_id, player1, player2);
            await sendGameInvitation(tournament_id, player1, player2);
        }
    } else {
		showModal('tournament', 'loading_err');
    }
}

async function handleByePlayer(players) {
    let level;
    let nickname;
    let nickname2;
    let index;
    let index2;
    let user_id = players[players.length - 1].player;
    let user_id2;
    let tournament_id = players[players.length - 1].tournament;
    let change_two_flag = false;
    if (players.length === 3) {
        const semi_final = document.getElementById("semi_final2");
        semi_final.innerHTML = players[players.length - 1].nickname;
        level = 2;
        nickname = players[players.length - 1].nickname;
        index = players[players.length - 1].index;
        change_two_flag = false;
    } else if (players.length === 5) {
        const quarter_final = document.getElementById("quarter_final3");
        quarter_final.innerHTML = players[players.length - 1].nickname;
        const semi_final = document.getElementById("semi_final2");
        semi_final.innerHTML = players[players.length - 1].nickname;
        level = 2;
        nickname = players[players.length - 1].nickname;
        index = players[players.length - 1].index;
        change_two_flag = false;
    } else if (players.length === 6) {
        const quarter_final3 = document.getElementById("quarter_final3");
        const quarter_final4 = document.getElementById("quarter_final4");
        quarter_final3.innerHTML = players[players.length - 2].nickname;
        quarter_final4.innerHTML = players[players.length - 1].nickname;
        level = 3;
        nickname = players[players.length - 1].nickname;
        nickname2 = players[players.length - 2].nickname;
        index = players[players.length - 1].index;
        index2 = players[players.length - 2].index;
        user_id2 = players[players.length - 2].player;
        change_two_flag = true;
    } else if (players.length === 7) {
        const quarter_final4 = document.getElementById("quarter_final4");
        quarter_final4.innerHTML = players[players.length - 1].nickname;
        level = 3;
        nickname = players[players.length - 1].nickname;
        index = players[players.length - 1].index;
        change_two_flag = false;
    } else {
        return players.length;
    }

    let formData = {
        user_id: user_id,
        nickname: nickname,
        index: index,
        level: level
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

    if (change_two_flag) {
        formData = {
            user_id: user_id2,
            nickname: nickname2,
            index: index2,
            level: level
        };
        const response2 = await fetch(`match/matchapply/${tournament_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(formData),
        });
        return 4;
    }

    return players.length - 1;
}

async function sendGameInvitation(tournament_id, player1, player2) {
    const csrftoken = Cookies.get('csrftoken');
    const response = await fetch(`match/invite_t/${tournament_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        credentials: 'include',
        body: JSON.stringify({ player1: player1.player, player2: player2.player, id: tournament_id }),
    });
    if (response.ok) {
        console.log(`${player1.nickname}와 ${player2.nickname}에게 게임 초대가 전송되었습니다.`);
    }
}

async function createTournamentMatch(tournament_id, player1, player2) {
    const csrftoken = Cookies.get('csrftoken');
    const t_response = await fetch(`match/t_request`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body : JSON.stringify({tournament_id : tournament_id, apply_user : player1.player, accept_user : player2.player})
    });

    if (t_response.ok) {
        const t_data = await t_response.json();
    } else {
        console.error('토너먼트 매치 생성 실패' + t_response.status);
    }    
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
        player = player.sort((a, b) => a.id - b.id);

        const oper_csrftoken = Cookies.get('csrftoken');
        const oper_response = await fetch('user/info', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': oper_csrftoken,
            },
            credentials: 'include',
        });

        if (oper_response.ok) {
            const oper_data = await oper_response.json();

            if (operator !== oper_data[0].user_id) {
                const tournament_start = document.getElementById("button_container");
                tournament_start.innerHTML = '';
            }
        } else
            location.href = '/#';

        tour_view(player);
        
        if (player_check(player) === false)
            tourstart_view(player);
    }
    return { player, tournament_id };
}

function startTournamentListener(event, tournament_id) {
    event.preventDefault();
    startTournament(tournament_id);
}


function player_check(player) {
    for (let i = 0; i < player.length; ++i) {
        if (player[i].level !== 0)
            return false;
    }
    return true;
}

function tour_view(player) {

    const final = document.getElementById(`final`);
    final.innerHTML = '';
    for (let i = 1; i <= 2; ++i) {
        const semi_final = document.getElementById(`semi_final${i}`);
        semi_final.innerHTML = '';
    }
    for (let i = 1; i <= 4; ++i) {
        const quarter_final = document.getElementById(`quarter_final${i}`);
        quarter_final.innerHTML = '';
    }
    for (let i = 1; i <= 8; ++i) {
        const round_16 = document.getElementById(`Round_8_${i}`);
        round_16.innerHTML = '';
    }

    if (player.length > 4 && player.length <= 8) {
        for (let i = 1; i <= player.length; ++i) {
            const round_16 = document.getElementById(`Round_8_${i}`);
            round_16.innerHTML = player[i - 1].nickname;
        }
    } else if (player.length > 2 && player.length <= 4) {
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
    
    for (let i = 1; i <= player.length; ++i) {
        if (player[i - 1].level === 1) {
            const final_html = document.getElementById(`final`);
            final_html.innerHTML = player[i - 1].nickname;

            if (player.length > 2) {
                if (player.length > 4) {
                    const semifinal_html = document.getElementById(`semi_final${Math.ceil(i / 4)}`);
                    semifinal_html.innerHTML = player[i - 1].nickname;
                } else {
                    const semifinal_html = document.getElementById(`semi_final${Math.ceil(i / 2)}`);
                    semifinal_html.innerHTML = player[i - 1].nickname;
                }
            }

            if (player.length > 4) {
                if (player.length === 6) {
                    if (i <= 4) {
                        const quarterfinal_html = document.getElementById(`quarter_final${Math.ceil(i / 2)}`);
                        quarterfinal_html.innerHTML = player[i - 1].nickname;
                    } else if (i === 5) {
                        const semifinal_html = document.getElementById(`quarter_final3`);
                        semifinal_html.innerHTML = player[i - 1].nickname;
                    } else {
                        const semifinal_html = document.getElementById(`quarter_final4`);
                        semifinal_html.innerHTML = player[i - 1].nickname;
                    }
                } else {
                    const quarterfinal_html = document.getElementById(`quarter_final${Math.ceil(i / 2)}`);
                    quarterfinal_html.innerHTML = player[i - 1].nickname;
                }
            }
        } else if (player[i - 1].level === 2) {
            if (player.length > 2) {
                if (player.length > 4) {
                    const semifinal_html = document.getElementById(`semi_final${Math.ceil(i / 4)}`);
                    semifinal_html.innerHTML = player[i - 1].nickname;
                } else {
                    const semifinal_html = document.getElementById(`semi_final${Math.ceil(i / 2)}`);
                    semifinal_html.innerHTML = player[i - 1].nickname;
                }
            }
            
            if (player.length > 4) {
                if (player.length === 6) {
                    if (i <= 4) {
                        const quarterfinal_html = document.getElementById(`quarter_final${Math.ceil(i / 2)}`);
                        quarterfinal_html.innerHTML = player[i - 1].nickname;
                    } else if (i === 5) { 
                        const semifinal_html = document.getElementById(`quarter_final3`);
                        semifinal_html.innerHTML = player[i - 1].nickname;
                    } else {
                        const semifinal_html = document.getElementById(`quarter_final4`);
                        semifinal_html.innerHTML = player[i - 1].nickname;
                    }
                } else { 
                    const quarterfinal_html = document.getElementById(`quarter_final${Math.ceil(i / 2)}`);
                    quarterfinal_html.innerHTML = player[i - 1].nickname;
                }
            }
        } else if (player[i - 1].level === 3) {
            if (player.length > 4) {
                if (player.length === 6) {
                    if (i <= 4) {
                        const quarterfinal_html = document.getElementById(`quarter_final${Math.ceil(i / 2)}`);
                        quarterfinal_html.innerHTML = player[i - 1].nickname;
                    } else if (i === 5) {
                        const semifinal_html = document.getElementById(`quarter_final3`);
                        semifinal_html.innerHTML = player[i - 1].nickname;
                    } else { 
                        const semifinal_html = document.getElementById(`quarter_final4`);
                        semifinal_html.innerHTML = player[i - 1].nickname;
                    }
                } else {
                    const quarterfinal_html = document.getElementById(`quarter_final${Math.ceil(i / 2)}`); 
                    quarterfinal_html.innerHTML = player[i - 1].nickname;
                }
            }
        }
    }
}

function tournament_style() {
    return `
    body {
		background-color: #333; /* Dark gray background */
		color: white;
		font-family: 'Noto Sans KR', sans-serif;
	}
	h1 {
		font-size: 3rem; /* Larger font size for the title */
		font-weight: 700; /* Thicker font weight for the title */
        text-align: center;
        padding: 40px 0; /* Add padding above and below the title */
	}
    button {
        background-color: #ffc107;
		color: black;
        padding: 10px 20px;
        border-radius: 5px;
        width: 200px; /* Fixed width for buttons */
        height: 50px; /* Fixed height for buttons */
        text-align: center;
    }
    .theme {
        height: 100%;
        width: 100%;
        position: relative;
    }
    .bracket {
        padding: 40px;
        margin: 5px;
    }
    .bracket {
        display: flex;
        flex-direction: row;
        position: relative;
    }
    .column {
        display: flex;
        flex-direction: column;
        min-height: 100%;
        justify-content: space-around;
        align-content: center;
    }
    .match {
        position: relative;
        display: flex;
        flex-direction: column;
        min-width: 240px;
        max-width: 240px;
        height: 62px;
        margin: 12px 24px 12px 0;
    }
    .match .match-top {
        border-radius: 2px 2px 0 0;
    }
    .match .match-bottom {
        border-radius: 0 0 2px 2px;
    }
    .match .team {
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        border: 1px solid black;
        position: relative;
    }
    .match .team span {
        padding-left: 8px;
    }
    .match .team span:last-child {
        padding-right: 8px;
    }
    .match .team .score {
        margin-left: auto;
    }
    .match .team:first-child {
        margin-bottom: -1px;
    }
    .match-lines {
        display: block;
        position: absolute;
        top: 50%;
        bottom: 0;
        margin-top: 0px;
        right: -1px;
    }
    .match-lines .line {
        background: red;
        position: absolute;
    }
    .match-lines .line.one {
        height: 1px;
        width: 12px;
    }
    .match-lines .line.two {
        height: 44px;
        width: 1px;
        left: 11px;
    }
    .match-lines .line.three {
        height: 1px;
        width: 24px;
    }
    .match-lines.alt {
        left: -12px;
    }
    .match:nth-child(even) .match-lines .line.two {
        transform: translate(0, -100%);
    }
    .column:first-child .match-lines.alt {
        display: none;
    }
    .column:last-child .match-lines {
        display: none;
    }
    .column:last-child .match-lines.alt {
        display: block;
    }
    .column:nth-child(2) .match-lines .line.two {
        height: 88px;
    }
    .column:nth-child(3) .match-lines .line.two {
        height: 175px;
    }
    .column:nth-child(4) .match-lines .line.two {
        height: 262px;
    }
    .column:nth-child(5) .match-lines .line.two {
        height: 349px;
    }

    .disable-image .image,
    .disable-name .name,
    .disable-score .score {
        display: none !important;
    }
    .disable-borders {
        border-width: 0px !important;
    }
    .disable-borders .team {
        border-width: 0px !important;
    }
    .disable-seperator .match-top {
        border-bottom: 0px !important;
    }
    .disable-seperator .match-bottom {
        border-top: 0px !important;
    }
    .disable-seperator .team:first-child {
        margin-bottom: 0px;
    }
    .theme-dark {
        border-color: #040607;
    }
    .theme-dark .match-lines .line {
        background: #36404e;
    }
    .theme-dark .team {
        background: #232c36;
    color: #e3e8ef;
        border-color: #36404e;
    }
    .theme-dark .score {
        color: #03d9ce;
    }
    .theme-dark .match .score {
        font-size: 14px;
    }
    `;
}
