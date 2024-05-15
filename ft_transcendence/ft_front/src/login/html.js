export function login_html() {
    return `
    <a href="/#" class="btn btn-primary">Home</a>
    <form class="mb-5" id="login_form">
        <input type="text" name="username" placeholder="아이디" class="w-full mt-2 px-4 py-2 rounded-xl" id="username_input">
        <input type="password" name="password" placeholder="비밀번호" class="w-full mt-2 px-4 py-2 rounded-xl" id="password_input">
        <div>
            <button type="submit" class="px-5 py-3 rounded-xl text-white bg-teal-800 hover:bg-teal-700" id="login_button">로그인</button>
            <button type="button" class="px-5 py-3 rounded-xl text-white bg-teal-800 hover:bg-teal-700" id="signup_button">회원가입</button>
        </div>
    </form>
    `;
}