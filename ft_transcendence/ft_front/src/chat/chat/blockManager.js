
// 사용자 차단 상태 확인 기능
export const blockManager = {
    checkBlockStatus: async function (requestingUser, targetUser) {

        const blockCheckRequestPayload = {
            apply_user: requestingUser, // 차단 요청자
            accept_user: targetUser, // 차단 대상자
        };

        const blockCheckResponse = await fetch("/user/block_check_request", { // 차단 상태 확인 요청
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": Cookies.get("csrftoken"), // CSRF 토큰 설정
            },
            body: JSON.stringify(blockCheckRequestPayload), // 요청 페이로드 설정
        });

        if (blockCheckResponse.ok) {
            return false; // 차단되지 않음
        } else {
            const errorData = await blockCheckResponse.json(); // 서버에서 반환한 에러 메시지 파싱
            return true; // 차단됨
        }
    }
};
