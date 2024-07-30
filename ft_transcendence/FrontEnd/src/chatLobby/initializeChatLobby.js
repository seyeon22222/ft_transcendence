import { set_style } from "../static/chatLobby_css.js";
import { check_login, delete_back_show, event_delete_popstate } from "../utilities.js";
import { loadRoomList } from "./loadRoomList.js";
import { loadUserList } from "./loadUserList.js";
import { handleRoomFormSubmit } from "./handleRoomFormSubmit.js";
import { setTextsbyLang } from "../language/language.js";

export async function chatLobby_js() {
    delete_back_show();
    event_delete_popstate();
    const styleElement = document.getElementById("style"); // (style) > (styleElement)
    styleElement.innerHTML = set_style();

    setTextsbyLang("chatlobby");
    const isLoggedIn = await check_login(); // (check) > (isLoggedIn)
    if (isLoggedIn === false) {
        location.href = `/#`;
        return;
    }

    try {
        await loadRoomList();
        await loadUserList();
        handleRoomFormSubmit();
    } catch (error) {
        console.error('chatLobby.app Error occurs : ', error);
    }
}
