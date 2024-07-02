export function matchLobby_html() {
    return `
        <div class="p-10 lg:p-20 text-center">
            <h1 class="text-3xl lg:text-6xl text-white" data-translate="tournament_list">토너먼트 매치</h1>
            <div class="w-full flex flex-wrap item-center" id="tournament_list">
            </div>
            <div>
                <br>
                <h2 class="text-3xl lg:text-6xl text-white" data-translate="create_tournament">토너먼트 만들기</h2>
                <form class="mb-5" id="tournament_form">
                    <input type="text" name="tournament_name" data-translate-placeholder="tournament_name" placeholder="토너먼트 이름" class="w-full mt-2 px-4 py-2 rounded-xl" id="tournament_name" required>
                    <button type="submit" class="px-5 py-3 rounded-xl text-white bg-teal-800 hover:bg-teal-700" id="create_button" data-translate="create_btn">생성</button>
                </form>
            </div>
        </div>


        <div class="p-10 lg:p-20 text-center">
            <h1 class="text-3xl lg:text-6xl text-white" data-translate="two_match_list">2:2 매치</h1>
            <div class="w-full flex flex-wrap item-center" id="multiMatch_list">

            </div>
        </div>


		<br>
		<br>
		<br>
		<br>
		<br>

        <div class="p-10 lg:p-20 text-center">
            <h1 class="text-3xl lg:text-6xl text-white" data-translate="one_match_list">1:1 매치</h1>
            <div class="w-full flex flex-wrap item-center" id="match_list">

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
