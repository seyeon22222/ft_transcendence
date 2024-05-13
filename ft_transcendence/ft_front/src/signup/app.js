export function signup_js() {
    const signupForm = document.getElementById("signup_form");

    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const username = document.getElementById("username_input").value;
        const password = document.getElementById("password_input").value;
        const email = document.getElementById("email_input").value;
        const csrftoken = Cookies.get('csrftoken');

        try {
            const response = await fetch('user/sign_up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify({username, password, email})
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
            console.error('회원가입 요청 중 오류 발생 : ', error);
        }
    })

    return null;
}