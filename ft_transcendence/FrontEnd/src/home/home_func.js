import router from '../../base/router.js'
import { formatDateTime } from "../info/info_func.js";
import { check_socket } from '../../base/popup.js';
import { showModal } from '../utilities.js';

export function ai_button_eventhandler(button) {
    button.addEventListener('click', async () => {
        location.href = '/#ai';
    });
}

export function matchmaking_button_eventhandler(button) {
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

export function mulmatchmaking_button_eventhandler(button) {
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

export function logout_button_eventhandler(button) {
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
