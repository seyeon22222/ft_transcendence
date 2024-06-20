export async function multiMatch_js(hash) {

	const style = document.getElementById("style");
  	style.innerHTML = multiMatch_style();

	const matchName = hash.slice(1);
	const arr = matchName.split('%20');
	const matchId = arr[2];
	
	const csrftoken = Cookies.get("csrftoken");
	const response = await fetch(`match/multimatchview/${matchId}`, {
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
		multimatch_render(data);
	}

}

function multimatch_render(data) {
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

function multiMatch_style() {
	return `
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
    button {
        background-color: #ffc107;
		color: black;
        padding: 10px 20px;
        border-radius: 5px;
        width: 200px; /* Fixed width for buttons */
        height: 50px; /* Fixed height for buttons */
        text-align: center;
    }
    .theme {
        height: 100%;
        width: 100%;
        position: relative;
    }
    .bracket {
        padding: 5px;
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
		min-width: 200px;
   		margin: 0;
    }
    .match {
        position: relative;
        display: flex;
        flex-direction: column;
        min-width: 240px;
        max-width: 240px;
        height: 62px;
        margin: 12px 0 12px 0;
	}
    .match .match-top {
        border-radius: 2px 2px 0px 0px;
    }
    .match .match-bottom {
        border-radius: 0 0 2px 2px;
    }
    .match .team {
        display: flex;
        align-items: center;
		justify-content: center;
        width: 100%;
        height: 100%;
        border: 1px solid black;
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
        top: 50%;
        bottom: 0;
        margin-top: 0px;
        right: -1px;
    }
    .match-lines .line {
        background: red;
		height: 2px;
        width: 100%;
    }

    .column:last-child .match-lines {
        display: none;
    }

    .disable-image .image,
    .disable-name .name,
    .disable-borders {
        border-width: 0px !important;
    }
    .disable-borders .team {
        border-width: 0px !important;
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

