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
