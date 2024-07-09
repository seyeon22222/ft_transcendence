import { showModal, event_delete_popstate } from "../utilities.js";

export function signup_js() {
    event_delete_popstate();
    const style = document.getElementById("style");
    style.innerHTML = `
    body {
        background-color: #333; /* Dark gray background */
        color: white;
        font-family: 'Noto Sans KR', sans-serif;
    }
    .custom-yellow-btn {
        background-color: #ffc107;
        color: white;
    }
    .narrow-card {
        max-width: 400px; /* Adjust this value to make the box narrower or wider */
    }
    .center-text { text-align: center; }
    .spacing {
        margin-top: 3rem; /* Adjust the value as needed for desired spacing */
    }
	.modal {
		color: black;
		display: none;
	}
    `;

    const signupForm = document.getElementById("signup_form");
	setLanguage("signup");

    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const username = document.getElementById("username_input").value;
        const password = document.getElementById("password_input").value;
        const email = document.getElementById("email_input").value;
        const image = document.getElementById("image_input").files[0];
        const csrftoken = Cookies.get('csrftoken');
		const langNow = document.getElementById('languageSelector').value;
        
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            formData.append('email', email);
            formData.append('profile_picture', image);

            const response = await fetch('user/sign_up', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken,
                },
                body: formData
            });

            if (response.ok) {
				const modal = document.querySelector('.modal');
				showModal('signup', 'noti');
				modal.addEventListener('hidden.bs.modal', function () {
					location.href = '/#';
				});
			}
            else {
				showModal('signup', 'err');
			}
        } catch (error) {
            console.error('회원가입 요청 중 오류 발생 : ', error);
        }
    })

    return null;
}
