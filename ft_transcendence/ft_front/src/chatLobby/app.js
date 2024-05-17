import router from "../../base/router.js"

export async function chatLobby_js() {
    let data;
    try {
        const container = document.getElementById("room_list");
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

            container.innerHTML = '';
            // Append data to container
            data.forEach(room => {
                const roomLink = document.createElement('a');
                roomLink.href = `/#chat/${room.slug}`;
                roomLink.textContent = room.name;
                roomLink.classList.add('room-link', 'block', 'p-2', 'bg-gray-700', 'text-white', 'rounded', 'mb-2', 'hover:bg-gray-600');
                roomLink.style.marginLeft = '10px';
                roomLink.style.marginRight = '10px';
                container.appendChild(roomLink);
            });
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
