export async function loadUserList() {
        const userListElement = document.getElementById("user_list"); // (user_list) > (userListElement)
        const csrfToken = Cookies.get('csrftoken'); // (csrftoken) > (csrfToken)

        const userResponse = await fetch('info/', { // (res) > (userResponse)
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
        });

        if (userResponse.ok) {
            const responseData = await userResponse.json(); // (data) > (responseData)
            userListElement.innerHTML = '';
            
            responseData.forEach(user => {
                const userAnchor = document.createElement('a'); // (userLink) > (userAnchor)
                userAnchor.href = `/#info/${user.username}`;
                userAnchor.textContent = user.username;
                userAnchor.classList.add('room-link', 'block', 'p-2', 'rounded', 'mb-2', 'hover:bg-gray-600');
                userAnchor.style.marginLeft = '10px';
                userAnchor.style.marginRight = '10px';
                userListElement.appendChild(userAnchor);
            });
        }
}
