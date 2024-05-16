export async function chat_js(hash) {
    try {
        const room_name = hash.slice(1);
        document.getElementById("room_name").innerHTML = room_name;
        
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const chatSocket = new WebSocket(protocol + '//' + window.location.host + '/ws/chat/' + hash.slice(1) + '/');

        // get current user's name
        let data;
        const csrftoken = Cookies.get('csrftoken');
        const response = await fetch('user/info', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            credentials: 'include',
        });
        if (response.ok) {
            data = await response.json();
        } else {
            const error = await response.json();
            console.error('API 요청 실패', error);
        }

        const user_name = data[0].username;
        
        chatSocket.onopen = function(e) {
            console.log("WebSocket connection opened:", e);
        };

        chatSocket.onclose = function(e) {
            console.log("WebSocket connection closed:", e);
        };

        chatSocket.onerror = function(e) {
            console.error("WebSocket error:", e);
        };

        chatSocket.onmessage = function(e) {
            console.log("Websocket message:", e);

            const data = JSON.parse(e.data);
            if (data.message) {
                const messages_div = document.getElementById("chat-messages");
                messages_div.innerHTML += ('<b>' + data.username + '</b>: ' + data.message + '<br>');
                messages_div.scrollTop = messages_div.scrollHeight;
            } else {
                alert('메시지를 입력하세요');
            }
        };  

        const chatForm = document.getElementById("chat-form");
        chatForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            
            const messageInputDOM = document.getElementById("chat-message-input");
            const message = messageInputDOM.value;

            chatSocket.send(JSON.stringify({
                'message': message,
                'username': user_name,
                'room': room_name
            }));

            messageInputDOM.value = '';
        })
    } catch (error) {
        console.log(error);
    }
}