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
};

// 의미: 현재 URL 해시(location.hash)를 분석하여 적절한 페이지를 렌더링하는 함수입니다.
// 동작 과정:
// const content = document.getElementById("content");: DOM에서 콘텐츠를 삽입할 요소를 선택합니다.
// let user_location = location.hash.slice(1).toLocaleLowerCase().split("/");:
// 현재 URL 해시를 가져옵니다 (location.hash).
// 첫 번째 문자(#)를 제거합니다 (slice(1)).
// 소문자로 변환합니다 (toLocaleLowerCase).
// 슬래시(/)를 기준으로 분할하여 배열로 만듭니다 (split("/")).
// render = routes[/${user_location[0]}];:
// URL 경로에 해당하는 렌더링 모듈을 routes 객체에서 가져옵니다.
// 예: user_location[0]이 login이면 routes["/login"]을 render에 할당합니다.
// content.innerHTML = await render[0]();:
// HTML 모듈 (render[0])을 실행하고 반환된 HTML을 content 요소에 삽입합니다.
// if (user_location.length >= 2) {:
// URL에 추가 경로가 있는지 확인합니다.
// 예: #login/somePath의 경우 somePath가 추가 경로입니다.
// 추가 경로가 있으면 render[1](hash)을 호출하여 해당 경로에 대한 추가 작업을 수행합니다.
// else { await render[1](); }:
// 추가 경로가 없으면 기본 동작을 수행합니다 (render[1]() 호출).

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
