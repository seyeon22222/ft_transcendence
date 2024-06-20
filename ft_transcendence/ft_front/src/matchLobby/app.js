import { check_login } from "../utilities.js"
import { tournament_list_view, make_tournament, multimatch_list_view, match_list_view} from "./matchLobby_func.js"

export async function matchLobby_view() {

    const check = await check_login();
    if (check === false) {
        location.href = `/#`;
        return;
    }

    try {
		setLanguage("matchlobby");

        const container = document.getElementById("tournament_list");
        tournament_list_view(container);
        make_tournament();

        const multiMatchcontainer = document.getElementById("multiMatch_list");
        multimatch_list_view(multiMatchcontainer);

        const matchContainer = document.getElementById("match_list");
        match_list_view(matchContainer);
    } catch(error) {
        console.error('matchLobby : ', error);
    }    
}
