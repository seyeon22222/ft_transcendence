export function chatPrivate_html() {
    return `
        <div class="p-10 lg:p-20 text-center">
            <h1 class="text-3xl lg:text-6xl" id="room_name"></h1>
        </div>

        <div class="lg:w-2/4 mx-4 lg:mx-auto p-4 bg-white rounded-xl">
            <div class="chat-messages space-y-3 text-black" id="chat-messages">
            </div>
        </div>

        <div class="lg:w-2/4 mt-6 mx-4 lg:mx-auto p-4 bg-white rounded-xl">
            <form class="flex" id="chat-form">
                <input type="text" name="content" class="flex-1 mr-3 text-color=black" data-translate-placeholder="msg" placeholder="메세지를 입력하세요" id="chat-message-input">
                <button type="submit" class="px-5 py-3 rounded-xl text-white bg-teal-600 hover:bg-teal-700" id="chat-message-button" data-translate="submit">전송</button>
            </form>
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
