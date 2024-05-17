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
import { select_profile_html } from "../src/info/html.js"
import { select_profile_view } from "../src/info/app.js"

const routes = {
    "/": [home_html, home_js],
    "/login": [login_html, login_js],
    "/signup": [signup_html, signup_js],
    "/profile": [profile_html, profile_view],
    "/chatlobby": [chatLobby_html, chatLobby_js],
    "/chat": [chat_html, chat_js],
    "/info": [select_profile_html, select_profile_view],
};

const router = async() => {

  let render;
  let main_path;
  let hash;

  const content = document.getElementById("content");

  let user_location = location.hash.slice(1).toLocaleLowerCase().split("/");

  main_path = `/${user_location[0]}`;
  render = routes[`/${user_location[0]}`];

  content.innerHTML = await render[0]();
  if (user_location.length >= 2) {
    hash = `/${user_location[1]}`;
    await render[1](hash);
  } else {
    await render[1]();
  }
};

export default router;