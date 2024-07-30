import { chatInit } from "./chatInit.js";
import { websocketManager } from "./websocketManager.js";
import { loginManager } from "./loginManager.js";
import { recordMessage } from "../chat/index.js";

// 메인 함수, 로그인 상태 확인, 스타일 초기화, 메시지 기록 및 WebSocket 설정
export async function chat_js(hash) {
    await loginManager.check_login_status(); // 로그인 상태 확인
    chatInit.initializeChatStyle(); // 스타일 초기화
    await recordMessage(hash); // 메시지 기록 불러오기
    websocketManager.setupWebSocket(hash); // WebSocket 설정 및 이벤트 핸들링
}




/*
변경된 변수 목록
1. `check` > `loginStatus`
2. `style` > `chatStyleSettings`
3. `temp_csrftoken` > `temporaryCsrfToken`
4. `temp_data` > `tempUserData`
5. `req_response` > `userInfoResponse`
6. `req_response_error` > `userInfoResponseError`
7. `room_name` > `chatRoomName`
8. `protocol` > `webSocketProtocol`
9. `csrftoken` > `currentCsrfToken`
10. `response` > `userInfoFetchResponse`
11. `error` > `fetchResponseError`
12. `user_name` > `loggedInUserName`
13. `e` > `eventObj`
14. `isBlocked` > `isUserBlocked`
15. `current_hash` > `currentUrlHash`
16. `messages_div` > `chatMessagesDiv`
17. `messageWrapper` > `messageContainerDiv`
18. `userinfo` > `userProfileLink`
19. `messageText` > `messageContent`
20. `chatForm` > `chatInputForm`
21. `messageInputDOM` > `chatMessageInputDOM`
22. `message` > `chatMessage`
23. `error` > `caughtError`
24. `temp_csrftoken` > `temporaryCsrfToken`
25. `apply_user` > `requestingUser`
26. `accept_user` > `targetUser`
27. `formData` > `blockCheckRequestPayload`
28. `blockResponse` > `blockCheckResponse`
*/