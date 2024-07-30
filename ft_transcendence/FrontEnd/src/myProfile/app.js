import { profile_page_setting } from "./profile_func.js"
import { check_login, event_delete_popstate } from "../utilities.js"
import { profile_style_html } from "../static/profile_css.js";

export async function profile_js() {
	event_delete_popstate();
	const style = document.getElementById("style");
	style.innerHTML = profile_style_html();

	if (await check_login() === false) {
		location.href = `/#`;
		return;
	}

	profile_page_setting();
}

