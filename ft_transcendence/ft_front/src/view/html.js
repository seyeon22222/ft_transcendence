export function profile_html() {
    return `
    <div>
        <a h1 href='/#' class="text-white">Home</a>
    </div>
    
    <form class="mb-5" id="profile_form">
        <div id="profile-image">프로필 사진</div>
        <input type="text" name="username" class="w-full mt-2 px-4 py-2 rounded-xl" id="username_input">
        <input type="email" name="email" class="w-full mt-2 px-4 py-2 rounded-xl" id="email_input">
        <h1 class="w-full mt-2 px-4 py-2 rounded-xl" id="game_status"></h1>
        <h1 class="w-full mt-2 px-4 py-2 rounded-xl" id="match_info"></h1>
        
        <div>
            <button type="submit" class="px-5 py-3 rounded-xl text-white bg-teal-800 hover:bg-teal-700" id="edit_button">저장</button>
        </div>
    </form>
    `;
}