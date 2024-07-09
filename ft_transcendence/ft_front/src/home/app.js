import router from '../../base/router.js'
import { check_login } from '../utilities.js'
import { formatDateTime } from "../info/info_func.js";
import { check_socket } from '../../base/totalSocket.js';
import { delete_back_show, showModal, event_delete_popstate } from '../utilities.js';

let i_socket;

export async function home_js() {
    event_delete_popstate();
    if (i_socket) {
        i_socket.close();
        i_socket = null;
    }
    delete_back_show();
    try {
        const style = document.getElementById("style");
        style.innerHTML = home_style_html();

        const check = await check_login();
        if (check === true) {
            const container = document.getElementById("buttons-container");
            container.innerHTML = home_login_html();

            const logoutButton = document.getElementById('logout_button');
            logout_button_eventhandler(logoutButton);

            const matchmakingButton = document.getElementById('matchmaking_button');
            matchmaking_button_eventhandler(matchmakingButton);

            const mulmatchmakingButton = document.getElementById('mulmatchmaking_button');
            mulmatchmaking_button_eventhandler(mulmatchmakingButton);
        }
        else {
            const container = document.getElementById("buttons-container");
            container.innerHTML = home_logout_html();
        }
		setLanguage("home");
    } catch (error) {
        console.error('home 화면에서 오류 발생 : ', error);
    }
}

function matchmaking_button_eventhandler(button) {
    button.addEventListener('click', async function() {
        try {
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
                const data = await response.json();
                const username = data[0].username;
                const now = new Date();
	            const startDate = formatDateTime(new Date(now.getTime() + 300));

                const matchmaking_response = await fetch("/match/matchmaking", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": csrftoken,
                    },
                    body: JSON.stringify({username, startDate}),
                });
                if (matchmaking_response.ok) {
                    const result = await matchmaking_response.json();
					showModal('home', `matchmaking_${result.message}_noti`);
				}
            }
        } catch (error) {
            console.error(error);
        }
    });
}

function mulmatchmaking_button_eventhandler(button) {
    button.addEventListener('click', async function() {
        try {
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
                const data = await response.json();
                const username = data[0].username;
                const now = new Date();
	            const startDate = formatDateTime(new Date(now.getTime() + 300));

                const matchmaking_response = await fetch("/match/mulmatchmaking", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": csrftoken,
                    },
                    body: JSON.stringify({username, startDate}),
                });
                if (matchmaking_response.ok) {
                    const result = await matchmaking_response.json();
					showModal('home', `multi_${result.message}_noti`);
                }
            }
        } catch (error) {
            console.error(error);
        }
    });
}

function logout_button_eventhandler(button) {
    button.addEventListener('click', async function() {
        try {
            const csrftoken = Cookies.get('csrftoken');
            const response = await fetch('user/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify({})
            });

            if (response.ok) {
                if (window.i_socket !== null) {
                    window.i_socket.close();
                    window.i_socket = null;
                }
				const modal = document.querySelector('.modal');
				showModal('home', 'logout_noti');
				modal.addEventListener('hidden.bs.modal', function () {
					check_socket();
                	router();
				})
            } else {
				showModal('home', 'logout_err');
			}

        } catch (error) {
            console.error('로그아웃 중 오류 발생 : ', error);
        }
    })
}

function home_logout_html() {
    return `
        <a href="/#login" class="btn btn-primary" data-translate="login">로그인</a>
        <a href="/#signup" class="btn btn-primary" data-translate="signup">회원가입</a>
    `;
}

function home_login_html() {
    return `
        <a href="/#profile" class="btn btn-primary" data-translate="my_profile">내 프로필</a>
        <a href="/#chatLobby" class="btn btn-primary" data-translate="chatting">채팅</a>
        <a href="/#matchlobby" class="btn btn-primary" data-translate="tournament">토너먼트</a>
        <button class="btn" id="matchmaking_button" data-translate="matchmaking">매치메이킹</button>
        <button class="btn" id="mulmatchmaking_button" data-translate="multimatchmaking">2:2 매치</button>
        <button class="btn" id="logout_button" data-translate="logout">로그아웃</button>
    `;
}

function home_style_html() {
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
    .image-container {
        text-align: center;
        margin: 20px 0;
    }
    .image-container img {
        max-width: 40%; /* Smaller image size */
        height: auto;
    }
    .buttons-container {
        display: flex;
        justify-content: center;
        gap: 10px;
    }
    .buttons-container a,
    .buttons-container button {
        text-decoration: none;
        color: white;
        padding: 10px 20px;
        border: 2px solid white;
        border-radius: 5px;
        width: 250px; /* Fixed width for buttons */
        text-align: center;
        background-color: transparent;
        font-size: 1rem;
    }
    .buttons-container a:hover,
    .buttons-container button:hover {
        background-color: #555; /* Slightly lighter gray on hover */
    }
	.modal {
		color: black;
		display: none;
	}
    `;
}
