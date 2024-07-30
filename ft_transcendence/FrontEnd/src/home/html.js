export function home_html() {
    return `
        <div class="text-center">
            <h1 class="my-4">PING PONG GAME</h1>
            <div class="image-container">
                <img src="../../static/pong.webp" alt="Ping Pong Game Image" class="img-fluid">
            </div>
            <div class="buttons-container" id="buttons-container">
            </div>
        </div>
		<div class="modal" tabindex="-1" style="display: none">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title"></h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="test_button"></button>
					</div>
					<div class="modal-body">
						<p></p>
					</div>
				</div>
			</div>
		</div>
        `;
}

export function home_logout_html() {
    return `
        <a href="/#login" class="btn btn-primary" data-translate="login">로그인</a>
        <a href="/#signup" class="btn btn-primary" data-translate="signup">회원가입</a>
    `;
}

export function home_login_html() {
    return `
        <a href="/#profile" class="btn btn-primary" data-translate="my_profile">내 프로필</a>
        <a href="/#chatLobby" class="btn btn-primary" data-translate="chatting">채팅</a>
        <a href="/#matchlobby" class="btn btn-primary" data-translate="tournament">토너먼트</a>
        <button class="btn" id="ai_button" data-translate="ai_button">AI</button>
        <button class="btn" id="matchmaking_button" data-translate="matchmaking">매치메이킹</button>
        <button class="btn" id="mulmatchmaking_button" data-translate="multimatchmaking">2:2 매치</button>
        <button class="btn" id="logout_button" data-translate="logout">로그아웃</button>
    `;
}