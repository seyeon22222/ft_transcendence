import { event_delete_popstate } from "../utilities.js"
import { matchLobbyHandler } from "./matchLobby_utils.js";
import { matchLobby_style } from "../static/matchLobby_css.js";
export async function matchLobby_view() {
    event_delete_popstate();
    const style = document.getElementById("style");
    style.innerHTML = matchLobby_style();
	matchLobbyHandler();
}
