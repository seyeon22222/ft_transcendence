import { login_view } from './home_login.js'
import router from '../../base/router.js'

export function home_js() {
    // set style
    const style = document.getElementById("style");
    style.innerHTML = `
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

    try {
        const csrftoken = Cookies.get('csrftoken');
        fetch('user/check_login', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
        })
        .then(response => {
            if (response.status === 200) {
                const container = document.getElementById("buttons-container");
                container.innerHTML = home_login_html();

                const logoutButton = document.getElementById('logout_button');
                logout_button(logoutButton, csrftoken);
            } else {
                const container = document.getElementById("buttons-container");
                container.innerHTML = home_logout_html();
            }
        })
    } catch (error) {
        console.error('로그인 여부 확인 중 오류 발생 : ', error);
    }

    return null;
}

function logout_button(button, csrftoken) {
    button.addEventListener('click', async function() {
        try {
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
    }})
}

function home_logout_html() {
    return `
        <a href="/#login" class="btn btn-primary">Login</a>
        <a href="/#signup" class="btn btn-primary">Signup</a>
    `;
}

function home_login_html() {
    return `
        <a href="/#profile" class="btn btn-primary">My Profile</a>
        <a href="/#chatLobby" class="btn btn-primary">Chatting</a>
        <button class="btn" id="logout_button">Logout</button>
    `;
}