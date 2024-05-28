import { image_view, game_stat_view, match_info_view, dataChange, fetchMatchList } from './profile_func.js';
import { check_login } from "../utilities.js"

export async function profile_js() {
	try {
		// set css style
		const style = document.getElementById("style");
		style.innerHTML = profile_style_html();

		// check login status
		const check = await check_login();
		if (check === false) {
			location.href = `/#`;
			return;
		}

		let data;
		const csrftoken = Cookies.get('csrftoken');

		// retrieve current user data
		const response = await fetch('user/info', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrftoken,
			},
			credentials: 'include',
		});
		if (response.ok) {
			data = await response.json();
			if (data) {
				// set current user's info as placeholder
				const name = document.getElementById("username_input");
				const email = document.getElementById("email_input");
				name.placeholder = data[0].username;
				email.placeholder = data[0].email;

				image_view(data, csrftoken);
				game_stat_view(data);
				match_info_view(data);
				fetchMatchList(data, csrftoken);
			}
		} else {
			const error = await response.json();
			console.error('API 요청 실패', error);
		}

		const changeData = document.getElementById("edit_button");
		dataChange(changeData, csrftoken);
	} catch (error) {
		console.error('API 요청 실패', error);
	}
}

function profile_style_html() {
	return `
	body {
		background-color: #333; /* Dark gray background */
		color: white;
		font-family: 'Noto Sans KR', sans-serif;
	}
	h1 {
		font-size: 3rem; /* Larger font size for the title */
		font-weight: 700; /* Thicker font weight for the title */
	}
	.custom-yellow-btn {
		background-color: #ffc107;
		color: white;
	}
	.userinfo-container {
		display: flex;
		align-items: flex-start;
	}
	#profile-image {
	display: flex; /* Use flexbox for centering */
	align-items: center; /* Center vertically */
	justify-content: center; /* Center horizontally */
	width: 530px; /* Fixed width */
	height: 250px; /* Fixed height */
	overflow: hidden; /* Hide any overflow */
	margin-right: 20px;
	}
	#profile-image img {
	max-width: 100%; /* Scale the image to fit the container */
	max-height: 100%; /* Scale the image to fit the container */
	object-fit: cover; /* Ensure image fits within the specified size */
	}
	.input-container {
		flex-grow: 1;
	}
	.gamestat-container,
	.match-container {
		display: inline-block;
		vertical-align: top;
		width: 48%;
		padding: 20px; /* Add padding inside the card */
		border: 1px solid #ddd; /* Border color */
		border-radius: 5px; /* Rounded corners */
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Shadow for a card effect */
		background-color: #fff; /* White background for card effect */
		color: #000; /* Set text color to black */
		margin-bottom: 20px; /* Space between cards */
	}
	.match-container {
		margin-left: 2%;
	}
	`;
}