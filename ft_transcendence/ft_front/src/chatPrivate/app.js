import { recordMessages } from "./chat_func.js";
import { check_login, showModal } from "../utilities.js"

let chatSocket; // 기존 WebSocket 연결을 추적할 변수

export async function chatPrivate_js(hash) {
  // check login status
  const check = await check_login();
  if (check === false) {
      location.href = `/#`;
      return;
  }

  // get current private room's two username
  const slug = hash.slice(1);
  const csrftoken = Cookies.get("csrftoken");
  let data;
  const response = await fetch(`chat/privaterooms/getusers/${slug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    credentials: "include",
  });

  if (response.ok) {
    data = await response.json();
    const user1 = data.user1;
    const user2 = data.user2;

    // check user is not blocked
    const formData = {
      apply_user: user1,
      accept_user: user2,
    };

    const block_response = await fetch(`/user/block_check_request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(formData),
    });

    if (block_response.status !== 200) {
		// alert("상대방이 차단한 사용자입니다.");
		const modal = document.querySelector('.modal');
		showModal('chatprivate', 'isblock_err');
		modal.addEventListener('hidden.bs.modal', function () {
			location.href = `/#`;
			return;
		});
    }

  } else {
    console.error("ERROR : cannot get user info from slug");
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
		showModal('chatprivate', 'nomsg_err');
      }
    };

    const chatForm = document.getElementById("chat-form");
    chatForm.onsubmit = async (event) => {
      event.preventDefault();

      const messageInputDOM = document.getElementById("chat-message-input");
      const message = messageInputDOM.value;

      if (message === "") {
        showModal('chatprivate', 'nomsg_err');
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
    // const home_button = document.getElementById("home");
    // home_button.onclick = (event) => {
    //   event.preventDefault();
    //   if (chatSocket) {
    //     chatSocket.close();
    //     chatSocket = null;
    //   }
    //   location.href = "/#";
    // };
  } catch (error) {
    console.log(error);
  }
}
