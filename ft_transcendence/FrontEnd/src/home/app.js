import { check_login } from '../utilities.js'
import { delete_back_show, event_delete_popstate } from '../utilities.js';
import { setTextsbyLang } from "../language/language.js";
import { home_style } from '../static/home_css.js';
import { logout_button_eventhandler, matchmaking_button_eventhandler, 
    mulmatchmaking_button_eventhandler, ai_button_eventhandler } from './home_func.js';
import { home_login_html, home_logout_html } from './html.js';
let i_socket;

export async function home_js() {
    event_delete_popstate();
    if (i_socket) {
        i_socket.close();
        i_socket = null;
    }
    delete_back_show();
    try {
        document.getElementById("style").innerHTML = home_style();
        
        const check = await check_login();
        if (check === true) {
            document.getElementById("buttons-container").innerHTML = home_login_html();
            logout_button_eventhandler(document.getElementById('logout_button'));
            matchmaking_button_eventhandler(document.getElementById('matchmaking_button'));
            mulmatchmaking_button_eventhandler(document.getElementById('mulmatchmaking_button'));
            ai_button_eventhandler(document.getElementById('ai_button'));
        }
        else
            document.getElementById("buttons-container").innerHTML = home_logout_html();
		setTextsbyLang("home");
    } catch (error) {
        console.error('home 화면에서 오류 발생 : ', error);
    }
}

