export async function recordMessages(hash) {
  const slug = hash.slice(1);
  let message_data;
  let response;
  const recordMessage = document.getElementById("chat-messages");
  recordMessage.innerHTML = ""; // 이전 메시지 초기화
  const csrftoken = Cookies.get("csrftoken");

  // get current user name
  let temp_data;
  response = await fetch(`user/info`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    credentials: "include",
  });
  if (response.ok) {
    temp_data = await response.json();
  } else {
    const error = await response.json();
    console.error("API 요청 실패", error);
  }

  // check current chatting room is for user
  const bodyData = {
    username: temp_data[0].username,
    slug: slug,
  };

  response = await fetch(`chat/privaterooms/check/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(bodyData),
  });

  console.log("test for response!!!");

  if (!response.ok) {
    alert("Your are not allowed to see this private message channel");
    location.href = `/#chatlobby`;
  }

  // get previous messages
  const messageResponse = await fetch(`chat/privaterooms/${slug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    credentials: "include",
  });
  if (messageResponse.ok) {
    message_data = await messageResponse.json();

    if (Array.isArray(message_data.messages)) {
      message_data.messages.forEach((message) => {
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
      });
    } else {
      console.error("Message data is not an array:", message_data);
    }
  } else {
    const error = await messageResponse.json();
    console.error("API error", error);
    alert("채팅방에 대한 잘못된 접근입니다");
    location.href = "/#chatlobby";
  }
}
