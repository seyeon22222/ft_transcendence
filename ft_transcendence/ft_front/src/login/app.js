export function login_js() {
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
                location.href = '/#';
            } else {
                const loginForm = document.getElementById("login_form");

                loginForm.addEventListener("submit", async (event) => {
                event.preventDefault();
                const username = document.getElementById("username_input").value;
                const password = document.getElementById("password_input").value;
                const csrftoken = Cookies.get('csrftoken');

                try {
                    const response = await fetch('user/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': csrftoken,
                        },
                        body: JSON.stringify({username, password})
                    });

                    if (response.ok) {
                        const data = await response.json();
                        alert(data.message);
                        location.href = '/#';
                    }
                    else {
                        const error = await response.json();
                        alert(error.message);
                    }
                } catch (error) {
                    console.error('로그인 요청 중 오류 발생 : ', error);
                }
                
            })
            const signup_button = document.getElementById("signup_button");
            signup_button.addEventListener('click', async function() {
                location.href = "/#signup";
            });
            
            }
        })
    } catch (error) {
        console.error('로그인 여부 확인 중 오류 발생 : ', error);
    }

    

    return null;
}