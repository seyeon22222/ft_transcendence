import { event_delete_popstate } from "../utilities.js";
import { signup_style } from "./s_css.js";
import { signUp_event_handler } from "./s_utils.js";

export function signup_js() {
    event_delete_popstate();
    const style = document.getElementById("style");
    signup_style(style);

    const Format = document.getElementById("signup_form");
	setLanguage("signup");
    signUp_event_handler(Format);
}
