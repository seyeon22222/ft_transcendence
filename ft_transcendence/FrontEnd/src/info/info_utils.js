import { select_image_view, select_game_stat_view, select_match_info_view } from "./info_func.js";
import { showModal } from "../utilities.js";
import { setTextsbyLang } from "../language/language.js"

export async function getUserData(username) {
	let accept_user;
	let data;

	try {
		const csrftoken = Cookies.get("csrftoken");
		const response = await fetch(`info/${username}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-CSRFToken": csrftoken,
			},
			credentials: "include",
		});
		if (response.ok) {
			data = await response.json();
		} else {
			const error = await response.json();
			console.error("API 요청 실패", error);
		}
	} catch (error) {
		console.error("API 요청 실패", error);
	}
	if (data) {
		let flag;
		const name = document.getElementById("username");
		const email = document.getElementById("email");
		email.textContent = "";
		data.forEach((element) => {
			if (element.username === username) {
				flag = true;
				name.textContent = element.username;
				accept_user = element.username;
				if (!element.email) email.textContent = null;
				else email.textContent = element.email;
				select_image_view(element);
				select_game_stat_view(element);
				select_match_info_view(element);
				setTextsbyLang("info");
			}
		});
		if (!flag) {
			const infoModal = document.querySelector('.modal');
			showModal('info', 'nouser_err');
			infoModal.addEventListener('hidden.bs.modal', function () {
				location.href = '/#';
			});
		}
	}
	return accept_user;
}

export async function MatchHandler(button, accept_user) {
	let data;
	button.addEventListener("click", async (event) => {
		event.preventDefault();
		try {
			const req_csrftoken = Cookies.get("csrftoken");
			const req_response = await fetch(`user/info`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"X-CSRFToken": req_csrftoken,
				},
				credentials: "include",
			});
			if (req_response.ok) {
				data = await req_response.json();
			} else {
				const error = await req_response.json();
				console.error("API 요청 실패", error);
			}
		} catch (error) {
			console.error("API 요청 실패", error);
		}
		if (data[0].username === accept_user) {
			showModal('info', 'selfmatch_err');
			return;
		}
		const apply_user = data[0].username;
		const matchname = apply_user + " vs " + accept_user;
		const mat_csrftoken = Cookies.get("csrftoken");
		
		const formData = {
			apply_user: apply_user,
			accept_user: accept_user,
			name: matchname,
		};

		const mat_response = await fetch("/match/m_request", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRFToken": mat_csrftoken,
			},
			body: JSON.stringify(formData),
		});

		if (mat_response.ok) {
			const modal = document.querySelector('.modal');
			showModal('info', 'match_req');
			modal.addEventListener('hidden.bs.modal', function () {
				location.href = "/#";
			});
		} else {
			showModal('info', 'match_req_err');
		}
	});

}

export async function ChatHandler(button, accept_user) {
	let data;
	let response;
	let csrftoken;
	button.addEventListener("click", async () => {
		try {
			csrftoken = Cookies.get("csrftoken");
			response = await fetch(`user/info`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"X-CSRFToken": csrftoken,
				},
				credentials: "include",
			});
			if (response.ok) {
				data = await response.json();
			} else {
				const error = await response.json();
				console.error("API 요청 실패", error);
			}
		} catch (error) {
			console.error("API 요청 실패", error);
		}

		if (data[0].username === accept_user) {
			showModal('info', 'selfchat_err');
			return;
		}

		const sender = data[0].username;
		const receiver = accept_user;
		const apply_user = data[0].username;

		const formData = {
			apply_user: apply_user,
			accept_user: accept_user,
		};

		const mat_csrftoken = Cookies.get("csrftoken");
		const block_response = await fetch("/user/block_check_request", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRFToken": mat_csrftoken,
			},
			body: JSON.stringify(formData),
		});

		if (block_response.ok) {
			try {
				csrftoken = Cookies.get("csrftoken");
				response = await fetch(`chat/privaterooms/${sender}/${receiver}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"X-CSRFToken": csrftoken,
					},
				});

				if (response.status === 200) {
					data = await response.json();
					const slug = data.slug;
					location.href = "/#chatprivate/" + slug;
				}
				else {
					response = await fetch(`chat/privaterooms/${sender}/${receiver}/`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"X-CSRFToken": csrftoken,
						},
					});

					data = await response.json();

					const slug = data.slug;
					location.href = "/#chatprivate/" + slug;
				}
			} catch (error) {
				console.error("API failed : ", error);
			}
		} else {
			showModal('info', 'is_blocked');
		}
	});
}

export async function BlockHandler(button, accept_user) {
	let data;
	button.addEventListener("click", async (event) => {
		event.preventDefault();
		try {
			const req_csrftoken = Cookies.get("csrftoken");
			const req_response = await fetch(`user/info`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"X-CSRFToken": req_csrftoken,
				},
				credentials: "include",
			});
			if (req_response.ok) {
				data = await req_response.json();
			} else {
				const error = await req_response.json();
				console.error("API 요청 실패", error);
			}
		} catch (error) {
			console.error("API 요청 실패", error);
		}
		if (data[0].username === accept_user) {
			showModal('info', 'selfblock_err');
			return;
		}
		const apply_user = data[0].username;

		const mat_csrftoken = Cookies.get("csrftoken");
		const formData = {
			apply_user: apply_user,
			accept_user: accept_user,
		};

		const block_response = await fetch("/user/block_request", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRFToken": mat_csrftoken,
			},
			body: JSON.stringify(formData),
		});

		if (block_response.ok) {
			showModal('info', 'block_noti');
		} else {
			showModal('info', 'block_err');
		}
	});
}

export async function UnblockHandler(button, accept_user) {
	let data;
	button.addEventListener("click", async (event) => {
		event.preventDefault();
		try {
			const req_csrftoken = Cookies.get("csrftoken");
			const req_response = await fetch(`user/info`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"X-CSRFToken": req_csrftoken,
				},
				credentials: "include",
			});
			if (req_response.ok) {
				data = await req_response.json();
			} else {
				const error = await req_response.json();
				console.error("API 요청 실패", error);
			}
		} catch (error) {
			console.error("API 요청 실패", error);
		}
		if (data[0].username === accept_user) {
			showModal('info', 'selfunblock_err');
			return;
		}
		const apply_user = data[0].username;
		const mat_csrftoken = Cookies.get("csrftoken");
		const formData = {
			apply_user: apply_user,
			accept_user: accept_user,
		};

		const block_release_response = await fetch("/user/block_release_request", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRFToken": mat_csrftoken,
			},
			body: JSON.stringify(formData),
		});

		if (block_release_response.ok) {
			showModal('info', 'unblock_noti');
		} else {
			showModal('info', 'unblock_err');
		}
	});
}