import { blockManager } from "../chat/blockManager.js";
import { showModal } from "../../utilities.js";

let chatSocket;

export const websocketManager = {
    setupWebSocket: async function (hash) {
        if (chatSocket) {
            chatSocket.close();
            chatSocket = null;
        }
        const chatRoomName = hash.slice(1);
        document.getElementById("room_name").innerHTML = chatRoomName;
        const webSocketProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        chatSocket = new WebSocket(webSocketProtocol + "//" + window.location.host + "/ws/chat/" + chatRoomName + "/");

        // 사용자 정보를 가져오기 위한 요청
        const userInfoFetchResponse = await fetch("user/info", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": Cookies.get("csrftoken"),
            },
            credentials: "include",
        });

        let loggedInUserName;
        if (userInfoFetchResponse.ok) {
            const userInfo = await userInfoFetchResponse.json();
            loggedInUserName = userInfo[0].username;
        } else {
            console.error("Failed to fetch user info");
            return;
        }

        this.setupEventHandlers(chatRoomName, loggedInUserName); // 사용자 이름을 이벤트 핸들러로 전달
    },

    setupEventHandlers: function (chatRoomName, loggedInUserName) {
        chatSocket.onmessage = async function (eventObj) { // WebSocket 메시지 수신 이벤트 핸들러
            const data = JSON.parse(eventObj.data); // 수신 데이터 파싱
            if (data.message) { // 메시지가 있으면 처리
                const currentCsrfToken = Cookies.get("csrftoken"); // CSRF 토큰 가져오기
                const isUserBlocked = await blockManager.checkBlockStatus(loggedInUserName, data.username); // 사용자가 차단되었는지 확인
                if (!isUserBlocked) { // 차단되지 않았으면 메시지 표시
                    const chatMessagesDiv = document.getElementById("chat-messages"); // 채팅 메시지 div 요소 가져오기
                    const messageContainerDiv = document.createElement("div"); // 메시지 컨테이너 div 생성
                    messageContainerDiv.classList.add("message-wrapper", "flex", "items-center", "mb-2");
                    messageContainerDiv.style.marginLeft = "10px";
                    messageContainerDiv.style.marginRight = "10px";
                    const userProfileLink = document.createElement("a"); // 사용자 프로필 링크 생성
                    userProfileLink.href = `/#info/${data.username}`;
                    userProfileLink.textContent = data.username;
                    userProfileLink.classList.add("room-link", "p-2", "bg-gray-700", "text-black", "rounded", "hover:bg-gray-600");
                    const messageContent = document.createElement("span"); // 메시지 내용 span 생성
                    messageContent.textContent = ": " + data.message;
                    messageContent.classList.add("message-content", "p-2", "bg-gray-300", "text-black", "rounded");
                    messageContainerDiv.appendChild(userProfileLink); // 메시지 컨테이너에 사용자 프로필 링크 추가
                    messageContainerDiv.appendChild(messageContent); // 메시지 컨테이너에 메시지 내용 추가
                    chatMessagesDiv.appendChild(messageContainerDiv); // 채팅 메시지 div에 메시지 컨테이너 추가
                    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight; // 스크롤 맨 아래로 이동
                }
            }
        };

        const chatInputForm = document.getElementById("chat-form"); // 채팅 입력 폼 요소 가져오기
        chatInputForm.onsubmit = async (eventObj) => { // 채팅 입력 폼 제출 이벤트 핸들러
            eventObj.preventDefault(); // 기본 동작 방지
            const chatMessageInputDOM = document.getElementById("chat-message-input"); // 채팅 메시지 입력 요소 가져오기
            const chatMessage = chatMessageInputDOM.value; // 입력된 메시지 값 가져오기
            if (chatMessage === "") { // 메시지가 비어 있으면 경고 모달 표시
                showModal('chat', 'nomsg_err');
            } else { // 메시지가 있으면 WebSocket을 통해 전송
                const currentCsrfToken = Cookies.get("csrftoken");
                chatSocket.send(JSON.stringify({
                    message: chatMessage,
                    username: loggedInUserName, // 전송할 메시지에 사용자 이름 추가
                    room: chatRoomName,
                }));
            }
            chatMessageInputDOM.value = ""; // 입력 필드 초기화
        };
    }
};
