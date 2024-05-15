export function renderRooms(rooms) {
  document.title = 'Chatting Room | Ft_Transcendence';
  const content = document.getElementById('content');
  content.innerHTML = '';
  console.log("In renderRooms Func");
  if (rooms.length > 0) {
    const roomListHeading = document.createElement('h1');
    roomListHeading.textContent = 'Room List';
    roomListHeading.classList.add('text-3xl', 'lg:text-6xl', 'text-white');
    content.appendChild(roomListHeading);

    const roomsContainer = document.createElement('div');
    roomsContainer.classList.add('w-full', 'flex', 'flex-wrap', 'items-center');

    rooms.forEach(room => {
      const roomCard = document.createElement('div');
      roomCard.classList.add('w-full', 'lg:w-1/4', 'px-3', 'py-3');

      const cardContent = document.createElement('div');
      cardContent.classList.add('p-4', 'bg-white', 'shadow', 'rounded-xl', 'text-center');

      const roomName = document.createElement('h2');
      roomName.textContent = room.name;
      roomName.classList.add('mb-5', 'text-2xl', 'font-semibold');
      cardContent.appendChild(roomName);

      const joinLink = document.createElement('a');
      joinLink.href = `#/chat/room/${room.slug}`;
      joinLink.textContent = 'Join';
      joinLink.classList.add('px-5', 'py-3', 'block', 'rounded-xl', 'text-white', 'bg-teal-600', 'hover:bg-teal-700');
      cardContent.appendChild(joinLink);

      roomCard.appendChild(cardContent);
      roomsContainer.appendChild(roomCard);
    });

    content.appendChild(roomsContainer);
  }

  const createRoomSection = document.createElement('div');
  createRoomSection.id = 'createRoomSection';

  const createRoomHeading = document.createElement('h2');
  createRoomHeading.textContent = 'Create a new room';
  createRoomHeading.classList.add('text-3xl', 'lg:text-6xl', 'text-white');
  createRoomSection.appendChild(createRoomHeading);

  const createRoomForm = document.createElement('form');
  createRoomForm.method = 'POST';
  createRoomForm.action = '#/chat/room/create';

  const csrfToken = document.createElement('input');
  csrfToken.type = 'hidden';
  csrfToken.name = 'csrfmiddlewaretoken';
  csrfToken.value = getCookie('csrftoken');
  createRoomForm.appendChild(csrfToken);

  const roomNameInput = document.createElement('input');
  roomNameInput.type = 'text';
  roomNameInput.name = 'room_name';
  roomNameInput.placeholder = 'Room Name';
  roomNameInput.required = true;
  createRoomForm.appendChild(roomNameInput);

  const createButton = document.createElement('button');
  createButton.type = 'submit';
  createButton.textContent = 'Create';
  createButton.classList.add('px-5', 'py-3', 'rounded-xl', 'text-white', 'bg-teal-400', 'hover:bg-teal-700');
  createRoomForm.appendChild(createButton);

  createRoomSection.appendChild(createRoomForm);
  content.appendChild(createRoomSection);

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