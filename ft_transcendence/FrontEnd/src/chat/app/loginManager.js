import { check_login } from "../../utilities.js";

// 로그인 상태 확인 기능
export const loginManager = {
    check_login_status: async function () {
        const loginStatus = await check_login(); // 로그인 상태 확인
        if (loginStatus === false) {
            location.href = `/#`; // 로그인되지 않았으면 리다이렉트
            return false;
        }
        return true;
    }
};
