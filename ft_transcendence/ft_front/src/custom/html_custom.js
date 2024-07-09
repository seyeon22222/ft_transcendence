export function custom_html() {
    return `
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SPA with Modal</title>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../src/static/game.css">
    <style>
        .modal-dialog {
            position: fixed;
            margin: auto;
            width: 320px;
            height: 100%;
            right: 0px;
        }
        .modal-content {
            height: 50%;
        }
    </style>
    </head>
    <body>
    <div class="modal fade" id="exampleModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">info</h5>
            </div>
            <form>
                <div>
                  <label for="message-text" class="col-form-label width">width:</label>
                  <input type="text" id="width" value="1">
                </div>
                <div>
                  <label for="message-text" class="col-form-label height">height:</label>
                  <input type="text" id="height" value="1">
                </div>
                <div>
                  <label for="message-text" class="col-form-label degree">degree:</label>
                  <input type="text" id="degree" value="0">
                </div>
                <div>
                  <label for="message-text" class="col-form-label red">red(int[0, 255]):</label>
                  <input type="text" id="red" value="255">
                </div>
                <div>
                  <label for="message-text" class="col-form-label green">green(int[0, 255]):</label>
                  <input type="text" id="green" value="255">
                </div>
                <div>
                  <label for="message-text" class="col-form-label blue">blue(int[0, 255]):</label>
                  <input type="text" id="blue" value="255">
                </div>
              </form>
            <div class="modal-footer">
            <button type="button" class="btn btn-primary save" id="save">save</button>
              <button type="button" class="btn btn-secondary cancel" data-bs-dismiss="modal" id="cancel">cancel</button>
            </div>
        </div>
        </div>
    </div>
    <div id="time"></div>
    <link rel="stylesheet" href="../src/static/game.css">
    <div class="game-container">
      <canvas id="canvas"></canvas>
    </div>
    <div class="d-grid gap-2 col-7 mx-auto">
      <button class="btn btn-primary" type="button" id="start" data-translate="startbtn">Start</button>
    </div>
</body>
    `;
}