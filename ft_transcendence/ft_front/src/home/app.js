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
                console.log("asdasd");
                const div = document.getElementById('login_view');
                div.innerHTML = login_view();

                const button = document.getElementById('logout_button');

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
                            // location.href = '/#';
                            router();
                        } else {
                            const error = await response.json();
                            alert(error.message);
                        }

                    } catch (error) {
                        console.error('로그아웃 중 오류 발생 : ', error);
                }})

            } else {
                console.log('qweqweqw');
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
