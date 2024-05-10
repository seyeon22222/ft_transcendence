import { renderLogin } from '../src/login.js';
import { renderPong } from '../src/pong.js';
import { renderSignupView } from '../src/signupview.js';
import { renderSuccess } from '../src/success.js';
import { renderRoom } from '../src/room.js';
import { renderRooms } from '../src/rooms.js';

const routes = {
  '/user/login_suc/': renderSuccess,
  '/user/sign_up_view/': renderSignupView,
  '/chat/room/': renderRoom,
  '/chat/rooms/': renderRooms,
  '/user/pong/' : renderPong,
  '/': renderLogin,
};

const getHash = () =>
  location.hash.slice(1).toLocaleLowerCase().split("/")[1] || "/";

function resolveRoutes(user_location) {
  let render;
  let catch_path;

  if (getHash() != "/") {
      catch_path = `/${user_location[0]}/:id`;
  } else {
      catch_path = `/${user_location[0]}`;
  }

  if (routes[catch_path] && user_location.length >= 1 && user_location.length <= 2) {
      render = routes[`/${user_location[0]}`];
  } else {
      render = routes["/404"];
  }

  return render;
};

const router = async () => {
  const content = document.getElementById("content");
  const user_location = location.hash.slice(1).toLocaleLowerCase().split("/");
  let render;
  let path;
  if (user_location.length === 0 || user_location[0] === "") {
    path = '/';
  } else {
    let temp_path;
    path = "/";
    for (temp_path of user_location) {
        path += temp_path + "/";
    }
  }
  render = routes[path] || renderNotFound;
  const renderedContent = await render();
  requestAnimationFrame(() => {
    content.innerHTML = '';
    content.appendChild(renderedContent);
  });
};

export default router;

function renderNotFound() {
  const content = document.getElementById("content");
  content.innerHTML = '<h1>404 Not Found</h1>';
}


// const contentDiv = document.getElementById('content');

// function router() {
//   const path = window.location.pathname;
//   const handler = routes[path] || renderNotFound;

//   if (path === '/chatting/room/') {
//     // 실제 room 데이터와 messages, user 데이터를 가져와서 인자로 전달해야 함
//     const roomData = fetchRoomData(); // 서버에서 room 데이터를 가져오는 함수
//     const messagesData = fetchMessages(); // 서버에서 messages 데이터를 가져오는 함수
//     const userData = fetchUserData(); // 서버에서 user 데이터를 가져오는 함수

//     contentDiv.innerHTML = handler(roomData, messagesData, userData);
//   } else if (path === '/chatting/rooms/') {
//     // 실제 rooms 데이터를 가져와서 인자로 전달해야 함
//     const roomsData = fetchRoomsData(); // 서버에서 rooms 데이터를 가져오는 함수

//     contentDiv.innerHTML = handler(roomsData);
//   } else {
//     contentDiv.innerHTML = handler();
//   }
// }

function fetchRoomData() {
  // 실제 서버에서 room 데이터를 가져오는 로직을 구현해야 함
  // 예시 데이터
  const roomData = {
    name: 'Room 1',
    slug: 'room-1',
  };
  return roomData;
}

function fetchMessages() {
  // 실제 서버에서 messages 데이터를 가져오는 로직을 구현해야 함
  // 예시 데이터
  const messagesData = [
    { user: { username: 'User 1' }, content: 'Hello, world!' },
    { user: { username: 'User 2' }, content: 'Hi there!' },
  ];
  return messagesData;
}

function fetchUserData() {
  // 실제 서버에서 user 데이터를 가져오는 로직을 구현해야 함
  // 예시 데이터
  const userData = { username: 'CurrentUser' };
  return userData;
}

function fetchRoomsData() {
  // 실제 서버에서 rooms 데이터를 가져오는 로직을 구현해야 함
  // 예시 데이터
  const roomsData = [
    { name: 'Room 1', slug: 'room-1' },
    { name: 'Room 2', slug: 'room-2' },
    { name: 'Room 3', slug: 'room-3' },
  ];
  return roomsData;
}