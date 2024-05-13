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
            if (response.ok) {
                const div_logout = document.getElementById("logout_div");

                const logoutButton = document.createElement("button");
                logoutButton.type = "button";
                logoutButton.className = "btn btn-primary";
                logoutButton.textContent = "Logout";
                
                logoutButton.addEventListener('click', async function() {
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
                            location.href = '/'; // 임시, 수정필요
                        } else {
                            const error = await response.json();
                            alert(error.message);
                        }

                    } catch (error) {
                        console.error('로그아웃 중 오류 발생 : ', error);
                    }
                });

                div_logout.appendChild(logoutButton);
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