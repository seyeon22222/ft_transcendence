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

export function info_style(style) {
	style.innerHTML = `
		body {
		  background-color: #333; /* Dark gray background */
		  color: white;
		  font-family: 'Noto Sans KR', sans-serif;
	  }
	  h1 {
		  font-size: 3rem; /* Larger font size for the title */
		  font-weight: 700; /* Thicker font weight for the title */
		  text-align: center;
		  padding: 40px 0; /* Add padding above and below the title */
	  }
		.button-container {
		  display: flex; /* Use flexbox for centering */
		  align-items: center; /* Center vertically */
		  justify-content: center; /* Center horizontally */
		  gap: 10px; /* Space between buttons */
		}
	  .custom-yellow-btn {
		  background-color: #ffc107;
		  color: black;
		  padding: 10px 20px;
		  border-radius: 5px;
		  width: 300px; /* Fixed width for buttons */
		  height: 50px; /* Fixed height for buttons */
		  text-align: center;
	  }
	  .userinfo-container {
		  display: flex;
		  align-items: flex-start;
	  }
	  #profile-image {
		  display: flex; /* Use flexbox for centering */
		  align-items: center; /* Center vertically */
		  justify-content: center; /* Center horizontally */
		  width: 100%;
		  max-width: 530px; /* Fixed width */
		  height: 300px; /* Fixed height */
		  overflow: hidden; /* Hide any overflow */
		  margin-right: 10px;
	  }
	  #profile-image img {
		  width: 100%; /* Scale the image to fit the container */
		  max-height: 100%; /* Scale the image to fit the container */
		  object-fit: cover; /* Ensure image fits within the specified size */
	  }
	  .input-container {
		  margin-left: 10px;
		  flex-grow: 1;
		  height: 300px;
	  }
	  .stat-container {
		  display: flex;
		  align-items: flex-start;
		  justify-content: center;
	  }
	  .stat-container .col {
		  flex: 1; /* Ensure columns take up equal width */
		  margin-right: 20px; /* Add margin between columns */
	  }
	  .stat-container .col:last-child {
		  margin-right: 0; /* Remove margin for the last column */
	  }
	  .gamestat-container,
	  .match-container {
		  display: inline-block;
		  vertical-align: top;
		  width: 100%;
		  height: 270px;
		  padding-top: 3px;
		  padding-left: 20px;
		  padding-right: 20px;
		  padding-bottom: 20px;
		  border: 1px solid #ddd; /* Border color */
		  border-radius: 5px; /* Rounded corners */
		  box-shadow: 0 2px 4px rgba(79, 60, 60, 0.1); /* Shadow for a card effect */
		  background-color: #fff; /* White background for card effect */
		  color: #000; /* Set text color to black */
		  margin-bottom: 20px; /* Space between cards */
	  }
	  .modal {
		  color: #000;
		  display: none;
	  }
	`;
}
