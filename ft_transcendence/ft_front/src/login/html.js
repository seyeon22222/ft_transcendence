export function login_html() {
    return `
    <div class="row justify-content-center py-5">
        <div class="col-md-4">
            <h1 class="mb-3 fw-bold center-text">LOGIN</h1>
            <div class="card p-4 narrow-card">
                <form id="login_form">
                    <div class="mb-3">
                        <label for="username_input" class="form-label">ID</label>
                        <input type="text" class="form-control" name="username" id="username_input" data-translate-placeholder="id" placeholder="아이디">
                    </div>
                    <div class="mb-3">
                        <label for="password_input" class="form-label">Password</label>
                        <input type="password" class="form-control" id="password_input" data-translate-placeholder="password" placeholder="비밀번호">
                    </div>
                    <div class="d-grid gap-2 d-md-flex justify-content-md-evenly spacing">
                        <button class="btn custom-yellow-btn flex-grow-1 me-2" id="login_button" data-translate="login">로그인</button>
                    </div>
                </form>
            </div>
            <div class="text-center mt-4">
                <a href="/#signup" class="text-decoration-none me-2" data-translate="signup">회원가입</a>|
                <a href="/#" class="text-decoration-none ms-2" data-translate="home">홈으로</a>
            </div>
        </div>
    </div>
    `
}
