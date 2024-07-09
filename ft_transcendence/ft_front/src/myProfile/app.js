import { image_view, game_stat_view, match_info_view, dataChange, fetchMatchList } from './profile_func.js';
import { check_login, event_delete_popstate } from "../utilities.js"

export async function profile_js() {
	event_delete_popstate();
	try {
		const style = document.getElementById("style");
		style.innerHTML = profile_style_html();
		const check = await check_login();
		if (check === false) {
			location.href = `/#`;
			return;
		}

		let data;
		const csrftoken = Cookies.get('csrftoken');
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
				const name = document.getElementById("username_input");
				const email = document.getElementById("email_input");
				name.placeholder = data[0].username;
				email.placeholder = data[0].email;

				image_view(data, csrftoken);
				game_stat_view(data);
				match_info_view(data);
				fetchMatchList(data, csrftoken);
			}
			setLanguage('profile');
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
		justify-content: center; /* Center horizontally */
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
	#1:1_Match_List {
		display: flex;
    	flex-direction: column;
   		gap: 10px;
	}
	.match-item {
		display: flex;
		align-items: center; /* Align items vertically centered */
		padding: 5px; /* Optional: Add padding for a better look */
	}
	.match-item p {
		margin: 0; /* Remove default margin */
		flex-grow: 1; /* Allow the paragraph to take up available space */
	}
	.match-item .btn {
		margin-left: 5px;
	}
	`;
}
