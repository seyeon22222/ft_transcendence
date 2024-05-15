import { home_html } from "../src/home/html.js"
import { home_js } from "../src/home/app.js"
import { login_html } from "../src/login/html.js"
import { login_js } from "../src/login/app.js"
import { signup_html } from "../src/signup/html.js"
import { signup_js } from "../src/signup/app.js"
import { profile_html } from "../src/view/html.js"
import { profile_view } from "../src/view/app.js"
import { chatLobby_html } from "../src/chatLobby/html.js"
import { chatLobby_js } from "../src/chatLobby/app.js"
import { chat_html } from "../src/chat/html.js"
import { chat_js } from "../src/chat/app.js"

const routes = {
    "/": [home_html, home_js],
    "/login": [login_html, login_js],
    "/signup": [signup_html, signup_js],
    "/profile": [profile_html, profile_view],
    "/chatlobby": [chatLobby_html, chatLobby_js],
    "/chat": [chat_html, chat_js],
};

// function resolveRoutes(user_location) {
//   let render;
//   let main_path;
//   let hash;

//   main_path = `/${user_location[0]}`;

//   if (routes[main_path] && user_location.length >= 1 && user_location.length <= 2) {
//       render = routes[`/${user_location[0]}`];
//   } else {
//       // 404 error handling
//   }

//   return render;
// };

const router = async() => {

  let render;
  let main_path;
  let hash;

  const content = document.getElementById("content");

  let user_location = location.hash.slice(1).toLocaleLowerCase().split("/");
  // render = resolveRoutes(user_location);

  main_path = `/${user_location[0]}`;
  render = routes[`/${user_location[0]}`];

  content.innerHTML = await render[0]();
  if (user_location.length >= 2) {
    hash = `/${user_location[1]}`;
    await render[1](hash);
  }
  
  // content.innerHTML = await render[0]();
  // for (let index = 1; index < render.length; index++) {
  //     await render[index]();
  // }
};

export default router;

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