export function profile_html() {
    return `
    <div>
        <a h1 href='/#' class="text-white">Home</a>
    </div>
    <h1 class="my-4 text-center">USER INFORMATION</h1>
    <div class="userinfo-container">
        <div id="profile-image">
        </div>
        <div class="input-container">
            <form id="profile_form">
                <div class="mb-3">
                    <label for="new_image_input" class="form-label">사진 변경</label>
                    <input type="file" accept="image/*" id="new_image_input" class="form-control">
                </div>
                <div class="mb-3">
                    <label for="username_input" class="form-label">ID 변경</label>
                    <input type="text" name="username" class="form-control" id="username_input">
                </div>
                <div class="mb-3">
                    <label for="email_input" class="form-label">Email 변경</label>
                    <input type="email" name="email" class="form-control" id="email_input">
                </div>
                <div class="d-grid gap-2 d-md-flex justify-content-md-evenly spacing">
                    <button type="submit" class="btn custom-yellow-btn flex-grow-1 me-2" id="edit_button">변경사항 저장</button>
                </div>
            </form>
        </div>
    </div>
    <br>
    <br>
    <div class="gamestat-container">
        <h2 class="my-4">GAME STAT</h2>
        <div id="game_status">
        </div>
    </div>
    <div class="match-container">
        <h2 class="my-4">MATCH HISTORY</h2>
        <div id="match_info">
        </div>
    </div>
    <div>
        <h2 class="my-4">1:1 Match List</h2>
        <div id="1:1_Match_List">
        </div>
    </div>
    `;
}