export function game_html() {
    return `
    <canvas id="canvas"></canvas>
    <script src="../../static/graphics/Buffer.js"></script>
    <script src="../../static/graphics/Shader.js"></script>
    <script src="../../static/graphics/Program.js"></script>
    <script src="../../static/graphics/DefaultFramebuffer.js"></script>
    <script src="../../static/graphics/VertexArray.js"></script>
    <script src="../../static/graphics/VertexBuffer.js"></script>
    <script src="../../static/graphics/Mesh.js"></script>
    <script src="../../static/graphics/Mat4x4.js"></script>
    <script src="../../static/graphics/Geometry.js"></script>
    <script src="../../static/phong/ball.js"></script>
    <script>
        class Main {
            static gl = null;
            static	program = null;
            static	mesh = null;
            static	mesh2 = null;
            static	mesh3 = null;
            static	mesh4 = null;
            static	ball = null;
            static	stick1 = null;
            static	stick2 = null;
            static keyA = 0;
            static keyQ = 0;
            static lastTime = 0;
            static ws = null;
            static players = 0;

            static pos_ball_tmp = [0, 0, 0];
            static paddle1 = [0, 0, 0];
            static paddle2 = [0, 0, 0];

            static entry() {
                const canvas = document.getElementById("canvas");
                // canvas.width = document.body.clientWidth;
                // canvas.height = document.body.clientHeight;
                canvas.width = 1200;
                canvas.height = 650;
                const	gl = canvas.getContext("webgl2");
                if (!gl) {
                    alert("Webgl2 not supported!");
                }
                // 크기 대응 필요

                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
                const vs = new Shader(gl, gl.VERTEX_SHADER);
                const fs = new Shader(gl, gl.FRAGMENT_SHADER);
                vs.shaderSource(\`#version 300 es
                in vec4	position;
                in vec4 color;

                uniform mat4 model;
                uniform mat4 vp;

                out vec4	col;

                vec4 moveMatrix = vec4(0, 0, 0, 0);
                void	main() {
                    gl_Position = vp * model * position;
                    col = color;
                }\`);
                fs.shaderSource(\`#version 300 es
                precision mediump float; // float의 바이트를 정함

                in vec4	col;

                out vec4	fragColor;

                void	main() {
                    fragColor = col;
                }\`);
                vs.compile();
                fs.compile();
                const program = new Program(gl);
                program.attach(vs);
                program.attach(fs);
                program.link();

                // sphere
                let sphere = new Geometry();
                sphere.createSphere();
                const data = new Float32Array(sphere.vertices);
                const	vertex_buffer = new Buffer(gl, gl.ARRAY_BUFFER, sphere.vertices.length * 4, gl.STATIC_DRAW); // 버퍼 생성
                vertex_buffer.setData(0, data, 0, sphere.vertices.length * 4); // 버퍼 정보 입력
                const	position_view = new VertexBuffer(gl, vertex_buffer, 3, gl.FLOAT, false); // 버택스 버퍼(포지션) 읽는 형식 설정 
                let tmpArr = [1, 1, 1, 1];
                let color = [];
                for (let i = 0; i < 21 * 21; i++) {
                    for (let j = 0; j < 4; j++)
                        color.push(tmpArr[j]);
                }
                color = new Float32Array(color);
                const color_buffer = new Buffer(gl, gl.ARRAY_BUFFER, color.length * 4, gl.STATIC_DRAW);
                color_buffer.setData(0, color, 0, color.length * 4);
                const	color_view = new VertexBuffer(gl, color_buffer, 4, gl.FLOAT, false); 
                const	buffer_view = { // 쉐이더와 데이터 형식 일치
                    "position": position_view,
                    "color": color_view,
                };
                const	mesh = Mesh.from(gl, buffer_view, sphere.indices); // 메쉬 생성

                // stick1
                let box1 = new Geometry();
                box1.createBox(0.5, 3);
                const v_buffer = new Buffer(gl, gl.ARRAY_BUFFER, 72 * 4, gl.STATIC_DRAW);
                v_buffer.setData(0, new Float32Array(box1.vertices), 0, 72 * 4);
                const pos_view = new VertexBuffer(gl, v_buffer, 3, gl.FLOAT, false);
                let color_data = [];
                let tmp = [0, 1, 0, 1];
                for (let i = 0; i < 24; i++) {
                    for (let j = 0; j < 4; j++)
                        color_data.push(tmp[j]);
                }
                color_data = new Float32Array(color_data);
                const color_box = new Buffer(gl, gl.ARRAY_BUFFER, color_data.length * 4, gl.STATIC_DRAW);
                color_box.setData(0, color_data, 0, color_data.length * 4);
                const color_box_view = new VertexBuffer(gl, color_box, 4, gl.FLOAT, false);
                buffer_view["position"] = pos_view;
                buffer_view["color"] = color_box_view;
                const	mesh2 = Mesh.from(gl, buffer_view, box1.indices); // 메쉬 생성

                // wall
                let box2 = new Geometry();
                box2.createBox(30, 0.5);
                const box2_buffer = new Buffer(gl, gl.ARRAY_BUFFER, box2.vertices.length * 4, gl.STATIC_DRAW);
                box2_buffer.setData(0, new Float32Array(box2.vertices), 0, box2.vertices.length * 4);
                const box2_view = new VertexBuffer(gl, box2_buffer, 3, gl.FLOAT, false);
                buffer_view["position"] = box2_view;
                buffer_view["color"] = color_view;
                const mesh3 = Mesh.from(gl, buffer_view, box2.indices);

                // stick2
                buffer_view["position"] = pos_view;
                const mesh4 = Mesh.from(gl, buffer_view, box1.indices);

                // view 행렬 설정
                let camMatrix = Mat4x4.camMatrix([0, 0, 1], [0, 1, 0], [0, 0, 20]);
                let viewMatrix = Mat4x4.viewMatrix(camMatrix);
                
                // 투영 행렬 설정
                let projectionMatrix = Mat4x4.projectionMatrix(Math.PI / 3, 0.1, 1000, canvas.width / canvas.height);
                let vpLocation = gl.getUniformLocation(program.id, "vp");
                let vpMatirx = Mat4x4.multipleMat4(projectionMatrix, viewMatrix);

                program.use();
                gl.uniformMatrix4fv(vpLocation, true, vpMatirx);

                Main.gl = gl;
                Main.program = program;
                
                Main.mesh = mesh;
                Main.mesh2 = mesh2;
                Main.mesh3 = mesh3;
                Main.mesh4 = mesh4;

                Main.ball = new Ball();
                Main.stick1 = new Stick([-15, 0, 0]);
                Main.stick2 = new Stick([15, 0, 0]);
                
                function connect() {
                    Main.ws = new WebSocket('ws://' + window.location.host + '/ws/game/');

                    Main.ws.onopen = function() {
                        console.log('웹소켓 연결 성공');
                    };
                
                    Main.ws.onclose = function(e) {
                        console.log('웹소켓 연결 끊김. 재연결 시도 중...');
                        setTimeout(function() {
                            connect();
                        }, 10000);
                    };
                
                    Main.ws.onerror = function(err) {
                        console.error('웹소켓 오류 발생:', err);
                        Main.ws.close(); // 오류 발생 시 명시적으로 닫기
                    };
                }

                connect();

                Main.ws.onmessage = async function(e) {
                    var data = JSON.parse(e.data);
                    var data = JSON.parse(e.data);
                    var message = data['message'];
                    var ball_pos = data['ball_pos'];
                    var paddle1_pos = data['paddle1_pos'];
                    var paddle2_pos = data['paddle2_pos'];
                    var score1 = data['score1'];
                    var score2 = data['score2'];
                    var players = data['players'];

                    /*
                    console.log("Received message: " + message);
                    console.log("Received ball_pos: " + ball_pos);
                    console.log("Received ball_pos type: " + typeof(ball_pos) + " Array: " + Array.isArray(ball_pos));
                    console.log("Received paddle1_pos: " + paddle1_pos);
                    console.log("Received paddle2_pos: " + paddle2_pos);
                    console.log("Received score1: " + score1);
                    console.log("Received score2: " + score2);
                    console.log("Received players: " + players);
                    */
                    for (let i = 0; i < 3; i++) {
                        Main.stick1.pos[i] = paddle1_pos[i];
                        Main.stick2.pos[i] = paddle2_pos[i];
                        Main.ball.pos[i] = ball_pos[i];
                    }
                    /*
                    Main.stick1.pos = paddle1_pos;
                    Main.stick2.pos = paddle2_pos;
                    Main.ball.pos = ball_pos;
                    */
                    if (Main.players == 0)
                        Main.players = players;
                }

                window.addEventListener('keydown', async function (event) {
                    var message = { message: event.key, players: Main.players};
                
                    if (event.code === 'KeyQ')
                        message = { message: '1pup', players: Main.players};
                    if (event.code == 'KeyA')
                        message = { message: '1pdown', players: Main.players};
                    if (event.code === 'KeyO')
                        message = { message: '2pup', players: Main.players};
                    if (event.code == 'KeyL')
                        message = { message: '2pdown', players: Main.players};
                    
                    //Main.ws.send(JSON.stringify(message));
                });

                window.addEventListener('keyup', async function (event) {
                    var message = { message: event.key, players: Main.players};
                
                    if (event.code === 'KeyQ')
                        message = { message: '1pupstop', players: Main.players};
                    if (event.code == 'KeyA')
                        message = { message: '1pdownstop', players: Main.players};
                    if (event.code === 'KeyO')
                        message = { message: '2pupstop', players: Main.players};
                    if (event.code == 'KeyL')
                        message = { message: '2pdownstop', players: Main.players};
                    
                    //Main.ws.send(JSON.stringify(message));
                    console.log(JSON.stringify(message));
                });
                requestAnimationFrame(Main.update);
            }
            static render() {
                    DefaultFramebuffer.setClearColor(0.4, 0.4, 0.4, 1.0);
                    Main.gl.enable(Main.gl.CULL_FACE);
                    Main.gl.enable(Main.gl.DEPTH_TEST);
                    Main.gl.cullFace(Main.gl.BACK);
                    DefaultFramebuffer.clearColor(Main.gl);

                    let modelLocation = Main.gl.getUniformLocation(Main.program.id, "model");

                    Main.program.use();

                    // ball
                    Main.gl.uniformMatrix4fv(modelLocation, true, Mat4x4.transportMat(Main.pos_ball_tmp));
                    Main.mesh.draw(Main.program);

                    // stick1
                    Main.gl.uniformMatrix4fv(modelLocation, true, Mat4x4.transportMat(Main.paddle1));
                    Main.mesh2.draw(Main.program);

                    // stick2
                    Main.gl.uniformMatrix4fv(modelLocation, true, Mat4x4.transportMat(Main.paddle2));
                    Main.mesh4.draw(Main.program);

                    // wall_1
                    Main.gl.uniformMatrix4fv(modelLocation, true, Mat4x4.transportMat([0, 8, 0]));
                    Main.mesh3.draw(Main.program);

                    // wall_2
                    Main.gl.uniformMatrix4fv(modelLocation, true, Mat4x4.transportMat([0, -8, 0]));
                    Main.mesh3.draw(Main.program);
            }
            static update() {
                for (let i = 0; i < 3; i++) {
                    Main.pos_ball_tmp[i] = Main.ball.pos[i];
                    Main.paddle1[i] = Main.stick1.pos[i];
                    Main.paddle2[i] = Main.stick2.pos[i];
                }
                Main.render();
                requestAnimationFrame(Main.update);
            }
        }
        Main.entry();
    </script>
    `;
}