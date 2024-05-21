export function chatLobby_html() {
    return `
        <a href="/#" class="btn btn-primary">Home</a>
        <div class="p-10 lg:p-20 text-center">
            <h1 class="text-3xl lg:text-6xl text-white">Room List</h1>
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
            <h1 class="text-3xl lg:text-6xl text-white">User List</h1>
            <div class="w-full flex flex-wrap item-center" id="user_list">
                <!-- 여기에 각 user link 추가 -->
            </div>
        </div>
    `;
}