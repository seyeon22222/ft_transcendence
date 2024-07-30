import { check_login, event_delete_popstate } from "../utilities.js";
import { ChatHandler, getUserData, MatchHandler, BlockHandler, UnblockHandler } from "./info_utils.js";
import { info_style } from "../static/info_css.js";

export async function info_js() {
	event_delete_popstate();
	let acceptUser;
	let userLocation = location.hash.slice(1).toLocaleLowerCase().split("/");
	let username = userLocation[1];

	const style = document.getElementById("style");
	info_style(style);

	const check = await check_login();
	if (check === false) {
		location.href = `/#`;
		return;
	}

	acceptUser = await getUserData(username);

	const MatchButton = document.getElementById("match_button");
	MatchHandler(MatchButton, acceptUser);
	
	const chatButton = document.getElementById("chat_button");
	ChatHandler(chatButton, acceptUser);

	const BlockButton = document.getElementById("block_button");
	BlockHandler(BlockButton, acceptUser);

	const UnblockButton = document.getElementById("block_release_button");
	UnblockHandler(UnblockButton, acceptUser);
}
