import { event_delete_popstate } from "../utilities.js";
import { loginHandler, login_style } from "./login_utils.js";
import { setTextsbyLang } from "../language/language.js"

export function login_js() {
	event_delete_popstate();
	const style = document.getElementById("style");
	login_style(style);
	setTextsbyLang("login");
	loginHandler();
	return null;
}
