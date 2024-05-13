export function signup_html() {
    return `
    <form class="mb-5" id="signup_form" enctype="multipart/form-data">
        <input type="text" name="username" placeholder="아이디" class="w-full mt-2 px-4 py-2 rounded-xl" id="username_input">
        <input type="password" name="password" placeholder="비밀번호" class="w-full mt-2 px-4 py-2 rounded-xl" id="password_input">
        <input type="email" name="email" placeholder="이메일" class="w-full mt-2 px-4 py-2 rounded-xl" id="email_input">
        
        이미지 업로드
        <input type="file" name="profile_picture" accept="image/*" class="w-full mt-2 px-4 py-2 rounded-xl" id="image_input">
        <div>
            <button type="submit" class="px-5 py-3 rounded-xl text-white bg-teal-800 hover:bg-teal-700" id="signup_button">회원가입</button>
        </div>
    </form>
    `;
}