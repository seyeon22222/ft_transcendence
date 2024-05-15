export function renderRoom(room, messages, user) {
  document.title = `${room.name} | Ft_Transcendence`;
  const content = document.getElementById('content');
  content.innerHTML = '';

  const roomHeader = document.createElement('div');
  roomHeader.classList.add('p-10', 'lg:p-20', 'text-center');
  const roomTitle = document.createElement('h1');
  roomTitle.textContent = room.name;
  roomTitle.classList.add('text-3xl', 'lg:text-6xl', 'text-white');
  roomHeader.appendChild(roomTitle);
  content.appendChild(roomHeader);

  const messagesContainer = document.createElement('div');
  messagesContainer.classList.add('lg:w-2/4', 'mx-4', 'lg:mx-auto', 'p-4', 'bg-white', 'rounded-xl');
  const chatMessages = document.createElement('div');
  chatMessages.id = 'chat-messages';
  chatMessages.classList.add('chat-messages', 'space-y-3');
  messages.forEach(m => {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<b>${m.user.username}</b>: ${m.content}<br>`;
    chatMessages.appendChild(messageElement);
  });
  messagesContainer.appendChild(chatMessages);
  content.appendChild(messagesContainer);

  const messageForm = document.createElement('div');
  messageForm.classList.add('lg:w-2/4', 'mt-6', 'mx-4', 'lg:mx-auto', 'p-4', 'bg-white', 'rounded-xl');
  const form = document.createElement('form');
  form.method = 'post';
  form.action = '#';
  form.classList.add('flex');

  const csrfToken = document.createElement('input');
  csrfToken.type = 'hidden';
  csrfToken.name = 'csrfmiddlewaretoken';
  csrfToken.value = getCookie('csrftoken');
  form.appendChild(csrfToken);

  const messageInput = document.createElement('input');
  messageInput.type = 'text';
  messageInput.name = 'content';
  messageInput.placeholder = 'Your message...';
  messageInput.id = 'chat-message-input';
  messageInput.classList.add('flex-1', 'mr-3');
  form.appendChild(messageInput);

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Submit';
  submitButton.id = 'chat-message-submit';
  submitButton.classList.add('px-5', 'py-3', 'rounded-xl', 'text-white', 'bg-teal-600', 'hover:bg-teal-700');
  form.appendChild(submitButton);

  messageForm.appendChild(form);
  content.appendChild(messageForm);

  const roomNameScript = document.createElement('script');
  roomNameScript.textContent = `const roomName = "${room.slug}";`;
  content.appendChild(roomNameScript);

  const userNameScript = document.createElement('script');
  userNameScript.textContent = `const userName = "${user.username}";`;
  content.appendChild(userNameScript);

  const chatSocket = new WebSocket(`ws://${window.location.host}/ws/chat/${room.slug}/`);
  console.log(chatSocket);

  chatSocket.onclose = function(e) {
    console.log('onclose');
  }

  chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    console.log(data);
    if (data.message) {
      const messageElement = document.createElement('div');
      messageElement.innerHTML = `<b>${data.username}</b>: ${data.message}<br>`;
      chatMessages.appendChild(messageElement);
      scrollToBottom();
    } else {
      alert('The message was empty!');
    }
  }

  submitButton.addEventListener('click', () => {
    const message = messageInput.value;
    console.log({ 'message': message, 'username': userName, 'room': roomName });
    chatSocket.send(JSON.stringify({ 'message': message, 'username': userName, 'room': roomName }));
    messageInput.value = '';
  });

  messageInput.focus();

  messageInput.onkeyup = function(e) {
    if (e.keyCode === 13) {
      submitButton.click();
    }
  }

  function scrollToBottom() {
    const objDiv = document.getElementById("chat-messages");
    objDiv.scrollTop = objDiv.scrollHeight;
  }

  scrollToBottom();

  return content;
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