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
        <h1 class="text-3xl lg:text-6xl text-white">Friend List</h1>

            <div class="w-full flex flex-wrap item-center" id="room_list">
                <!-- 여기에 각 room 추가 -->
            </div>
            <div>
                <br>
                <h2 class="text-3xl lg:text-6xl text-white">Create a new room</h2>
                <form class="mb-5" id="room_form">
                    <input type="text" name="room_name" placeholder="Room Name" class="w-full mt-2 px-4 py-2 rounded-xl" id="room_name">
                    <button type="submit" class="px-5 py-3 rounded-xl text-white bg-teal-800 hover:bg-teal-700" id="create_button">Create</button>
                </form>
            </div>
        <div>
            <button type="submit" class="px-5 py-3 rounded-xl text-white bg-teal-800 hover:bg-teal-700" id="edit_button">저장</button>
        </div>
    </form>
    `;
}