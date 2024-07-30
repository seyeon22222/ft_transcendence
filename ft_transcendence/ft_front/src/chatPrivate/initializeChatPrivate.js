import { check_login, event_delete_popstate } from "../utilities.js";
import { loadUserData, checkBlockStatus } from "./loadUserData.js";
import { setupWebSocket } from "./setupWebSocket.js";
import { setTextsbyLang } from "../language/language.js";

export async function chatPrivate_js(hash) {
  event_delete_popstate();
  const loginCheck = await check_login(); // (check) > (loginCheck)
  if (loginCheck === false) {
    location.href = `/#`;
    return;
  }

  setTextsbyLang("chatprivate");

  const roomSlug = hash.slice(1); // (slug) > (roomSlug)
  const csrfToken = Cookies.get("csrftoken"); // (csrftoken) > (csrfToken)
  
  try {
    const userData = await loadUserData(roomSlug, csrfToken); // (data) > (userData)

    if (!await checkBlockStatus(userData, csrfToken)) {
      return;
    }

    setupWebSocket(hash, userData);
  } catch (error) {
    console.error("Error initializing chat lobby:", error);
  }
}
