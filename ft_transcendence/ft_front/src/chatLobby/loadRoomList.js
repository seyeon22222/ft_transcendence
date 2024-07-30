export async function loadRoomList() {
        const roomListElement = document.getElementById("room_list"); // (room_list) > (roomListElement)
        const csrfToken = Cookies.get('csrftoken'); // (csrftoken) > (csrfToken)

        const roomResponse = await fetch('chat/rooms/', { // (response) > (roomResponse)
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
        });

        if (roomResponse.ok) {
            const responseData = await roomResponse.json(); // (data) > (responseData)
            roomListElement.innerHTML = '';
            responseData.forEach(room => {
                const roomAnchor = document.createElement('a'); // (roomLink) > (roomAnchor)
                roomAnchor.href = `/#chat/${room.slug}`;
                roomAnchor.textContent = room.name;
                roomAnchor.classList.add('room-link', 'block', 'p-2', 'bg-gray-700', 'text-white', 'rounded', 'mb-2', 'hover:bg-gray-600');
                roomAnchor.style.marginLeft = '10px';
                roomAnchor.style.marginRight = '10px';
                roomListElement.appendChild(roomAnchor);
            });
        }
}
