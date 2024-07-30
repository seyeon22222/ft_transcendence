function game_view(data) {
	document.getElementById("match_name").innerHTML = data.name;
	const player1_name = data.player1_username;
	const player2_name = data.player3_username;
	const player3_name = data.player2_username;
	const player4_name = data.player4_username;

	const player1 = document.getElementById("semi_final1");
	if (player1) {
		player1.innerHTML = player1_name;
	}

	const player2 = document.getElementById("semi_final2");
	if (player2) {
		player2.innerHTML = player2_name;
	}

	const player3 = document.getElementById("semi_final3");
	if (player3) {
		player3.innerHTML = player3_name;
	}

	const player4 = document.getElementById("semi_final4");
	if (player4) {
		player4.innerHTML = player4_name;
	}
	if (data.match_result !== null) {
		const winner1 = document.getElementById("final1");
		const winner2 = document.getElementById("final2");
		if (winner1 && winner2) {
			let [winner1_name, winner2_name] = data.match_result === "1" ? [player1_name, player2_name] : [player3_name, player4_name];
			winner1.innerHTML = winner1_name;
			winner2.innerHTML = winner2_name;
		}
	}
}

export async function get_game_data(hash) {
    const game_id = hash.slice(1).split('%20')[2];
	
	const csrftoken = Cookies.get("csrftoken");
	const response = await fetch(`match/multimatchview/${game_id}`, {
		method: "GET",
		headers: {
		"Content-Type": "application/json",
		"X-CSRFToken": csrftoken,
		},
		credentials: "include",
	});

	if (response.ok) {
		const data = await response.json();
		document.getElementById("match_name").innerHTML = data.name;
		game_view(data);
	}
}