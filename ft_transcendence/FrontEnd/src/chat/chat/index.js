import { messageRecord } from "./messageRecord.js";

// 메시지 기록 로직
export async function recordMessage(urlHash) {
    const chatRoomName = urlHash.slice(1); // 채팅방 이름 추출
    messageRecord.clearMessages(); // 메시지 기록 초기화
    await messageRecord.loadMessages(chatRoomName); // 메시지 불러오기
}




/* 
변경된 변수들 목록
1. `hash` > `urlHash`
2. `room_name_temp` > `chatRoomName`
3. `message_data` > `messageData`
4. `temp_data` > `tempUserData`
5. `recordMessage` > `chatMessagesDiv`
6. `temp_csrftoken` > `temporaryCsrfToken`
7. `messageResponse` > `chatMessageResponse`
8. `req_response` > `userInfoResponse`
9. `error` > `userInfoResponseError`
10. `message` > `chatMessage`
11. `isBlocked` > `isUserBlocked`
12. `messageWrapper` > `messageContainerDiv`
13. `userinfo` > `userProfileLink`
14. `messageText` > `messageContent`
15. `apply_user` > `requestingUser`
16. `accept_user` > `targetUser`
17. `formData` > `blockCheckRequestPayload`
18. `blockResponse` > `blockCheckResponse`

*/