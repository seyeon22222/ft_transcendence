export function profile_html() {
    return `
	<h1 class="my-4 text-center" data-translate="title">유저 프로필</h1>
	<br>
    <div class="userinfo-container">
		<div class="col">
			<div id="profile-image">
			</div>
		</div>
		<div class="col">
			<div class="input-container">
				<form id="profile_form">
					<div class="mb-3">
						<label for="new_image_input" class="form-label" data-translate="change_pic">사진 변경</label>
						<input type="file" accept="image/*" id="new_image_input" class="form-control">
					</div>
					<div class="mb-3">
						<label for="username_input" class="form-label" data-translate="change_id">ID 변경</label>
						<input type="text" name="username" class="form-control" id="username_input">
					</div>
					<div class="mb-3">
						<label for="email_input" class="form-label" data-translate="change_email">이메일 변경</label>
						<input type="email" name="email" class="form-control" id="email_input">
					</div>
					<div class="d-grid gap-2 d-md-flex justify-content-md-evenly spacing">
						<button type="submit" class="btn custom-yellow-btn flex-grow-1" id="edit_button" data-translate="save_changes">변경사항 저장</button>
					</div>
				</form>
			</div>
		</div>
    </div>
    <br>
    <br>
	<div class="stat-container">
		<div class="col">
			<div class="gamestat-container">
				<h2 class="my-4" data-translate="game_stat">게임 스탯</h2>
				<div id="game_status">
				</div>
			</div>
		</div>
		<div class="col">
			<div class="match-container">
				<h2 class="my-4" data-translate="match_his">매치 히스토리</h2>
				<div id="match_info">
				</div>
			</div>
		</div>
	</div>
    <div>
        <h2 class="my-4" data-translate="match_list">1:1 매치 초대</h2>
        <div id="1:1_Match_List">
        </div>
    </div>
	
	<div class="modal" tabindex="-1" style="display: none; color: black;">
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
