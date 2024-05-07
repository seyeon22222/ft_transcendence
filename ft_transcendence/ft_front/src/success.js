export function renderSuccess() {
    return `
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Responsive Webpage</title>
          <style>
            /* CSS 스타일 코드 */
          </style>
        </head>
        <body>
          <header>
            <button id="userProfileBtn">user_profile</button>
            <button id="userStatusBtn">user_status</button>
          </header>
          <div id="onlineUserLabel">online_user</div>
          <div id="userListContainer">
            <!-- List of online users -->
            <div>Username 1</div>
            <div>Username 2</div>
            <div>Username 3</div>
          </div>
          <div id="pongGame">
            <div id="gameTitle">PONG GAME</div>
            <div id="gameOptions">
              <button id="withComputerBtn">with_computer</button>
              <button id="withUsersBtn">with_users</button>
            </div>
          </div>
          <div id="liveChatLabel">Live_Chat</div>
          <div id="chatContainer">
            <div style="display: flex; align-items: center; height: 100h;">
              <a href="{% url 'chatting:rooms' %}" class="px-5 py-3 rounded-xl text-white bg-teal-600 hover:bg-teal-700">Join Chatting</a>
            </div>
          </div>
          <script>
            document.addEventListener("DOMContentLoaded", function() {
              var withComputerBtn = document.getElementById("withComputerBtn");
              withComputerBtn.addEventListener("click", function() {
                window.location.href = "{% url 'ft_user:pong_with_computer' %}";
              });
            });
          </script>
        </body>
      </html>
    `;
  }