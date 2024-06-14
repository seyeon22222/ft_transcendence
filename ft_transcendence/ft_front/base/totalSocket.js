import { check_language } from '../src/utilities.js'

let user_lang;

function createInvitePopup() {
    const popupContainer = document.getElementById('popupContainer');

    const popupDiv = document.createElement('div');
    popupDiv.id = 'invitePopup';
    popupDiv.style.display = 'none';

    const popupContent = document.createElement('div');
    popupContent.id = 'popupContent';

    const popupMessage = document.createElement('p');
    popupMessage.id = 'popupMessage';

    const acceptBtn = document.createElement('button');
    acceptBtn.id = 'acceptBtn';

    popupContent.appendChild(popupMessage);
    popupContent.appendChild(acceptBtn);
    popupDiv.appendChild(popupContent);
    popupContainer.appendChild(popupDiv);

    return popupDiv;
}

export async function initializeWebsocket() {
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
		user_lang = data[0].language;
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        window.i_socket = new WebSocket(
            protocol + "//" + window.location.host + "/ws/message/" + user_id + "/"
        );

        console.log(window.i_socket);
        window.i_socket.onopen = function() {
            console.log("window.i_socket opened");
        };

        window.i_socket.onclose = function(event) {
            console.log("window.i_socket closed:", event);
        };

        window.i_socket.onmessage = function (e) {
            const data = JSON.parse(e.data);
            console.log("message", data);
			console.log(user_lang);
			const message = `${window.lang[user_lang].message.match_complete} ${data.message}`;
            const player1 = data.player1;
            const player2 = data.player2;
            const g_type = data.g_type;
            const g_id = data.g_id;
            openInvitePopup(message, player1, player2, g_type, g_id, data);
        }
    } else {
        const error = await response.json();
        console.log("처음 접속 시 발생해야하는 에러");
    }
}

export async function check_socket() {
    if (window.i_socket) {
        console.log("close");
        window.i_socket.close();
        window.i_socket = null;
    }
}

function openInvitePopup(message, player1, player2, g_type, g_id, data) {
    const popupMessage = document.getElementById('popupMessage');
    popupMessage.textContent = message;

    const invitePopup = document.getElementById('invitePopup');
    invitePopup.style.display = 'block';

    let remaintimer = 5;
    const intervalId = setInterval(() => {
        const button_text = document.getElementById('acceptBtn');
        if (remaintimer > 0) {
            button_text.textContent = `${window.lang[user_lang].message.accept}(${remaintimer})`;
            remaintimer--;
        } else {
            clearInterval(intervalId); // 타이머 중지
            button_text.textContent = ``;
            if (g_type === 'm')
                m_accept(invitePopup, player1, player2, g_id);
            else if (g_type === 't')
                t_accept(invitePopup, player1, player2, g_id);
            else if (g_type === 'mul') {
                const player3 = data.player3;
                const player4 = data.player4;
                console.log("in socket",player3);
                console.log("in socket",player4);
                mul_accept(invitePopup, player1, player2, player3, player4, g_id);
            }
        }
    }, 1000); // 1초 간격으로 실행

    const acceptBtn = document.getElementById('acceptBtn');
    acceptBtn.onclick = async function(event) {
        event.preventDefault();
        // 수락 로직 구현
        console.log("게임 초대 수락");
        acceptBtn.textContent = ``;
        clearInterval(intervalId); // 수락 시 타이머 중지
        if (g_type === 'm')
            m_accept(invitePopup, player1, player2, g_id);
        else if (g_type === 't')
            t_accept(invitePopup, player1, player2, g_id);
        else if (g_type === 'mul') {
            const player3 = data.player3;
            const player4 = data.player4;
            mul_accept(invitePopup, player1, player2, player3, player4, g_id);
        }
    }
}

async function m_accept(invitePopup, player1, player2, g_id) {
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
        console.log(url);
        window.location.href = `/#gamem/${url}`; // 게임 페이지로 이동
        invitePopup.style.display = 'none';
    } else {
        const error = await response.error();
        console.log(error);
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
        console.log(url);
        window.location.href = `/#gamet/${url}`; // 게임 페이지로 이동
        invitePopup.style.display = 'none';
    } else {
        const error = await response.error();
        console.log(error);
    }
}

async function mul_accept(invitePopup, player1, player2, player3, player4, g_id) {
    console.log("mul", player3);
    console.log("mul", player4);
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
        console.log(url);
        window.location.href = `/#gamemulti/${url}`; // 게임 페이지로 이동
        invitePopup.style.display = 'none';
    } else {
        const error = await response.error();
        console.log(error);
    }
}




createInvitePopup();
check_socket();
initializeWebsocket();
