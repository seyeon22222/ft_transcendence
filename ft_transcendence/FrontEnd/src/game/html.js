export function game_html() {
    return `
	<link rel="stylesheet" href="../src/static/game.css">
	<div>
	  <p id="game-score">0:0</p>
	</div>
	<div class="game-container">
	  <canvas id="canvas"></canvas>
	</div>
    `;
}