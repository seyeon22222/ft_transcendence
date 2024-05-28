import { recordMessages } from "./chat_func.js";
import { check_login } from "../utilities.js"

let chatSocket; // 기존 WebSocket 연결을 추적할 변수

export async function chatPrivate_js(hash) {
  // check login status
  const check = await check_login();
  if (check === false) {
      location.href = `/#`;
      return;
  }

  try {
    if (chatSocket) {
      chatSocket.close();
      chatSocket = null;
    }

    recordMessages(hash);

    const room_name = hash.slice(1);
    document.getElementById("room_name").innerHTML = room_name;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    chatSocket = new WebSocket(
      protocol +
        "//" +
        window.location.host +
        "/ws/privatechat/" +
        room_name +
        "/"
    );

    // get current user's name
    let data;
    const csrftoken = Cookies.get("csrftoken");
    const response = await fetch("user/info", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      credentials: "include",
    });
    if (response.ok) {
      data = await response.json();
    } else {
      const error = await response.json();
      console.error("API 요청 실패", error);
    }
    const user_name = data[0].username;

    chatSocket.onopen = async function (e) {
      console.log("WebSocket connection opened:", e);
    };

    chatSocket.onclose = function (e) {
      console.log("WebSocket connection closed:", e);
    };

    chatSocket.onerror = function (e) {
      console.error("WebSocket error:", e);
    };

    chatSocket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      if (data.message) {
        const messages_div = document.getElementById("chat-messages");
        const messageWrapper = document.createElement("div");
        messageWrapper.classList.add(
          "message-wrapper",
          "flex",
          "items-center",
          "mb-2"
        );
        messageWrapper.style.marginLeft = "10px";
        messageWrapper.style.marginRight = "10px";

        const userinfo = document.createElement("a");
        userinfo.href = `/#info/${data.username}`;
        userinfo.textContent = data.username;
        userinfo.classList.add(
          "room-link",
          "p-2",
          "bg-gray-700",
          "text-black",
          "rounded",
          "hover:bg-gray-600"
        );

        const messageText = document.createElement("span");
        messageText.textContent = ": " + data.message;
        messageText.classList.add(
          "message-content",
          "p-2",
          "bg-gray-300",
          "text-black",
          "rounded"
        );

        messageWrapper.appendChild(userinfo);
        messageWrapper.appendChild(messageText);
        messages_div.appendChild(messageWrapper);
        messages_div.scrollTop = messages_div.scrollHeight;
      } else {
        alert("메시지를 입력하세요");
      }
    };

    const chatForm = document.getElementById("chat-form");
    chatForm.onsubmit = async (event) => {
      event.preventDefault();

      const messageInputDOM = document.getElementById("chat-message-input");
      const message = messageInputDOM.value;

      if (message === "") {
        alert("메시지를 입력하세요");
      } else {
        chatSocket.send(
          JSON.stringify({
            message: message,
            username: user_name,
            room: room_name,
          })
        );
      }

      messageInputDOM.value = "";
    };

    // 홈 버튼 클릭 시 WebSocket 연결 닫기
    const home_button = document.getElementById("home");
    home_button.onclick = (event) => {
      event.preventDefault();
      if (chatSocket) {
        chatSocket.close();
        chatSocket = null;
      }
      location.href = "/#";
    };
  } catch (error) {
    console.log(error);
  }
}
