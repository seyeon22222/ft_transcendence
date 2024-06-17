export function home_html() {
    return `
        <div class="text-center">
            <h1 class="my-4">PING PONG GAME</h1>
            <div class="image-container">
                <img src="../../static/pong.webp" alt="Ping Pong Game Image" class="img-fluid">
            </div>
            <div class="buttons-container" id="buttons-container">
            </div>
        </div>
		<div class="modal_container" id="modal_container">
			<div class="modal" tabindex="-1" style="display: none">
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
