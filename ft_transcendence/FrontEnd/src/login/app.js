import { event_delete_popstate } from "../utilities.js";
import { loginHandler } from "./login_utils.js";
import { setTextsbyLang } from "../language/language.js"
import { login_style } from "../static/login_css.js";
export function login_js() {
	event_delete_popstate();
	const style = document.getElementById("style");
	login_style(style);
	setTextsbyLang("login");
	loginHandler();
	return null;
}
