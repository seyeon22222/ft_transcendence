import { tournament_view, after_start_view } from "./view.js";
import { showModal } from "../utilities.js";

export function t_popstate_event() {
    if (window.tournament_socket && window.tournament_socket.readyState !== WebSocket.CLOSED && location.href !== window.tournament_url && window.prevhref !== location.href) {
        window.tournament_socket.close();
        window.tournament_socket = null;
    }
}

export function check_array(array1, array2) {
    if (array1.length != array2.length)
        return false;
    for (let i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i])
            return false;
    }
    return true;
}

async function startgame(game_id) {
    const g_csrftoken = Cookies.get('csrftoken');
    const g_response = await fetch(`match/t_list/${game_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': g_csrftoken,
        },
        credentials: 'include',
    });
    if (g_response.ok) {
        const data = await g_response.json();
        if (data.is_active === false || data.is_flag === false) {
            showModal('tournament', 'already_noti');
            return;
        }
        const g_players = data.participants;
        let g_flag = true;
        const g_name = await fetch("user/info", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": g_csrftoken,
            },
            credentials: "include",
        });
        if (g_name.ok) {
            let data = await g_name.json();
            for (let i = 0; i < g_players.length; ++i) {
                if (g_players[i].player == data[0].user_id)
                    g_flag = false;
            }
        }
        if (g_players.length < 2) {
            showModal('tournament', 'under_noti');
            return;
            }
        if (g_flag) {
            showModal('tournament', 'no_leader');
            return;
        }
        await fetch(`match/t_list/${game_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': g_csrftoken,
            },
            body : JSON.stringify({is_active : true, is_flag : false})
        });

        const result = await handleGamePlayer(g_players);
        for (let i = 0; i < result; i += 2) {
            const g_player1 = g_players[i];
            const g_player2 = g_players[i + 1];

            await createGameMatch(game_id, g_player1, g_player2);
            await sendInvitation(game_id, g_player1, g_player2);
        }
    } else {
		showModal('tournament', 'loading_err');
    }
}

async function handleGamePlayer(g_players) {
    let level;

    let nickname;
    let nickname2;

    let index;
    let index2;

    let user_id = g_players[g_players.length - 1].player;
    let user_id2;

    let game_id = g_players[g_players.length - 1].tournament;

    let change_two_flag = false;

    if (g_players.length === 3) {
        const semi_final = document.getElementById("semi_final2");
        semi_final.innerHTML = g_players[g_players.length - 1].nickname;
        level = 2;
        nickname = g_players[g_players.length - 1].nickname;
        index = g_players[g_players.length - 1].index;
        change_two_flag = false;
    } else if (g_players.length === 5) {
        const quarter_final = document.getElementById("quarter_final3");
        quarter_final.innerHTML = g_players[g_players.length - 1].nickname;
        const semi_final = document.getElementById("semi_final2");
        semi_final.innerHTML = g_players[g_players.length - 1].nickname;
        level = 2;
        nickname = g_players[g_players.length - 1].nickname;
        index = g_players[g_players.length - 1].index;
        change_two_flag = false;
    } else if (g_players.length === 6) {
        const quarter_final3 = document.getElementById("quarter_final3");
        const quarter_final4 = document.getElementById("quarter_final4");
        quarter_final3.innerHTML = g_players[g_players.length - 2].nickname;
        quarter_final4.innerHTML = g_players[g_players.length - 1].nickname;
        level = 3;
        nickname = g_players[g_players.length - 1].nickname;
        nickname2 = g_players[g_players.length - 2].nickname;
        index = g_players[g_players.length - 1].index;
        index2 = g_players[g_players.length - 2].index;
        user_id2 = g_players[g_players.length - 2].player;
        change_two_flag = true;
    } else if (g_players.length === 7) {
        const quarter_final4 = document.getElementById("quarter_final4");
        quarter_final4.innerHTML = g_players[g_players.length - 1].nickname;
        level = 3;
        nickname = g_players[g_players.length - 1].nickname;
        index = g_players[g_players.length - 1].index;
        change_two_flag = false;
    } else {
        return g_players.length;
    }

    let formData = {
        user_id: user_id,
        nickname: nickname,
        index: index,
        level: level
    };
    const csrftoken = Cookies.get('csrftoken');
    const response = await fetch(`match/matchapply/${game_id}`, {
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

        const response2 = await fetch(`match/matchapply/${game_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(formData),
        });
        return 4;
    }

    return g_players.length - 1;
}

async function sendInvitation(game_id, player1, player2) {
    const csrftoken = Cookies.get('csrftoken');
    const response = await fetch(`match/invite_t/${game_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        credentials: 'include',
        body: JSON.stringify({ player1: player1.player, player2: player2.player, id: game_id }),
    });
}

async function createGameMatch(game_id, player1, player2) {
    const csrftoken = Cookies.get('csrftoken');
    const response = await fetch(`match/t_request`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body : JSON.stringify({tournament_id : game_id, apply_user : player1.player, accept_user : player2.player})
    });
}

export function startTournament(event, tournament_id) {
    event.preventDefault();
    startgame(tournament_id);
}

export function player_check(player) {
    for (let i = 0; i < player.length; ++i) {
        if (player[i].level !== 0)
            return false;
    }
    return true;
}

export async function updateGameInfo(array) {
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
    let game_id;

    if (response.ok) {
        const data = await response.json();
        let operator;
        let flag;
        for (let i = 0; i < data.length; ++i) {
            if (check_array(array, data[i].name.split(" "))) {
                game_id = data[i].id;
                operator = data[i].operator;
                flag = data[i].is_active;
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
                const start_btn = document.getElementById("button_container");
                start_btn.innerHTML = '';
            }
        } else {
            location.href = '/#';
        }

        tournament_view(player);
        if (player_check(player) === false) {
            after_start_view(player);
        }
    } else {
        const error = await response.json();
        console.error(error);
    }

    return { player, game_id };
}

export async function get_user_data() {
    try {
        const csrftoken = Cookies.get('csrftoken');
        const user_response = await fetch('user/info', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            credentials: 'include',
        });
        if (user_response.ok) {
            const data = await user_response.json();
            return data;
        } else {
            const error = await user_response.json();
            console.error('API 요청 실패', error);
        }
    } catch (error) {
        console.error(error);
    }   
}

export async function apply_btn_evnet_handler(game_apply, user_data, game_id, player, game_name) {
    game_apply.addEventListener("click", async (event) => {
        event.preventDefault();
        const input = document.getElementById('nickname_input');
        const player_name = input.value;

        if (player_name.length === 0) {
			showModal('tournament', 'nick_noti');
            input.value = '';
            return;
        }
        const game_csrftoken = Cookies.get('csrftoken');
        const game_check = await fetch(`match/t_list/${game_id}`, {
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
                user_id: user_data[0].user_id,
                tournament_name: game_name,
                nickname : player_name,
                index : player.length + 1,
            };
            const csrftoken = Cookies.get('csrftoken');
            const response = await fetch(`match/matchapply/${game_id}`, {
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
					location.href = `/#tournament/${game_name}`;
				});
            } else {
                const error = await response.json();
				showModal('tournament', 'dupready_noti');
            }
        } catch (error) {
            console.error(error);
        }
    });
}