import { recordMessage } from "./chat_func.js";
import { check_login } from "../utilities.js"

let chatSocket; // 기존 WebSocket 연결을 추적할 변수
export async function chat_js(hash) {
  // check login status
  const check = await check_login();
  if (check === false) {
      location.href = `/#`;
      return;
  }

  //seycheon_block
  const temp_csrftoken = Cookies.get("csrftoken");
  let temp_data;
  const req_response = await fetch(`user/info`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": temp_csrftoken,
    },
    credentials: "include",
  });
  if (req_response.ok) {
    temp_data = await req_response.json();
  } else {
    const error = await req_response.json();
    console.error("API 요청 실패", error);
  }
  //-----------------------
  recordMessage(hash);
  try {
    if (chatSocket) {
      chatSocket.close();
      chatSocket = null;
    }

    const room_name = hash.slice(1);
    document.getElementById("room_name").innerHTML = room_name;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    chatSocket = new WebSocket(
      protocol + "//" + window.location.host + "/ws/chat/" + room_name + "/"
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

    chatSocket.onmessage = async function (e) {
      //seycheon_block async 추가
      const data = JSON.parse(e.data);

      if (data.message) {
        //seycheon_block
        const isBlocked = await checkBlockStatus(
          temp_data[0].username,
          data.username,
          csrftoken
        );
        if (!isBlocked) {
          //-----------------------
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
      }
    }; //seycheon_block

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

// seycheon_block 차단 여부를 확인하는 함수
async function checkBlockStatus(apply_user, accept_user, temp_csrftoken) {
  const formData = {
    apply_user: apply_user,
    accept_user: accept_user,
  };
  const blockResponse = await fetch("/user/block_check_request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": temp_csrftoken,
    },
    body: JSON.stringify(formData),
  });

  if (blockResponse.ok) {
    return false; // 차단 여부 반환
  } else {
    console.error("Block check API error");
    return true; // API 요청 실패 시 차단으로 간주
  }
}
//-----------------------
