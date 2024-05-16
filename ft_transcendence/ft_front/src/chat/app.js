export async function chat_js(hash) {
    try {
        document.getElementById("room_name").innerHTML = hash.slice(1);
        
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

        // wss://127.0.0.1:8000/ws/chat/asdf/ - 정확히 잘되는 url
        const chatSocket = new WebSocket('wss://127.0.0.1:8000/ws/chat/asdf/');
        //const chatSocket = new WebSocket(protocol + '//' + window.location.host + '/ws/chat' + hash + '/');
        console.log("chatSocket created!");

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
            }
        };  

        // 
        // const response = await fetch('', {
        // });

        const chatForm = document.getElementById("chat-form");
        chatForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const message = document.getElementById("chat-message-input").value;
            const csrftoken = Cookies.get('csrftoken');
            const formData = new FormData();
            formData.append('message', message);

            const res = await fetch('/need_to/change', {
                methdo: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken,
                },
                body: formData
            });

            if (res.ok) {

            } else {

            }
        })

    } catch (error) {

    }
}