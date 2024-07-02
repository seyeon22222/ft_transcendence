import { home_html } from "../src/home/html.js";
import { home_js } from "../src/home/app.js";
import { login_html } from "../src/login/html.js";
import { login_js } from "../src/login/app.js";
import { signup_html } from "../src/signup/html.js";
import { signup_js } from "../src/signup/app.js";
import { profile_html } from "../src/myProfile/html.js";
import { profile_js } from "../src/myProfile/app.js";
import { chatLobby_html } from "../src/chatLobby/html.js";
import { chatLobby_js } from "../src/chatLobby/app.js";
import { chat_html } from "../src/chat/html.js";
import { chat_js } from "../src/chat/app.js";
import { info_html } from "../src/info/html.js";
import { info_js } from "../src/info/app.js";
import { matchLobby_html } from "../src/matchLobby/html.js";
import { matchLobby_view } from "../src/matchLobby/app.js";
import { match_html } from "../src/match/html.js";
import { match_view } from "../src/match/app.js";
import { tournament_html } from "../src/tournament/html.js";
import { tournament_view } from "../src/tournament/app.js";
import { chatPrivate_html } from "../src/chatPrivate/html.js";
import { chatPrivate_js } from "../src/chatPrivate/app.js";
import { game_html } from "../src/game/html.js";
import { game_m_js } from "../src/game/app_m.js";
import { game_t_js } from "../src/game/app_t.js";
import { game_multi_js } from "../src/game/app_multi.js";
import { multiMatch_js } from "../src/multimatch/app.js";
import { multiMatch_html } from "../src/multimatch/html.js";
import { custom_html } from "../src/custom/html_custom.js"
import { custom_view } from "../src/custom/app_custom.js" 
import { multicustom_view } from "../src/custom/app_custom_multi.js"
import { tcustom_view } from "../src/custom/app_custom_t.js"

const routes = {
  "/": [home_html, home_js],
  "/login": [login_html, login_js],
  "/signup": [signup_html, signup_js],
  "/profile": [profile_html, profile_js],
  "/chatlobby": [chatLobby_html, chatLobby_js],
  "/chat": [chat_html, chat_js],
  "/info": [info_html, info_js],
  "/matchlobby": [matchLobby_html, matchLobby_view],
  "/match": [match_html, match_view],
  "/tournament": [tournament_html, tournament_view],
  "/chatprivate": [chatPrivate_html, chatPrivate_js],
  "/gamem": [game_html, game_m_js],
  "/gamet": [game_html, game_t_js],
  "/gamemulti": [game_html, game_multi_js],
  "/multi": [multiMatch_html, multiMatch_js],
  "/customm" :[custom_html, custom_view],
  "/custommulti" :[custom_html, multicustom_view],
  "/customt" : [custom_html, tcustom_view],
};

const router = async () => {
  const content = document.getElementById("content");
  let render;
  let hash;
  let user_location = location.hash.slice(1).toLocaleLowerCase().split("/");

  render = routes[`/${user_location[0]}`];

  content.innerHTML = await render[0]();
  setTimeout(async () => {
    if (user_location.length >= 2) {
      hash = `/${user_location[1]}`;
      await render[1](hash);
    } else {
      await render[1]();
    }
  }, 0.5);
};

export default router;
