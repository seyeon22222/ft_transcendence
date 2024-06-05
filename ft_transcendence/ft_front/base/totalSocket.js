let i_socket;

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
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        i_socket = new WebSocket(
            protocol + "//" + window.location.host + "/ws/message/" + user_id + "/"
        );

        console.log(i_socket);
        i_socket.onopen = function() {
            console.log("i_socket opened");
        };

        i_socket.onclose = function(event) {
            console.log("i_socket closed:", event);
        };

        i_socket.onmessage = function (e) {
            const data = JSON.parse(e.data);
            console.log("message", data);
            const message = data.message;
            const player1 = data.player1;
            const player2 = data.player2;
            openInvitePopup(message, player1, player2);
        }
    } else {
        const error = await response.json();
        console.log("처음 접속 시 발생해야하는 에러");
    }
}

async function check_socket() {
    if (i_socket) {
        i_socket.close();
        i_socket = null;
    }
}

function openInvitePopup(message, player1, player2) {
    const popupMessage = document.getElementById('popupMessage');
    popupMessage.textContent = message;

    const invitePopup = document.getElementById('invitePopup');
    invitePopup.style.display = 'block';

    let remaintimer = 5;
    const intervalId = setInterval(() => {
        if (remaintimer > 0) {
            const button_text = document.getElementById('acceptBtn');
            button_text.textContent = `수락(${remaintimer})`;
            remaintimer--;
        } else {
            accept(invitePopup, player1, player2);
            clearInterval(intervalId); // 타이머 중지
        }
    }, 1000); // 1초 간격으로 실행

    const acceptBtn = document.getElementById('acceptBtn');
    acceptBtn.onclick = async function(event) {
        event.preventDefault();
        // 수락 로직 구현
        console.log("게임 초대 수락");
        accept(invitePopup, player1, player2);
        clearInterval(intervalId); // 수락 시 타이머 중지
    }
}

async function accept(invitePopup, player1, player2) {
    let url;
    const csrftoken = Cookies.get('csrftoken');
    const response = await fetch(`match/tournamenthash/${player1}${player2}`,  {
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
        window.location.href = `/#game/${url}`; // 게임 페이지로 이동
        invitePopup.style.display = 'none';
    } else {
        const error = await response.error();
        console.log(error);
    }
}

const invitePopup = createInvitePopup();
check_socket();
initializeWebsocket();
