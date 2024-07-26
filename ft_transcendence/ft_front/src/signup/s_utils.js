import { showModal } from "../utilities.js";

export function signUp_event_handler(format) {
    format.addEventListener("submit", async (event) => {
        event.preventDefault();
        const name = document.getElementById("username_input").value;
        const password = document.getElementById("password_input").value;
        const email = document.getElementById("email_input").value;
        const image = document.getElementById("image_input").files[0];
        const csrftoken = Cookies.get('csrftoken');
        
        try {
            const formData = new FormData();
            formData.append('username', name);
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
}