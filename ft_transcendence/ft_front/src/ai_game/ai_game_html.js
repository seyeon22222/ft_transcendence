export function ai_html() {
    return `
    <div>hello world</div>
        <canvas id="canvas"></canvas>
        <script src="./../../static/aigame/util/MathUtil.js"></script>
        <script src="./../../static/aigame/util/Vector3.js"></script>
        <script src="./../../static/aigame/util/Matrix.js"></script>
        <script src="./../../static/aigame/util/Loader.js"></script>

        <script src="./../../static/aigame/core/definition.js"></script>
        <script src="./../../static/aigame/core/Time.js"></script>
        <script src="./../../static/aigame/core/Input.js"></script>
        <script src="./../../static/aigame/core/Camera.js"></script>
        <script src="./../../static/aigame/core/PostProcessor.js"></script>

        <script src="./../../static/aigame/asset/MaterialAsset.js"></script>
        <script src="./../../static/aigame/asset/MeshAsset.js"></script>
        <script src="./../../static/aigame/asset/TextureAsset.js"></script>

        <script src="./../../static/aigame/component/Transform.js"></script>
        <script src="./../../static/aigame/component/PlayerControl.js"></script>
        <script src="./../../static/aigame/component/BotControl.js"></script>
        <script src="./../../static/aigame/component/Renderer.js"></script>
        <script src="./../../static/aigame/component/PongBall.js"></script>
        <script src="./../../static/aigame/component/PongStick.js"></script>
        <script src="./../../static/aigame/component/PongTable.js"></script>

        <script src="./../../static/aigame/gameObject/GameObject.js"></script>
        <script src="./../../static/aigame/gameObject/Stick.js"></script>
        <script src="./../../static/aigame/gameObject/Ball.js"></script>
        <script src="./../../static/aigame/gameObject/Table.js"></script>
        <script src="./../../static/aigame/gameObject/Player.js"></script>
        <script src="./../../static/aigame/gameObject/Bot.js"></script>

        <script src="ai_game.js"></script>
    `;
}