export function profile_html() {
    return `
    <div>
        <a h1 href='/#' class="text-white">Home</a>
    </div>
    
    <form class="mb-5" id="profile_form">
        <h1> 유저 정보 </h1>
        <div id="profile-image">프로필 사진</div>
        <br>
        <label for="username_input" class="form-label">ID</label>
        <br>
        <input type="text" name="username" class="w-full mt-2 px-4 py-2 rounded-xl" id="username_input">
        <br>
        <label for="email_input" class="form-label">Email</label>
        <br>
        <input type="email" name="email" class="w-full mt-2 px-4 py-2 rounded-xl" id="email_input">
        <br>
        <label for="gamestat" class="form-label">게임 스탯</label>
        <h1 class="w-full mt-2 px-4 py-2 rounded-xl" id="game_status"></h1>
        <br>
        <label for="matchresult" class="form-label">최근 매치 결과</label>
        <h1 class="w-full mt-2 px-4 py-2 rounded-xl" id="match_info"></h1>
        
        <div>
            <button type="submit" class="px-5 py-3 rounded-xl text-white bg-teal-800 hover:bg-teal-700" id="edit_button">저장</button>
        </div>
    </form>
    `;
}