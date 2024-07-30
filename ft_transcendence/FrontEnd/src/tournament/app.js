import { check_login, event_add_popstate} from "../utilities.js"
import { t_popstate_event, startTournament, updateGameInfo, get_user_data, apply_btn_evnet_handler } from "./t_utils.js";
import { setTextsbyLang } from "../language/language.js";
import { tournament_style } from "../static/tournament_css.js";

export async function tournament_view(hash) {
    event_add_popstate(t_popstate_event);
    window.tournament_url = location.href;
    const style = document.getElementById("style");
    style.innerHTML = tournament_style();
	setTextsbyLang('tournament');

    if (await check_login() === false) {
        location.href = `/#`;
        return;
    }

    const game_name = hash.slice(1);
    const array = game_name.split(`%20`);
    let cnt = 0;
    let game_id;
    array.forEach(element => {
        cnt++;
        if (cnt == array.length)
            document.getElementById("tournament_name").innerHTML += element;
        else
            document.getElementById("tournament_name").innerHTML += element + " ";
    });

    const result = await updateGameInfo(array);
    const { player, game_id: updatedTournamentId } = result;
    game_id = updatedTournamentId;
    if (window.tournament_socket == null)
        window.tournament_socket = new WebSocket(`wss://${window.location.host}/ws/tournament/${game_id}/`);

    window.tournament_socket.onmessage = async function(e) {
        const data = JSON.parse(e.data);

        const current_hash = window.location.hash;

        if (current_hash !== `#tournament/${game_name}`) {
            return;
        } else {
            const result = await updateGameInfo(array);
        }
    };

    const user_data = await get_user_data();
    
    const start_btn = document.getElementById("tournament_start");
    if (start_btn !== null)
        start_btn.addEventListener("click", (event) => startTournament(event, game_id));


    const game_apply = document.getElementById('tournament_button');
    apply_btn_evnet_handler(game_apply, user_data, game_id, player, game_name);
}
