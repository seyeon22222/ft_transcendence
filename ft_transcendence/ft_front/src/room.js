export function renderRoom(room, messages, user) {
    document.title = `${room.name} | Ft_Transcendence`;
    return `
      <div class="p-10 lg:p-20 text-center">
        <h1 class="text-3xl lg:text-6xl text-white">${room.name}</h1>
      </div>
      <div class="lg:w-2/4 mx-4 lg:mx-auto p-4 bg-white rounded-xl">
        <div class="chat-messages space-y-3" id="chat-messages">
          ${messages.map(m => `<b>${m.user.username}</b>: ${m.content}<br>`).join('')}
        </div>
      </div>
      <div class="lg:w-2/4 mt-6 mx-4 lg:mx-auto p-4 bg-white rounded-xl">
        <form method="post" action="." class="flex">
          {% csrf_token %}
          <input type="text" name="content" class="flex-1 mr-3" placeholder="Your message..." id="chat-message-input">
          <button class="px-5 py-3 rounded-xl text-white bg-teal-600 hover:bg-teal-700" id="chat-message-submit">Submit</button>
        </form>
      </div>
      {{ room.slug|json_script:"json-roomname" }}
      {{ request.user.username|json_script:"json-username" }}
      <script>
        const roomName = JSON.parse(document.getElementById('json-roomname').textContent);
        const userName = JSON.parse(document.getElementById('json-username').textContent);
        console.log(roomName);
        console.log(userName);
        const chatSocket = new WebSocket('ws://' + window.location.host + '/ws/chat/' + roomName + '/');
        console.log(chatSocket);
        chatSocket.onclose = function(e) {
          console.log('onclose');
        }
        chatSocket.onmessage = function(e) {
          const data = JSON.parse(e.data);
          console.log(data);
          if (data.message) {
            document.querySelector('#chat-messages').innerHTML += ('<b>' + data.username + '</b>: ' + data.message + '<br>');
            scrollToBottom();
          } else {
            alert('The message was empty!');
          }
        };
        document.querySelector('#chat-message-submit').addEventListener('click', () => {
          const messageInputDom = document.querySelector('#chat-message-input');
          const message = messageInputDom.value;
          console.log({ 'message': message, 'username': userName, 'room': roomName });
          chatSocket.send(JSON.stringify({ 'message': message, 'username': userName, 'room': roomName }));
          messageInputDom.value = '';
        });
        document.querySelector('#chat-message-input').focus();
        document.querySelector('#chat-message-input').onkeyup = function(e) {
          if (e.keyCode === 13) {
            document.querySelector('#chat-message-submit').addEventListener('click', () => {
              const messageInputDom = document.querySelector('#chat-message-input');
              const message = messageInputDom.value;
              console.log({ 'message': message, 'username': userName, 'room': roomName });
              chatSocket.send(JSON.stringify({ 'message': message, 'username': userName, 'room': roomName }));
              messageInputDom.value = '';
            });
          }
        };
        function scrollToBottom() {
          let objDiv = document.getElementById("chat-messages");
          objDiv.scrollTop = objDiv.scrollHeight;
        }
        scrollToBottom();
      </script>
    `;
  }