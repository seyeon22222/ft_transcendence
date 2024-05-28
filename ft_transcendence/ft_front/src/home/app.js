import router from '../../base/router.js'
import { check_login } from '../utilities.js'
import { formatDateTime } from "../info/info_func.js";

export async function home_js() {
    try {
        // set css style
        const style = document.getElementById("style");
        style.innerHTML = home_style_html();
        home_style_html();

        const check = await check_login();
        if (check === true) { // login
            const container = document.getElementById("buttons-container");
            container.innerHTML = home_login_html();

            const logoutButton = document.getElementById('logout_button');
            logout_button_eventhandler(logoutButton);

            const matchmakingButton = document.getElementById('matchmaking_button');
            matchmaking_button_eventhandler(matchmakingButton);
        }
        else {
            const container = document.getElementById("buttons-container");
            container.innerHTML = home_logout_html();
        }
    } catch (error) {
        console.error('home 화면에서 오류 발생 : ', error);
    }
}

function matchmaking_button_eventhandler(button) {
    button.addEventListener('click', async function() {
        try {
            const csrftoken = Cookies.get('csrftoken');
            
            // 현재 유저의 정보를 API를 통해 받아옴
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
                    console.log(result.message);
                }
            }
        } catch (error) {
            console.error(error);
        }
    });
}

// logout 버튼 클릭시 이벤트 등록, 로그아웃 후 홈 화면 새롭게 렌더링
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
                const data = await response.json();
                alert(data.message);
                router();
            } else {
                const error = await response.json();
                alert(error.message);
            }

        } catch (error) {
            console.error('로그아웃 중 오류 발생 : ', error);
        }
    })
}

// home 화면에 login, signup 버튼을 추가
function home_logout_html() {
    return `
        <a href="/#login" class="btn btn-primary">Login</a>
        <a href="/#signup" class="btn btn-primary">Signup</a>
    `;
}

// home 화면에 profile, chatting, tournament, logout 버튼을 추가
function home_login_html() {
    return `
        <a href="/#profile" class="btn btn-primary">My Profile</a>
        <a href="/#chatLobby" class="btn btn-primary">Chatting</a>
        <a href="/#matchlobby" class="btn btn-primary">Tournament</a>
        <button class="btn" id="matchmaking_button">Matchmaking</button>
        <button class="btn" id="logout_button">Logout</button>
    `;
}

// home 화면의 css style을 추가
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
    .buttons-container button {
        border: 2px solid white;
        color: white;
        background-color: transparent;
    }
    .buttons-container button:hover {
        background-color: #555;
    }
    `;
}