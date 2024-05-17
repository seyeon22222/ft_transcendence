export async function recordMessage(hash) {
    const room_name_temp = hash.slice(1);
    let message_data;
    const recordMessage = document.getElementById("chat-messages");
    recordMessage.innerHTML = ''; // 이전 메시지 초기화
    const temp_csrftoken = Cookies.get('csrftoken');
    const messageResponse = await fetch(`chat/rooms/${room_name_temp}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': temp_csrftoken,
        },
        credentials: 'include',
    });
    if (messageResponse.ok) {
        message_data = await messageResponse.json();

        if (Array.isArray(message_data.messages)) {
            message_data.messages.forEach(message => {
                const messageWrapper = document.createElement('div');
                messageWrapper.classList.add('message-wrapper', 'flex', 'items-center', 'mb-2');
                messageWrapper.style.marginLeft = '10px';
                messageWrapper.style.marginRight = '10px';

                const userinfo = document.createElement('a');
                userinfo.href = `/#info/${message.username}`;
                userinfo.textContent = message.username;
                userinfo.classList.add('room-link', 'p-2', 'bg-gray-700', 'text-black', 'rounded', 'hover:bg-gray-600');

                const messageText = document.createElement('span');
                messageText.textContent = ": " + message.content;
                messageText.classList.add('message-content', 'p-2', 'bg-gray-300', 'text-black', 'rounded');

                messageWrapper.appendChild(userinfo);
                messageWrapper.appendChild(messageText);

                recordMessage.appendChild(messageWrapper);
            });
        } else {
            console.error("Message data is not an array:", message_data);
        }
    } else {
        const error = await messageResponse.json();
        console.error("API error", error);
    }
}
