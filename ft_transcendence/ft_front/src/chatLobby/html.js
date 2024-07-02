export function chatLobby_html() {
    return `
    <div class="p-10 lg:p-20">
        <div class="flex justify-between">
            <div class="list_div">
                <h1 class="text-3xl lg:text-6xl text-white" data-translate="room_list">채팅방 목록</h1>
                <div class="w-full flex flex-wrap item-center" id="room_list">
                </div>
            </div>
            <div class="list_div">
                <h1 class="text-3xl lg:text-6xl text-white" data-translate="user_list">유저 목록</h1>
                <div class="w-full flex flex-wrap item-center" id="user_list">
                </div>
            </div>
        </div>
        <div class="text-center">
            <br>
            <h2 class="text-3xl lg:text-6xl text-white" data-translate="create_room">채팅방 만들기</h2>
            <form class="mb-5" id="room_form">
                <input type="text" name="room_name" data-translate-placeholder="room_name" placeholder="새 채팅방 이름" class="w-full mt-2 px-4 py-2 rounded-xl" id="room_name">
                <button type="submit" class="px-5 py-3 rounded-xl text-white bg-teal-800 hover:bg-teal-700" id="create_button" data-translate="create_btn">생성</button>
            </form>
        </div>
    </div>
	<div class="modal_container" id="modal_container">
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
		</div>
    `;
}
