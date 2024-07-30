export async function matchHandler(hash) {
	const matchId = hash.slice(1);
	const csrftoken = Cookies.get("csrftoken");
	const response = await fetch(`match/matchview/${matchId}`, {
		method: "GET",
		headers: {
		"Content-Type": "application/json",
		"X-CSRFToken": csrftoken,
		},
		credentials: "include",
	});

	if (response.ok) {
		const data = await response.json();
		const player_data = await getName();
		const button = document.getElementById("button_container");
		makeMatch(data);
		makeMatchButton(button, matchId, data, player_data);
	}
}

function makeMatchButton(button, matchId, data, player_data) {
	let hasButton;
	if (data.requester === player_data[0].user_id && data.is_active === true) {
		hasButton = document.getElementById("match_start_button");
		if (hasButton) {
			hasButton.removeEventListener("click", (event) => startMatch(event, matchId, data));
			button.removeChild(hasButton);
		}
		const startButton = document.createElement("button");
		startButton.innerHTML = "매치 시작";
		startButton.id = "match_start_button";
		startButton.className = "match_start_button";
		startButton.setAttribute('data-translate', 'match_start_button');
		if (data.is_flag !== false)
			button.appendChild(startButton);
		startButton.addEventListener("click", (event) => startMatch(event, matchId, data));
	} else {
		hasButton = document.getElementById("match_start_button");
		if (hasButton) {
			hasButton.removeEventListener("click", startMatch);
			button.removeChild(hasButton);
		}
	}
}

async function startMatch(event, matchId, data) {
	event.preventDefault();
	const csrftoken = Cookies.get('csrftoken');
	await fetch(`match/invite_m/${matchId}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrftoken,
		},
		credentials: 'include',
		body: JSON.stringify({ player1: data.player1, player2: data.player2, id: matchId, is_flag: false }),
	});
}

function makeMatch(data) {
	document.getElementById("tournament_name").innerHTML = data.name;
	const player1_name = data.player1_username;
	const player2_name = data.player2_username;

	const player1 = document.getElementById("semi_final1");
	if (player1) {
		player1.innerHTML = player1_name;
	}

	const player2 = document.getElementById("semi_final2");
	if (player2) {
		player2.innerHTML = player2_name;
	}

	if (data.match_result !== null) {
		const winner = document.getElementById("final");
		if (winner) {
			let winner_name = data.match_result;
			if (data.match_result == 1)
				winner_name = player1_name;
			else if (data.match_result == 2)
				winner_name = player2_name;
			winner.innerHTML = winner_name;
		}
	}
}

async function getName() {
	let name;
	const csrftoken = Cookies.get('csrftoken');
	const response_name = await fetch("user/info", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"X-CSRFToken": csrftoken,
		},
		credentials: "include",
	});
	if (response_name.ok) {
		name = await response_name.json();
	} else {
		const error = await response.json();
		console.error("API 요청 실패", error);
	}

	return (name);
}


export function match_style() {
	return `
	body {
	background-color: #333;
	color: white;
	font-family: 'Noto Sans KR', sans-serif;
	}
	h1 {
	font-size: 3rem;
	font-weight: 700;
		text-align: center;
		padding: 40px 0;
	}
	.match_start_button {
		  background-color: #ffc107;
		justify-content: center;
		align-content: center;
	color: black;
		padding: 10px 20px;
		border-radius: 5px;
		width: 200px;
		height: 50px;
		text-align: center;
	}
	.theme {
		height: 100%;
		width: 100%;
		position: relative;
	}
	.bracket {
		padding: 40px;
		margin: 5px;
	}
	.bracket {
		display: flex;
		flex-direction: row;
		position: relative;
		justify-content: center;
		align-content: center;
	}
	.column {
		display: flex;
		flex-direction: column;
		min-height: 100%;
		justify-content: center;
		align-content: center;
	}
	.match {
		position: relative;
		display: flex;
		flex-direction: column;
		min-width: 240px;
		max-width: 240px;
		height: 62px;
		margin: 12px 24px 12px 0;
	}
	.match .match-top {
		border-radius: 2px 2px 0 0;
	}
	.match .match-bottom {
		border-radius: 0 0 2px 2px;
	}
	.match .team {
		display: flex;
		align-items: center;
		width: 100%;
		height: 100%;
		position: relative;
	}
	.match .team span {
		padding-left: 8px;
	}
	.match .team span:last-child {
		padding-right: 8px;
	}
	.match .team:first-child {
		margin-bottom: -1px;
	}
	.match-lines {
		display: block;
		position: absolute;
		top: 50%;
		bottom: 0;
		margin-top: 0px;
		right: -1px;
	}
	.match-lines .line {
		background: red;
		position: absolute;
	}
	.match-lines .line.one {
		height: 1px;
		width: 12px;
	}
	.match-lines .line.two {
		height: 44px;
		width: 1px;
		left: 11px;
	}
	.match-lines .line.three {
		height: 1px;
		width: 24px;
	}
	.match-lines.alt {
		left: -12px;
	}
	.match:nth-child(even) .match-lines .line.two {
		transform: translate(0, -100%);
	}
	.column:first-child .match-lines.alt {
		display: none;
	}
	.column:last-child .match-lines {
		display: none;
	}
	.column:last-child .match-lines.alt {
		display: block;
	}
	.column:nth-child(2) .match-lines .line.two {
		height: 88px;
	}
	.theme-dark {
		border-color: #040607;
	}
	.theme-dark .match-lines .line {
		background: #36404e;
	}
	.theme-dark .team {
		background: #232c36;
	color: #e3e8ef;
		border-color: #36404e;
	}
	`;
}
