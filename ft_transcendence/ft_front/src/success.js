export function renderSuccess() {
  const content = document.getElementById('content');
  content.innerHTML = '';

  const successContainer = document.createElement('div');

  // header
  const header = document.createElement('header');
  const userProfileBtn = document.createElement('button');
  userProfileBtn.id = 'userProfileBtn';
  userProfileBtn.textContent = 'user_profile';
  const userStatusBtn = document.createElement('button');
  userStatusBtn.id = 'userStatusBtn';
  userStatusBtn.textContent = 'user_status';
  const logoutLabel = document.createElement('button');
  logoutLabel.id = 'logout';
  logoutLabel.textContent = 'logout';
  header.appendChild(userProfileBtn);
  header.appendChild(document.createElement('br'));
  header.appendChild(userStatusBtn);
  header.appendChild(document.createElement('br'));
  header.appendChild(logoutLabel);
  successContainer.appendChild(header);

  // online user label
  const onlineUserLabel = document.createElement('div');
  onlineUserLabel.id = 'onlineUserLabel';
  onlineUserLabel.textContent = 'online_user';
  successContainer.appendChild(onlineUserLabel);

  // user list container
  const userListContainer = document.createElement('div');
  userListContainer.id = 'userListContainer';
  const username1 = document.createElement('div');
  username1.textContent = 'Username 1';
  const username2 = document.createElement('div');
  username2.textContent = 'Username 2';
  const username3 = document.createElement('div');
  username3.textContent = 'Username 3';
  userListContainer.appendChild(username1);
  userListContainer.appendChild(username2);
  userListContainer.appendChild(username3);
  successContainer.appendChild(userListContainer);

  // pong game
  const pongGame = document.createElement('div');
  pongGame.id = 'pongGame';
  const gameTitle = document.createElement('div');
  gameTitle.id = 'gameTitle';
  gameTitle.textContent = 'PONG GAME';
  const gameOptions = document.createElement('div');
  gameOptions.id = 'gameOptions';
  const withComputerBtn = document.createElement('button');
  withComputerBtn.id = 'withComputerBtn';
  withComputerBtn.textContent = 'with_computer';
  const withUsersBtn = document.createElement('button');
  withUsersBtn.id = 'withUsersBtn';
  withUsersBtn.textContent = 'with_users';
  gameOptions.appendChild(withComputerBtn);
  gameOptions.appendChild(document.createElement('br'));
  gameOptions.appendChild(withUsersBtn);
  pongGame.appendChild(gameTitle);
  pongGame.appendChild(gameOptions);
  successContainer.appendChild(pongGame);

  // live chat label
  const liveChatLabel = document.createElement('div');
  liveChatLabel.id = 'liveChatLabel';
  liveChatLabel.textContent = 'Live_Chat';
  successContainer.appendChild(liveChatLabel);
  successContainer.appendChild(document.createElement('br'));
  successContainer.appendChild(document.createElement('br'));
  successContainer.appendChild(document.createElement('br'));

  // chat container
  const chatContainer = document.createElement('div');
  chatContainer.id = 'chatContainer';
  const chatLink = document.createElement('a');
  chatLink.href = "chat/rooms";
  chatLink.classList.add('px-5', 'py-3', 'rounded-xl', 'text-white', 'bg-teal-300', 'hover:bg-teal-300');
  chatLink.textContent = 'Join Chatting';
  chatContainer.appendChild(chatLink);
  successContainer.appendChild(chatContainer);

  content.appendChild(successContainer);

  // with computer button event listener
  withComputerBtn.addEventListener('click', function() {
    window.location.href = "user/pong";
  });

  userProfileBtn.addEventListener('click', async function() {
    location.hash = 'user/view' ;
  });

  logoutLabel.addEventListener('click', async function() {
    try {
      const csrftoken = getCookie('csrftoken');

      const response = await fetch('/user/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({})
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        location.hash = '/';
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('로그아웃 요청 중 오류 발생:', error);
    }
  });

  return successContainer;
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}