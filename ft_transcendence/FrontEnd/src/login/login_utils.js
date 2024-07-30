import { setWebsocket, check_socket } from "../../base/popup.js";
import { showModal } from "../utilities.js";

export function loginHandler() {
	const csrftoken = Cookies.get("csrftoken");
	try {
		fetch("user/check_login", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-CSRFToken": csrftoken,
			},
		}).then((response) => {
			if (response.status === 200) {
				location.href = "/#";
			} else {
				const loginForm = document.getElementById("login_form");
				loginButtonHandler(loginForm);
			}
		});
	} catch (error) {
		console.error("로그인 여부 확인 중 오류 발생 : ", error);
	}
}

function loginButtonHandler(button) {
	button.addEventListener("submit", async (event) => {
		event.preventDefault();
		const username = document.getElementById("username_input").value;
		const password = document.getElementById("password_input").value;
		const csrftoken = Cookies.get("csrftoken");

		try {
			const response = await fetch("user/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRFToken": csrftoken,
				},
				body: JSON.stringify({ username, password }),
			});

			if (response.ok) {
				const modal = document.querySelector('.modal');
				showModal('login', 'noti');
				check_socket();	
				setWebsocket();
				modal.addEventListener('hidden.bs.modal', function () {
					location.href = "/#";
				});
			} else
				showModal('login', 'err');
		} catch (error) {
			console.error("로그인 요청 중 오류 발생 : ", error);
		}
	});
}
