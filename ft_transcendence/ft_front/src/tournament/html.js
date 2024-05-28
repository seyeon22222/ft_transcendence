export function tournament_html() {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tournament Bracket</title>
        <style>
            body {
                background-color: #333;
                color: #fff;
                font-family: Arial, sans-serif;
            }
            .btn {
                background-color: #007bff;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px;
                display: inline-block;
            }
            .tree {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                margin: 20px;
            }
            .node {
                background-color: #ccc;
                padding: 10px 20px;
                margin: 10px;
                text-align: center;
                color: #000;
            }
            .level {
                display: flex;
                justify-content: space-around;
                width: 100%;
            }
            .connector {
                display: flex;
                justify-content: space-around;
                width: 100%;
                margin-top: -20px;
            }
            .connector div {
                border-top: 1px solid #fff;
                width: 20%;
                position: relative;
            }
            .connector div::before {
                content: '';
                border-left: 1px solid #fff;
                height: 20px;
                position: absolute;
                top: -20px;
                left: 50%;
                transform: translateX(-50%);
            }
        </style>
    </head>
    <body>
        <a href="/#" class="btn">Home</a>
        <div class="p-10 lg:p-20 text-center">
            <h1 class="text-3xl lg:text-6xl" id="tournament_name"></h1>
        </div>
        <div class="tree">
            <div class="node" id="final"></div>
            <div class="connector">
                <div></div>
                <div></div>
            </div>
            <div class="level">
                <div class="node" id="semi_final1"></div>
                <div class="node" id="semi_final2"></div>
            </div>
            <div class="connector">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div class="level">
                <div class="node" id="quarter_final1"></div>
                <div class="node" id="quarter_final2"></div>
                <div class="node" id="quarter_final3"></div>
                <div class="node" id="quarter_final4"></div>
            </div>
            <div class="level">
                <div class="node" id="Round_8_1"></div>
                <div class="node" id="Round_8_2"></div>
                <div class="node" id="Round_8_3"></div>
                <div class="node" id="Round_8_4"></div>
                <div class="node" id="Round_8_5"></div>
                <div class="node" id="Round_8_6"></div>
                <div class="node" id="Round_8_7"></div>
                <div class="node" id="Round_8_8"></div>
            </div>
            <div>
                <input type="text" id="nickname_input" placeholder="별칭을 입력하세요">
                <button type="button" class="px-5 py-3 rounded-xl text-black bg-teal-800 hover:bg-teal-700" id="tournament_button">토너먼트 신청</button>
            </div>
            <div id="button_container">
                <button type="button" class="px-5 py-3 rounded-xl text-black bg-teal-800 hover:bg-teal-700" id="tournament_start">토너먼트 시작</button>
            </div>
        </div>
    </body>
    </html>
    `;
}
