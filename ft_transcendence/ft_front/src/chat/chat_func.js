export async function recordMessage(hash) {
  const room_name_temp = hash.slice(1);
  let message_data;
  let temp_data;
  const recordMessage = document.getElementById("chat-messages");
  recordMessage.innerHTML = ""; // 이전 메시지 초기화
  const temp_csrftoken = Cookies.get("csrftoken");
  const messageResponse = await fetch(`chat/rooms/${room_name_temp}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": temp_csrftoken,
    },
    credentials: "include",
  });

  //seycheon_block
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
  if (messageResponse.ok) {
    message_data = await messageResponse.json();

    if (Array.isArray(message_data.messages)) {
      for (const message of message_data.messages) {
        //seycheon_block
        const isBlocked = await checkBlockStatus(
          //seycheon_block
          temp_data[0].username,
          message.username,
          temp_csrftoken
        );
        if (isBlocked == false) {
          //seycheon_block
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
          userinfo.href = `/#info/${message.username}`;
          userinfo.textContent = message.username;
          userinfo.classList.add(
            "room-link",
            "p-2",
            "bg-gray-700",
            "text-black",
            "rounded",
            "hover:bg-gray-600"
          );

          const messageText = document.createElement("span");
          messageText.textContent = ": " + message.content;
          messageText.classList.add(
            "message-content",
            "p-2",
            "bg-gray-300",
            "text-black",
            "rounded"
          );
          messageWrapper.appendChild(userinfo);
          messageWrapper.appendChild(messageText);
          recordMessage.appendChild(messageWrapper);
        }
      }
    } else {
      console.error("Message data is not an array:", message_data);
    }
  } else {
    const error = await messageResponse.json();
    console.error("API error", error);
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
    // console.error("Block check API error");
    return true; // API 요청 실패 시 차단으로 간주
  }
}
//-----------------------
