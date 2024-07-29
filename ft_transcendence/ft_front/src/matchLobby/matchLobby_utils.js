import { check_login } from "../utilities.js"
import { tournament_list_view, make_tournament, multimatch_list_view, match_list_view} from "./matchLobby_func.js"
import { setTextsbyLang } from "../language/language.js"

export async function matchLobbyHandler() {
	const check = await check_login();
    if (check === false) {
        location.href = `/#`;
        return;
    }

    try {
		setTextsbyLang("matchlobby");
		
        const tournamentContainer = document.getElementById("tournament_list");
        tournament_list_view(tournamentContainer);
        make_tournament();

        const multiMatchContainer = document.getElementById("multiMatch_list");
        multimatch_list_view(multiMatchContainer);

        const matchContainer = document.getElementById("match_list");
        match_list_view(matchContainer);
    } catch(error) {
        console.error('matchLobby : ', error);
    }    
}


export function matchLobby_style() {
	return `
    body {
        background-color: #333; /* Dark gray background */
        color: white;
        font-family: 'Noto Sans KR', sans-serif;
    }
	h1 {
		font-weight: 700;
		text-align: center;
		padding: 40px 0;
	}
	h2 {
		font-weight: 550;
	}
    .custom-yellow-btn {
        background-color: #ffc107;
        color: white;
    }
    .narrow-card {
        max-width: 400px; /* Adjust this value to make the box narrower or wider */
    }
    .center-text { text-align: center; }
    .spacing {
        margin-top: 3rem; /* Adjust the value as needed for desired spacing */
    }
	.modal {
		color: #000;
		display: none;
	}
    `;
}
