export function signup_html() {
    return `
    <a href="/#" class="btn btn-primary">Home</a>
    <form class="mb-5" id="signup_form" enctype="multipart/form-data">
        <br>
        <label for="username_input" class="form-label">ID</label>
        <br>
        <input type="text" name="username" placeholder="아이디" class="w-full mt-2 px-4 py-2 rounded-xl" id="username_input">
        <br>
        <label for="password_input" class="form-label">PASSWORD</label>
        <br>
        <input type="password" name="password" placeholder="비밀번호" class="w-full mt-2 px-4 py-2 rounded-xl" id="password_input">
        <br>
        <label for="email_input" class="form-label">EMAIL</label>
        <br>
        <input type="email" name="email" placeholder="이메일" class="w-full mt-2 px-4 py-2 rounded-xl" id="email_input">
        <br>
        <label for="image_input" class="form-label">PROFILE IMAGE</label>
        <br>
        <input type="file" name="profile_picture" accept="image/*" class="w-full mt-2 px-4 py-2 rounded-xl" id="image_input">
        <div>
            <button type="submit" class="px-5 py-3 rounded-xl text-white bg-teal-800 hover:bg-teal-700" id="signup_button">회원가입</button>
        </div>
    </form>
    `;
}