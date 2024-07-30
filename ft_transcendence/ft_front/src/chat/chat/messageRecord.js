import { blockManager } from "./blockManager.js";

// 메시지 기록 관리 기능
export const messageRecord = {
    clearMessages: function () {
        const chatMessagesDiv = document.getElementById("chat-messages"); // 채팅 메시지 div 요소 가져오기
        chatMessagesDiv.innerHTML = ""; // 기존 메시지 초기화
    },
    loadMessages: async function (chatRoomName) {
        const chatMessageResponse = await fetch(`chat/rooms/${chatRoomName}`, { // 채팅방 메시지 요청
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": Cookies.get("csrftoken"), // CSRF 토큰 설정
            },
            credentials: "include",
        });
        let temp_data;
        const userInfoResponse = await fetch(`user/info`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": Cookies.get("csrftoken"),
            },
            credentials: "include",
          });
          if (userInfoResponse.ok) {
            temp_data = await userInfoResponse.json();
          } else {
            const error = await userInfoResponse.json();
            console.error("API 요청 실패", error);
          }

        if (chatMessageResponse.ok) {
            const messageData = await chatMessageResponse.json(); // 메시지 데이터 파싱
            if (Array.isArray(messageData.messages)) { // 메시지 데이터가 배열인지 확인
                for (const chatMessage of messageData.messages) {
                    const isUserBlocked = await blockManager.checkBlockStatus(temp_data[0].username, chatMessage.username); // 사용자가 차단되었는지 확인
                    if (!isUserBlocked) { // 차단되지 않았으면 메시지 표시
                        const chatMessagesDiv = document.getElementById("chat-messages");
                        const messageContainerDiv = document.createElement("div"); // 메시지 컨테이너 div 생성
                        messageContainerDiv.classList.add("message-wrapper", "flex", "items-center", "mb-2");
                        messageContainerDiv.style.marginLeft = "10px";
                        messageContainerDiv.style.marginRight = "10px";
                        const userProfileLink = document.createElement("a"); // 사용자 프로필 링크 생성
                        userProfileLink.href = `/#info/${chatMessage.username}`;
                        userProfileLink.textContent = chatMessage.username;
                        userProfileLink.classList.add("room-link", "p-2", "bg-gray-700", "text-black", "rounded", "hover:bg-gray-600");
                        const messageContent = document.createElement("span"); // 메시지 내용 span 생성
                        messageContent.textContent = ": " + chatMessage.content;
                        messageContent.classList.add("message-content", "p-2", "bg-gray-300", "text-black", "rounded");
                        messageContainerDiv.appendChild(userProfileLink); // 메시지 컨테이너에 사용자 프로필 링크 추가
                        messageContainerDiv.appendChild(messageContent); // 메시지 컨테이너에 메시지 내용 추가
                        chatMessagesDiv.appendChild(messageContainerDiv); // 채팅 메시지 div에 메시지 컨테이너 추가
                    }
                }
            } else {
                console.error("Message data is not an array:", messageData); // 메시지 데이터가 배열이 아니면 에러 출력
            }
        } else {
            const userInfoResponseError = await chatMessageResponse.json(); // 에러 메시지 파싱
            console.error("API error", userInfoResponseError); // 에러 출력
        }
    }
};
