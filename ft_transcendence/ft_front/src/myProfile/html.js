export function profile_html() {
    return `
	<h1 class="my-4 text-center">USER INFORMATION</h1>
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
						<label for="email_input" class="form-label" data-translate="change_email">Email 변경</label>
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
				<h2 class="my-4">GAME STAT</h2>
				<div id="game_status">
				</div>
			</div>
		</div>
		<div class="col">
			<div class="match-container">
				<h2 class="my-4">MATCH HISTORY</h2>
				<div id="match_info">
				</div>
			</div>
		</div>
	</div>
    <div>
        <h2 class="my-4">1:1 Match List</h2>
        <div id="1:1_Match_List">
        </div>
    </div>
    `;
}
