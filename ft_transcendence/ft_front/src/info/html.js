export function select_profile_html() {
    return `
    <div>
        <a h1 href='/#' class="text-white">Home</a>
    </div>
    
    <form class="mb-5" id="profile_form">
        <h1> 유저 정보 </h1>
        <div id="profile-image">프로필 사진</div>
        <br>
        <br>
        <h1>ID</h1>
        <br>
        <h2 name="username" class="w-full mt-2 px-4 py-2" id="username"><h1>
        <br>
        <h1>EMAIL</h1>
        <br>
        <h2 name="email" class="w-full mt-2 px-4 py-2" id="email"><h1>
        <br>
        <h1>게임 스탯</h1>
        <br>
        <h2 class="w-full mt-2 px-4 py-2" id="game_status"></h1>
        <br>
        <h1>최근 매치 정보</h1>
        <br>
        <h2 class="w-full mt-2 px-4 py-2" id="match_info"></h1>
        
        <div>
            <button type="submit" class="px-5 py-3 rounded-xl text-black bg-teal-800 hover:bg-teal-700" id="edit_button">매치 신청</button>
        </div>
    </form>
    `;
}