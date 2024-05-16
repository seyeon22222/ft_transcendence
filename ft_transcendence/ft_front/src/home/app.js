import { login_view } from './home_login.js'
import router from '../../base/router.js'

export function home_js() {
    const csrftoken = Cookies.get('csrftoken');

    try {
        fetch('user/check_login', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
        })
        .then(response => {
            if (response.status === 200) {
                const div = document.getElementById('login_view');
                div.innerHTML = login_view();

                const logoutButton = document.getElementById('logout_button');
                logout_button(logoutButton, csrftoken);
                const profileButton = document.getElementById('userProfileBtn');
                profileButton.addEventListener('click', async function() {
                    location.href = "/#profile";
                });

                const joinChatButton = document.getElementById('joinChatButton');
                joinChatButton.addEventListener('click', async function() {
                    location.href = "/#chatLobby";
                })

            } else {
                const div_login = document.getElementById("login_div");
                const loginLink = document.createElement("a");
                loginLink.href = "/#login";
                loginLink.className = "btn btn-primary";
                loginLink.textContent = "Login";
                div_login.appendChild(loginLink);

                const div_signup = document.getElementById("signup_div");
                const signupLink = document.createElement("a");
                signupLink.href = "/#signup";
                signupLink.className = "btn btn-primary";
                signupLink.textContent = "Signup";
                div_signup.appendChild(signupLink);
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

// function profileView() {
//     const 
// }