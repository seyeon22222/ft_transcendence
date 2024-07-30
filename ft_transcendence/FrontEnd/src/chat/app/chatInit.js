import { chat_style } from "../../static/chat_css.js";
import { setTextsbyLang } from "../../language/language.js";

// 채팅 스타일 초기화 기능
export const chatInit = {
    initializeChatStyle: function () {
        const chatStyleSettings = document.getElementById("style"); // 스타일 설정 요소 가져오기
        chatStyleSettings.innerHTML = chat_style(); // 스타일 적용
        setTextsbyLang('chat'); // 언어 설정
    }
};
