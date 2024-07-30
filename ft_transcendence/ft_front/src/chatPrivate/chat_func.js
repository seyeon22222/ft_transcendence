import { showModal } from "../utilities.js";

export async function recordMessages(hash) {
  const roomSlug = hash.slice(1); // (slug) > (roomSlug)
  let messageData; // (message_data) > (messageData)
  let fetchResponse; // (response) > (fetchResponse)
  const chatMessagesElement = document.getElementById("chat-messages"); // (recordMessage) > (chatMessagesElement)
  chatMessagesElement.innerHTML = "";
  const csrfToken = Cookies.get("csrftoken"); // (csrftoken) > (csrfToken)

  let tempData; // (temp_data) > (tempData)
  fetchResponse = await fetch(`user/info`, { // (response) > (fetchResponse)
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken, // (csrftoken) > (csrfToken)
    },
    credentials: "include",
  });
  if (fetchResponse.ok) { // (response) > (fetchResponse)
    tempData = await fetchResponse.json(); // (temp_data) > (tempData)
  } else {
    const apiError = await fetchResponse.json(); // (error) > (apiError), (response) > (fetchResponse)
    console.error("API 요청 실패", apiError); // (error) > (apiError)
  }

  const requestBodyData = { // (bodyData) > (requestBodyData)
    username: tempData[0].username, // (temp_data) > (tempData)
    slug: roomSlug, // (slug) > (roomSlug)
  };

  fetchResponse = await fetch(`chat/privaterooms/check/`, { // (response) > (fetchResponse)
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken, // (csrftoken) > (csrfToken)
    },
    body: JSON.stringify(requestBodyData), // (bodyData) > (requestBodyData)
  });

  if (!fetchResponse.ok) { // (response) > (fetchResponse)
    const modalElement = document.querySelector('.modal'); // (modal) > (modalElement)
    showModal('chatprivate', 'notallow_err');
    modalElement.addEventListener('hidden.bs.modal', function () { // (modal) > (modalElement)
      location.href = `/#chatlobby`;
    });
  }

  const messageFetchResponse = await fetch(`chat/privaterooms/${roomSlug}/`, { // (messageResponse) > (messageFetchResponse), (slug) > (roomSlug)
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken, // (csrftoken) > (csrfToken)
    },
    credentials: "include",
  });
  if (messageFetchResponse.ok) { // (messageResponse) > (messageFetchResponse)
    messageData = await messageFetchResponse.json(); // (message_data) > (messageData)

    if (Array.isArray(messageData.messages)) { // (message_data) > (messageData)
      messageData.messages.forEach((chatMessage) => { // (message) > (chatMessage), (message_data) > (messageData)
        const messageWrapperDiv = document.createElement("div"); // (messageWrapper) > (messageWrapperDiv)
        messageWrapperDiv.classList.add(
          "message-wrapper",
          "flex",
          "items-center",
          "mb-2"
        );
        messageWrapperDiv.style.marginLeft = "10px"; // (messageWrapper) > (messageWrapperDiv)
        messageWrapperDiv.style.marginRight = "10px"; // (messageWrapper) > (messageWrapperDiv)

        const userInfoLink = document.createElement("a"); // (userinfo) > (userInfoLink)
        userInfoLink.href = `/#info/${chatMessage.username}`; // (userinfo) > (userInfoLink), (message) > (chatMessage)
        userInfoLink.textContent = chatMessage.username; // (userinfo) > (userInfoLink), (message) > (chatMessage)
        userInfoLink.classList.add(
          "room-link",
          "p-2",
          "bg-gray-700",
          "text-black",
          "rounded",
          "hover:bg-gray-600"
        );

        const messageTextSpan = document.createElement("span"); // (messageText) > (messageTextSpan)
        messageTextSpan.textContent = ": " + chatMessage.content; // (messageText) > (messageTextSpan), (message) > (chatMessage)
        messageTextSpan.classList.add(
          "message-content",
          "p-2",
          "bg-gray-300",
          "text-black",
          "rounded"
        );

        messageWrapperDiv.appendChild(userInfoLink); // (messageWrapper) > (messageWrapperDiv), (userinfo) > (userInfoLink)
        messageWrapperDiv.appendChild(messageTextSpan); // (messageWrapper) > (messageWrapperDiv), (messageText) > (messageTextSpan)

        chatMessagesElement.appendChild(messageWrapperDiv); // (recordMessage) > (chatMessagesElement), (messageWrapper) > (messageWrapperDiv)
      });
    } else {
      console.error("Message data is not an array:", messageData); // (message_data) > (messageData)
    }
  } else {
    const modalElement = document.querySelector('.modal'); // (modal) > (modalElement)
    showModal('chatprivate', 'wrongconnect_err');
    modalElement.addEventListener('hidden.bs.modal', function () { // (modal) > (modalElement)
      location.href = "/#chatlobby";
    });
  }
}
/*
1. `slug` > `roomSlug`
2. `message_data` > `messageData`
3. `response` > `fetchResponse`
4. `recordMessage` > `chatMessagesElement`
5. `csrftoken` > `csrfToken`
6. `temp_data` > `tempData`
7. `error` > `apiError`
8. `bodyData` > `requestBodyData`
9. `modal` > `modalElement`
10. `messageResponse` > `messageFetchResponse`
11. `message` > `chatMessage`
12. `messageWrapper` > `messageWrapperDiv`
13. `userinfo` > `userInfoLink`
14. `messageText` > `messageTextSpan`

*/