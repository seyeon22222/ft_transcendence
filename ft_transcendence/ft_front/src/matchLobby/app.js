import { event_delete_popstate } from "../utilities.js"
import { matchLobby_style, matchLobbyHandler } from "./matchLobby_utils.js";

export async function matchLobby_view() {
    event_delete_popstate();
    const style = document.getElementById("style");
    style.innerHTML = matchLobby_style();
	matchLobbyHandler();
}
