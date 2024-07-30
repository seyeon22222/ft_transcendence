import { recordMessages } from "./chat_func.js";
import { showModal } from "../utilities.js";
import router from "../../base/router.js";

let chatSocket;

export async function setupWebSocket(hash, userData) {
  try {
    if (chatSocket) {
      chatSocket.close();
      chatSocket = null;
    }

    recordMessages(hash);

    const roomName = hash.slice(1); // (room_name) > (roomName)
    document.getElementById("room_name").innerHTML = roomName; // (room_name) > (roomName)

    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:"; // (protocol) > (wsProtocol)
    chatSocket = new WebSocket(
      wsProtocol + // (protocol) > (wsProtocol)
        "//" +
        window.location.host +
        "/ws/privatechat/" +
        roomName + // (room_name) > (roomName)
        "/"
    );

    const csrfToken = Cookies.get("csrftoken"); // (csrftoken) > (csrfToken)
    const userResponse = await fetch("user/info", { // (response) > (userResponse)
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken, // (csrftoken) > (csrfToken)
      },
      credentials: "include",
    });

    if (userResponse.ok) {
      userData = await userResponse.json(); // (data) > (userData)
    } else {
      const error = await userResponse.json();
      console.error("API 요청 실패", error);
    }
    const userName = userData[0].username; // (user_name) > (userName)

    chatSocket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      if (data.message) {
        const currentHash = window.location.hash; // (current_hash) > (currentHash)
        if (currentHash.split("/")[0] !== "#chatprivate" && chatSocket) { // (current_hash) > (currentHash)
          chatSocket.close();
          chatSocket = null;
          return;
        }

        const messagesDiv = document.getElementById("chat-messages"); // (messages_div) > (messagesDiv)
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
        userInfoLink.href = `/#info/${data.username}`; // (userinfo) > (userInfoLink)
        userInfoLink.textContent = data.username; // (userinfo) > (userInfoLink)
        userInfoLink.classList.add(
          "room-link",
          "p-2",
          "bg-gray-700",
          "text-black",
          "rounded",
          "hover:bg-gray-600"
        );

        const messageTextSpan = document.createElement("span"); // (messageText) > (messageTextSpan)
        messageTextSpan.textContent = ": " + data.message; // (messageText) > (messageTextSpan)
        messageTextSpan.classList.add(
          "message-content",
          "p-2",
          "bg-gray-300",
          "text-black",
          "rounded"
        );

        messageWrapperDiv.appendChild(userInfoLink); // (messageWrapper) > (messageWrapperDiv), (userinfo) > (userInfoLink)
        messageWrapperDiv.appendChild(messageTextSpan); // (messageWrapper) > (messageWrapperDiv), (messageText) > (messageTextSpan)
        messagesDiv.appendChild(messageWrapperDiv); // (messages_div) > (messagesDiv), (messageWrapper) > (messageWrapperDiv)
        messagesDiv.scrollTop = messagesDiv.scrollHeight; // (messages_div) > (messagesDiv)
      } else {
        showModal("chatprivate", "nomsg_err");
      }
    };

    const chatFormElement = document.getElementById("chat-form"); // (chatForm) > (chatFormElement)
    chatFormElement.onsubmit = async (event) => { // (chatForm) > (chatFormElement)
      event.preventDefault();

      const messageInputElement = document.getElementById("chat-message-input"); // (messageInputDOM) > (messageInputElement)
      const messageContent = messageInputElement.value; // (message) > (messageContent)

      if (messageContent === "") { // (message) > (messageContent)
        showModal("chatprivate", "nomsg_err");
      } else {
        chatSocket.send(
          JSON.stringify({
            message: messageContent, // (message) > (messageContent)
            username: userName, // (user_name) > (userName)
            room: roomName, // (room_name) > (roomName)
          })
        );
      }

      messageInputElement.value = ""; // (messageInputDOM) > (messageInputElement)
    };
  } catch (error) {
    console.error(error);
  }
}
