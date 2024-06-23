export function custom_html() {
    return `
    <body>
        <link rel="stylesheet" href="./game.css">
        <div class="game-container">
            <canvas id="canvas"></canvas>
        </div>
        <div class="d-grid gap-2 col-7 mx-auto">
            <button class="btn btn-primary" type="button" id="start">Start</button>
        </div>
    </body>
    `;
}