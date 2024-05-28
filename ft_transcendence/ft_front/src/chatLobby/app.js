import router from "../../base/router.js"
import { check_login } from "../utilities.js"

export async function chatLobby_js() {
    // check login status
    const check = await check_login();
    if (check === false) {
        location.href = `/#`;
        return;
    }

    let data;
    try {
        const room_list = document.getElementById("room_list");
        const csrftoken = Cookies.get('csrftoken');

        // get room list from backend API
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
            // Append data to room_list
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
        // get user list from backend API
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
                userLink.classList.add('room-link', 'block', 'p-2', 'bg-gray-700', 'text-white', 'rounded', 'mb-2', 'hover:bg-gray-600');
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
                alert(`Room ${data.name} is created!`);
                // location.href = '/#chatLobby';
                router();
            } else {
                const data = await res.json();
                alert(data.error);
            }
        })


    } catch(error) {
        console.error('chatLobby.app Error occurs : ', error);
    }
}
