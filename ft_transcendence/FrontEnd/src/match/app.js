import { event_delete_popstate } from "../utilities.js";
import { matchHandler } from "./match_utils.js";
import { match_style } from "../static/match_css.js";
export async function match_view(hash) {
  event_delete_popstate();
  const style = document.getElementById("style");
  style.innerHTML = match_style();
  matchHandler(hash);
}
