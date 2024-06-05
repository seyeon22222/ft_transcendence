let socket;

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
    acceptBtn.textContent = '수락';
  
    const declineBtn = document.createElement('button');
    declineBtn.id = 'declineBtn';
    declineBtn.textContent = '거절';
  
    popupContent.appendChild(popupMessage);
    popupContent.appendChild(acceptBtn);
    popupContent.appendChild(declineBtn);
    popupDiv.appendChild(popupContent);
    popupContainer.appendChild(popupDiv);
  
    return popupDiv;
}

async function initializeWebsocket() {
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
        socket = new WebSocket(
            protocol + "//" + window.location.host + "/ws/message/" + user_id + "/"
        );

        console.log(socket);
        socket.onopen = function() {
            console.log("socket opened");
        };

        socket.onclose = function(event) {
            console.log("socket closed:", event);
        };

        socket.onmessage = function (e) {
            const data = JSON.parse(e.data);
            console.log("message", data);
            const message = data.message;
            openInvitePopup(message);
        }
    } else {
        const error = await response.json();
        console.log("처음 접속 시 발생해야하는 에러");
    }
}

async function check_socket() {
    if (socket) {
        socket.close();
        socket = null;
    }
}

function openInvitePopup(message) {
    const popupMessage = document.getElementById('popupMessage');
    popupMessage.textContent = message;
  
    const invitePopup = document.getElementById('invitePopup');
    invitePopup.style.display = 'block';
  
    const acceptBtn = document.getElementById('acceptBtn');
    const declineBtn = document.getElementById('declineBtn');
  
    acceptBtn.onclick = function() {
      // 수락 로직 구현
      console.log("게임 초대 수락");
      window.location.href = '/#'; // 게임 페이지로 이동
      invitePopup.style.display = 'none';
    }
  
    declineBtn.onclick = function() {
      // 거절 로직 구현
      console.log("게임 초대 거절");
      // 거절 처리를 위한 추가 로직 구현 (예: 서버에 거절 메시지 전송 등)
      invitePopup.style.display = 'none';
    }
}

const invitePopup = createInvitePopup();
check_socket();
initializeWebsocket();