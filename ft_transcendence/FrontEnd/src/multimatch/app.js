import { event_delete_popstate } from "../utilities.js";
import { multiMatch_style } from "../static/multi_css.js";
import { get_game_data } from "./multi_utils.js";

export async function multiMatch_js(hash) {
    event_delete_popstate();
	document.getElementById("style").innerHTML = multiMatch_style();
    get_game_data(hash);

}