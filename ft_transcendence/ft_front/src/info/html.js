export function info_html() {
    return `
    <h1 class"my-4 text-center" data-translate="title">유저 프로필</h1>
	<br>
    <div class="userinfo-container">
		<div class="col">
			<div id="profile-image">
			</div>
		</div>
		<div class="col">
			<div class="text_info">
				<h2 style="color: #ffc107;"> ID </h2>
				<h3 name="username" class="w-full mt-2 py-2" id="username"><h3>
				<h2 style="color: #ffc107;"> Email </h2>
				<h3 name="email" class="w-full mt-2 py-2" id="email"><h3>
			</div>
		</div>
    </div>
    <br>
    <br>
    <div class="stat-container">
		<div class="col">
			<div class="gamestat-container">
				<h2 class="my-4" data-translate="game_stat">GAME STAT</h2>
				<div id="game_status">
				</div>
			</div>
		</div>
		<div class="col">
			<div class="match-container">
				<h2 class="my-4" data-translate="match_his">MATCH HISTORY</h2>
				<div id="match_info">
				</div>
			</div>
		</div>
	</div>
    <div class="button-container">
        <div>
            <button class="btn custom-yellow-btn flex-grow-1 me-2 hover:bg-teal-700" id="match_button" data-translate="match_request">매치 신청</button>
        </div>
        <div>
            <button class="btn custom-yellow-btn flex-grow-1 me-2 hover:bg-teal-700" id="chat_button" data-translate="chat">1:1 채팅</button>
        </div>
        <div>
            <button class="btn custom-yellow-btn flex-grow-1 me-2 hover:bg-teal-700" id="block_button" data-translate="chat_block">1:1 채팅 차단</button>
        </div>
        <div>
            <button class="btn custom-yellow-btn flex-grow-1 me-2 hover:bg-teal-700" id="block_release_button" data-translate="chat_unblock">1:1 채팅 차단 해제</button>
        </div>
    </div>
		<div class="modal_container" id="modal_container">
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
	</div>
    `
}
