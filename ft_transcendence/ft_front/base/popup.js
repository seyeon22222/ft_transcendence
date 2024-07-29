import { delete_back_show } from '../src/utilities.js'
import { dictionary } from '../src/language/dictionary.js';

export async function setWebsocket() {
    const csrftoken = Cookies.get('csrftoken');
    const response = await fetch(`user/info`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        credentials: 'include',
    });

    if (response.ok) {
        const data = await response.json();
        const user_id = data[0].user_id;
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        window.i_socket = new WebSocket(
            protocol + "//" + window.location.host + "/ws/message/" + user_id + "/"
        );

        window.i_socket.onmessage = function (e) {
            const data = JSON.parse(e.data);
            const player1 = data.player1;
            const player2 = data.player2;
            const g_type = data.g_type;
            const g_id = data.g_id;
            InvitePopup(data.message, player1, player2, g_type, g_id, data);
        }
    } else if (response.status === 301) {
        // console.log("Initial Error : 처음 접속 시 발생 에러");
    }
}

export async function check_socket() {
    if (window.i_socket) {
        window.i_socket.close();
        window.i_socket = null;
    }   
}

function InvitePopup(message, player1, player2, g_type, g_id, data) {
    const popupMessage = document.getElementById('popupMessage');
    
    const invitePopup = document.getElementById('invitePopup');
    invitePopup.style.display = 'block';
    
    let remaintimer = 5;
    const intervalId = setInterval(async () => {
        const button_text = document.getElementById('acceptBtn');
        button_text.style.display = 'block';
		const user_lang = document.getElementById('languageSelector').value;
        const csrftoken = Cookies.get('csrftoken');
        if (remaintimer > 0) {
            popupMessage.textContent = `${dictionary[user_lang].message.match_complete} ${message}`;
            button_text.textContent = `${dictionary[user_lang].message.accept}(${remaintimer})`;
            remaintimer--;
            const response = await fetch("user/check_login", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken,
                },
            })
            if (response.status !== 200) {
                clearInterval(intervalId);
                popupMessage.textContent = '';
                button_text.textContent = '';
                button_text.style.display = 'none';
                return ;
            }
        } else {
            clearInterval(intervalId);
            button_text.textContent = '';
            if (g_type === 'm')
                m_accept(invitePopup, g_id);
            else if (g_type === 't')
                t_accept(invitePopup, player1, player2, g_id);
            else if (g_type === 'mul') {
                const player3 = data.player3;
                const player4 = data.player4;
                mul_accept(invitePopup, player1, player2, player3, player4, g_id);
            }
        }
    }, 1000);
}

async function m_accept(invitePopup, g_id) {
    let url;
    const csrftoken = Cookies.get('csrftoken');
    const response = await fetch(`match/matchgethash/${g_id}`,  {
        method : 'GET',
        headers : {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        credentials : "include",
    })
    if (response.ok) {
        const data = await response.json();
        url = data.hash;
        delete_back_show();
        window.location.href = `/#gamem/${url}`;
        invitePopup.style.display = 'none';
    } else {
        const error = await response.error();
        console.error(error);
    }
}

async function t_accept(invitePopup, player1, player2, g_id) {
    let url;
    const csrftoken = Cookies.get('csrftoken');
    const response = await fetch(`match/tournamenthash/${player1}${player2}${g_id}`,  {
        method : 'GET',
        headers : {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        credentials : "include",
    })
    if (response.ok) {
        const data = await response.json();
        url = data.hash;
        delete_back_show();
        window.location.href = `/#gamet/${url}`;
        invitePopup.style.display = 'none';
    } else {
        const error = await response.error();
        console.error(error);
    }
}

async function mul_accept(invitePopup, player1, player2, player3, player4, g_id) {
    let url;
    const csrftoken = Cookies.get('csrftoken');
    const response = await fetch(`match/multimatchhash/${player1}${player2}${player3}${player4}${g_id}`,  {
        method : 'GET',
        headers : {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        credentials : "include",
    })
    if (response.ok) {
        const data = await response.json();
        url = data.hash;
        delete_back_show();
        window.location.href = `/#gamemulti/${url}`;
        invitePopup.style.display = 'none';
    } else {
        const error = await response.error();
        console.error(error);
    }
}