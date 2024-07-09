import router from "../../base/router.js"
import { check_login, delete_back_show, showModal, event_delete_popstate } from "../utilities.js"

export async function chatLobby_js() {
    delete_back_show();
    event_delete_popstate();
    const style = document.getElementById("style");
    style.innerHTML = set_style();

	setLanguage("chatlobby");
    const check = await check_login();
    if (check === false) {
        location.href = `/#`;
        return;
    }

    let data;
    try {
        const room_list = document.getElementById("room_list");
        const csrftoken = Cookies.get('csrftoken');
        const response = await fetch('chat/rooms/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            credentials: 'include',
        });
        if (response.ok) {
            data = await response.json();
            room_list.innerHTML = '';
            data.forEach(room => {
                const roomLink = document.createElement('a');
                roomLink.href = `/#chat/${room.slug}`;
                roomLink.textContent = room.name;
                roomLink.classList.add('room-link', 'block', 'p-2', 'bg-gray-700', 'text-white', 'rounded', 'mb-2', 'hover:bg-gray-600');
                roomLink.style.marginLeft = '10px';
                roomLink.style.marginRight = '10px';
                room_list.appendChild(roomLink);
            });
        }

        const user_list = document.getElementById("user_list");
        const res = await fetch('info/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            credentials: 'include',
        });

        if (res.ok) {
            data = await res.json();
            user_list.innerHTML = '';
            
            data.forEach(user => {
                const userLink = document.createElement('a');
                userLink.href = `/#info/${user.username}`;
                userLink.textContent = user.username;
                userLink.classList.add('room-link', 'block', 'p-2', 'rounded', 'mb-2', 'hover:bg-gray-600');
                userLink.style.marginLeft = '10px';
                userLink.style.marginRight = '10px';
                user_list.appendChild(userLink);
            })
        }

        const createForm = document.getElementById("room_form");
        createForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const room_name = document.getElementById("room_name").value;

            const formData = new FormData();
            formData.append('room_name', room_name);

            const res = await fetch('chat/rooms/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken,
                },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
				const modal = document.querySelector('.modal');
				const newModal = new bootstrap.Modal(modal);
				const modalBody = document.querySelector('.modal .modal-body p');
				modalBody.innerHTML = `<span>'${data.name}' </span><span data-translate="noti">${window.lang[langNow].chatlobby.noti}</span>`;
				newModal.show();
				modal.addEventListener('hidden.bs.modal', function () {
					router();
				});
            } else {
				showModal('chatlobby', 'err');
            }
        })
    } catch(error) {
        console.error('chatLobby.app Error occurs : ', error);
    }
}

function set_style() {
    return `
    body {
        background-color: #333; /* Dark gray background */
        color: white;
        font-family: 'Noto Sans KR', sans-serif;
    }
    h1 {
        font-size: 3rem; /* Larger font size for the title */
        font-weight: 700; /* Thicker font weight for the title */
        text-align: center; /* Center the title */
        padding: 20px; /* Add padding around the title */
    }
    .image-container {
        text-align: center;
        margin: 20px 0;
    }
    .image-container img {
        max-width: 40%; /* Smaller image size */
        height: auto;
    }

    #room_list, #user_list {
        flex: 1;
        padding: 10px;
    }

    .list_div {
        border: 2px solid white; /* adding outline to divs */
        padding: 10px; /* optional, for spacing */
        margin: 50px; /* optional, for spacing */
        min-width: 200px; /* optional, to ensure a minimum width */
        border-radius: 30px;
    }
    
    #room_form {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    
    input[type="text"] {
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 5px;
    }

    .room-link {
        background-color: teal;
        color: white;
    }
    
    button {
        padding: 10px;
        border-radius: 5px;
        background-color: #ffc107;
        color: white;
        border: none;
        cursor: pointer;
    }
    `;
}
