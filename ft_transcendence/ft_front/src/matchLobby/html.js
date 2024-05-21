export function matchLobby_html() {
    return `
    <a href="/#" class="btn btn-primary">Home</a>
        <div class="p-10 lg:p-20 text-center">
            <h1 class="text-3xl lg:text-6xl text-white">Tournament List</h1>
            <div class="w-full flex flex-wrap item-center" id="tournament_list">
                <!-- 여기에 각 tournament 추가 -->
            </div>
            <div>
                <br>
                <h2 class="text-3xl lg:text-6xl text-white">Create a tournament</h2>
                <form class="mb-5" id="tournament_form">
                    <input type="text" name="tournament_name" placeholder="tournament Name" class="w-full mt-2 px-4 py-2 rounded-xl" id="tournament_name">
                    <button type="submit" class="px-5 py-3 rounded-xl text-white bg-teal-800 hover:bg-teal-700" id="create_button">Create</button>
                </form>
            </div>
        </div>


        <div class="p-10 lg:p-20 text-center">
            <h1 class="text-3xl lg:text-6xl text-white">1:1 Match List</h1>
            <div class="w-full flex flex-wrap item-center" id="match_list">
                <!-- 여기에 각 match 추가 -->
            </div>
        </div>
    `;
}
