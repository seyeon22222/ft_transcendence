import { event_delete_popstate } from "../utilities.js";

export async function multiMatch_js(hash) {
    event_delete_popstate();
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
        justify-content: space-around;
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
    .theme-dark .score {
        color: #03d9ce;
    }
    .theme-dark .match .score {
        font-size: 14px;
    }

    `;
}

