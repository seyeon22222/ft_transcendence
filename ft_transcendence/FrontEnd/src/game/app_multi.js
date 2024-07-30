import { Buffer } from "../../static/graphics/Buffer.js";
import { DefaultFramebuffer } from "../../static/graphics/DefaultFramebuffer.js";
import { Geometry } from "../../static/graphics/Geometry.js";
import {
  Mat4x4,
  crossProduct,
  normalizeVec,
} from "../../static/graphics/Mat4x4.js";
import { Mesh } from "../../static/graphics/Mesh.js";
import { Program } from "../../static/graphics/Program.js";
import { Shader } from "../../static/graphics/Shader.js";
import { VertexBuffer } from "../../static/graphics/VertexBuffer.js";
import { Ball, Stick } from "../../static/phong/ball.js";
import { delete_back_show, event_add_popstate } from "../utilities.js";

class Main {
  static gl = null;
  static program = null;
  static mesh = null;
  static mesh2 = null;
  static mesh3 = null;
  static mesh4 = null;
  static mesh5 = null;
  static mesh6 = null;

  static ball = null;
  static stick1 = null;
  static stick2 = null;
  static stick3 = null;
  static stick4 = null;

  static keyA = 0;
  static keyQ = 0;
  static lastTime = 0;
  static players = 0;
  static camDegree = 0;
  static camMat4;
  static projMat4;
  static vpLoc;

  static score1 = 0;
  static score2 = 0;
  static loop = true;

  static webfunc(get_hash) {
    Main.loop = true;
    Main.ball = new Ball();
    Main.stick1 = new Stick([-15, 1.5, 0]);
    Main.stick2 = new Stick([15, 1.5, 0]);
    Main.stick3 = new Stick([-15, -1.5, 0]);
    Main.stick4 = new Stick([15, -1.5, 0]);
    let flag = 1;
    // WebSocket 연결 시도
    let ws = new WebSocket(
      "wss://" + window.location.host + "/ws/multigame/" + get_hash + "/"
    );

    function sleep(ms) {
      const start = new Date().getTime();
      while (new Date().getTime() < start + ms) {
        // 아무것도 하지 않고 대기
      }
    }
    function multi_popstate(event) {
      // WebSocket 연결 닫기
      if (ws && ws.readyState !== WebSocket.CLOSED) {
        ws.close();
        sleep(1000);
        ws = null;
      }
      Main.players = 0;
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("keydown", handleKeyDown);
      Main.loop = false;
    }
    
    event_add_popstate(multi_popstate);

    const handleResize = () => {
      canvas.height = window.innerHeight - 50;
      canvas.width = window.innerWidth - 50;
    };

    const handleKeyUp = (event) => {
      let message = { message: event.key, pid: window.players};
      let flag = 0;
      if (event.code === "KeyQ") {
        message = { message: "upstop", pid: window.players};
        flag = 1;
      }
      if (event.code == "KeyA") {
        message = { message: "downstop", pid: window.players};
        flag = 1;
      }
      if (event.code === "ArrowRight" || event.code === "ArrowLeft")
        Main.camDegree = 0;
      if (flag) ws.send(JSON.stringify(message));
    };

    const handleKeyDown = (event) => {
      let message = { message: event.key, pid: window.players};
      let flag = 0;
      if (event.code === "KeyQ") {
        message = { message: "up", pid: window.players};
        flag = 1;
      }
      if (event.code === "KeyA") {
        message = { message: "down", pid: window.players};
        flag = 1;
      }
      if (event.code === "ArrowRight")
        Main.camDegree = Math.min(45, Main.camDegree + 1);
      if (event.code === "ArrowLeft")
        Main.camDegree = Math.max(-45, Main.camDegree - 1);
      if (flag) ws.send(JSON.stringify(message));
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("keydown", handleKeyDown);

    ws.onopen = () => {
      let message = { message: "", pid: window.players};
      ws.send(JSON.stringify(message));
    }

    ws.onclose = () => {
    };
  
    let messageQueue = [];
    let processingMessages = false;

    ws.onmessage = async function (e) {
      messageQueue.push(e);
      if (!processingMessages) {
        processingMessages = true;
        while (messageQueue.length > 0) {
          let event = messageQueue.shift();
          await processMessage(event);
        }
        processingMessages = false;
      }
    };
    
    async function processMessage(e) {
      let data = JSON.parse(e.data);
      let ball_pos = data["ball_pos"];
      let paddle1_pos = data["paddle1_pos"];
      let paddle2_pos = data["paddle2_pos"];
      let paddle3_pos = data["paddle3_pos"];
      let paddle4_pos = data["paddle4_pos"];
      let score1 = data["score1"];
      let score2 = data["score2"];
      let is_active = data["is_active"];
  
      document.getElementById("game-score").innerHTML = score1 + " : " + score2;
      for (let i = 0; i < 3; i++) {
        Main.stick1.pos[i] = paddle1_pos[i];
        Main.stick2.pos[i] = paddle2_pos[i];
        Main.stick3.pos[i] = paddle3_pos[i];
        Main.stick4.pos[i] = paddle4_pos[i];
        Main.ball.pos[i] = ball_pos[i];
      }
      if (Main.players == 0) {
          Main.players = window.players;
          flag = 0;
      }
      if (!flag) {
          Main.entry();
          flag = 1;
      }
      if (is_active == 0) {
        Main.loop = false;
        let get_list_hash = get_hash.split("_");
        location.href = `/#multi/2:2 Match ${get_list_hash[get_list_hash.length - 1]}`;
      }
    };
  }
  static entry() {
    const canvas = document.getElementById("canvas");
    canvas.height = 909;
    canvas.width = 1678;

    const gl = canvas.getContext("webgl2");
    if (!gl) {
      alert("Webgl2 not supported!");
    }

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    const vs = new Shader(gl, gl.VERTEX_SHADER);
    const fs = new Shader(gl, gl.FRAGMENT_SHADER);
    vs.shaderSource(`#version 300 es
        in vec4	position;
        in vec4 color;

        uniform mat4 model;
        uniform mat4 vp;

        out vec4	col;

        vec4 moveMatrix = vec4(0, 0, 0, 0);
        void	main() {
            gl_Position = vp * model * position;
            col = color;
        }`);
    fs.shaderSource(`#version 300 es
        precision mediump float; // float의 바이트를 정함

        in vec4	col;

        out vec4	fragColor;

        void	main() {
            fragColor = col;
        }`);
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
    const vertex_buffer = new Buffer(
      gl,
      gl.ARRAY_BUFFER,
      sphere.vertices.length * 4,
      gl.STATIC_DRAW
    ); // 버퍼 생성
    vertex_buffer.setData(0, data, 0, sphere.vertices.length * 4); // 버퍼 정보 입력
    const position_view = new VertexBuffer(
      gl,
      vertex_buffer,
      3,
      gl.FLOAT,
      false
    ); // 버택스 버퍼(포지션) 읽는 형식 설정
    let tmpArr = [1, 1, 1, 1];
    let color = [];
    for (let i = 0; i < 21 * 21; i++) {
      for (let j = 0; j < 4; j++) color.push(tmpArr[j]);
    }
    color = new Float32Array(color);
    const color_buffer = new Buffer(
      gl,
      gl.ARRAY_BUFFER,
      color.length * 4,
      gl.STATIC_DRAW
    );
    color_buffer.setData(0, color, 0, color.length * 4);
    const color_view = new VertexBuffer(gl, color_buffer, 4, gl.FLOAT, false);
    const buffer_view = {
      // 쉐이더와 데이터 형식 일치
      position: position_view,
      color: color_view,
    };
    const mesh = Mesh.from(gl, buffer_view, sphere.indices); // 메쉬 생성

    // stick1
    let box1 = new Geometry();
    box1.createBox(0.5, 3);
    const v_buffer = new Buffer(gl, gl.ARRAY_BUFFER, 72 * 4, gl.STATIC_DRAW);
    v_buffer.setData(0, new Float32Array(box1.vertices), 0, 72 * 4);
    const pos_view = new VertexBuffer(gl, v_buffer, 3, gl.FLOAT, false);
    let color_data = [];
    let tmp = [0, 1, 0, 1];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 4; j++) color_data.push(tmp[j]);
    }
    color_data = new Float32Array(color_data);
    const color_box = new Buffer(
      gl,
      gl.ARRAY_BUFFER,
      color_data.length * 4,
      gl.STATIC_DRAW
    );
    color_box.setData(0, color_data, 0, color_data.length * 4);
    const color_box_view = new VertexBuffer(gl, color_box, 4, gl.FLOAT, false);

    // wall
    let box2 = new Geometry();
    box2.createBox(30, 0.5);
    const box2_buffer = new Buffer(
      gl,
      gl.ARRAY_BUFFER,
      box2.vertices.length * 4,
      gl.STATIC_DRAW
    );
    box2_buffer.setData(
      0,
      new Float32Array(box2.vertices),
      0,
      box2.vertices.length * 4
    );
    const box2_view = new VertexBuffer(gl, box2_buffer, 3, gl.FLOAT, false);
    buffer_view["position"] = box2_view;
    buffer_view["color"] = color_view;
    const mesh3 = Mesh.from(gl, buffer_view, box2.indices);

    // view 행렬 설정
    let camMatrix = Mat4x4.camMatrix([0, 0, 1], [0, 1, 0], [0, 0, 20]);
    Main.camMat4 = camMatrix;

    // 투영 행렬 설정
    let projectionMatrix = Mat4x4.projectionMatrix(
      Math.PI / 3,
      0.1,
      1000,
      canvas.width / canvas.height
    );
    Main.projMat4 = projectionMatrix;
    let vpLocation = gl.getUniformLocation(program.id, "vp");
    Main.vpLoc = vpLocation;

    program.use();

    Main.gl = gl;
    Main.program = program;

    let mesh2, mesh4;
    if (Main.players == 1) {
      buffer_view["position"] = pos_view;
      buffer_view["color"] = color_box_view;
      Main.mesh2 = Mesh.from(gl, buffer_view, box1.indices);
      buffer_view["color"] = color_view;
      Main.mesh4 = Mesh.from(gl, buffer_view, box1.indices);
      Main.mesh5 = Main.mesh4;
      Main.mesh6 = Main.mesh4;
    } 
    else if (Main.players == 2) {
      buffer_view["position"] = pos_view;
      buffer_view["color"] = color_view;
      Main.mesh2 = Mesh.from(gl, buffer_view, box1.indices);
      buffer_view["color"] = color_box_view;
      Main.mesh4 = Mesh.from(gl, buffer_view, box1.indices);
      Main.mesh5 = Main.mesh2;
      Main.mesh6 = Main.mesh2;
    }
    else if (Main.players == 3) {
        buffer_view["position"] = pos_view;
        buffer_view["color"] = color_box_view;
        Main.mesh5 = Mesh.from(gl, buffer_view, box1.indices);
        buffer_view["color"] = color_view;
        Main.mesh4 = Mesh.from(gl, buffer_view, box1.indices);
        Main.mesh2 = Main.mesh4;
        Main.mesh6 = Main.mesh4;
    }
    else {
        buffer_view["position"] = pos_view;
        buffer_view["color"] = color_box_view;
        Main.mesh6 = Mesh.from(gl, buffer_view, box1.indices);
        buffer_view["color"] = color_view;
        Main.mesh4 = Mesh.from(gl, buffer_view, box1.indices);
        Main.mesh2 = Main.mesh4;
        Main.mesh5 = Main.mesh4;
    }

    Main.mesh = mesh;
    Main.mesh3 = mesh3;
    requestAnimationFrame(Main.update);
  }
  static render() {
    DefaultFramebuffer.setClearColor(0.4, 0.4, 0.4, 1.0);
    Main.gl.enable(Main.gl.CULL_FACE);
    Main.gl.enable(Main.gl.DEPTH_TEST);
    Main.gl.cullFace(Main.gl.BACK);
    DefaultFramebuffer.clearColor(Main.gl);

    let modelLocation = Main.gl.getUniformLocation(Main.program.id, "model");
    let viewMatrix = Mat4x4.viewMatrix(
      Mat4x4.multipleMat4(Mat4x4.rotMatAxisY(Main.camDegree), Main.camMat4)
    );
    let vpMatirx = Mat4x4.multipleMat4(Main.projMat4, viewMatrix);
    Main.program.use();
    Main.gl.uniformMatrix4fv(Main.vpLoc, true, vpMatirx);

    // ball
    Main.gl.uniformMatrix4fv(
      modelLocation,
      true,
      Mat4x4.transportMat(Main.ball.pos)
    );
    Main.mesh.draw(Main.program);

    // stick1
    Main.gl.uniformMatrix4fv(
      modelLocation,
      true,
      Mat4x4.transportMat(Main.stick1.pos)
    );
    Main.mesh2.draw(Main.program);

    // stick2
    Main.gl.uniformMatrix4fv(
      modelLocation,
      true,
      Mat4x4.transportMat(Main.stick2.pos)
    );
    Main.mesh4.draw(Main.program);
    // stick3
    Main.gl.uniformMatrix4fv(
      modelLocation,
      true,
      Mat4x4.transportMat(Main.stick3.pos)
  );
  Main.mesh5.draw(Main.program);

  // stick4
  Main.gl.uniformMatrix4fv(
      modelLocation,
      true,
      Mat4x4.transportMat(Main.stick4.pos)
  );
  Main.mesh6.draw(Main.program);

    // wall_1
    Main.gl.uniformMatrix4fv(
      modelLocation,
      true,
      Mat4x4.transportMat([0, 8, 0])
    );
    Main.mesh3.draw(Main.program);

    // wall_2
    Main.gl.uniformMatrix4fv(
      modelLocation,
      true,
      Mat4x4.transportMat([0, -8, 0])
    );
    Main.mesh3.draw(Main.program);
  }
  static update() {
    Main.render();
    if (Main.loop)
      requestAnimationFrame(Main.update);
  }
}

export async function game_multi_js(hash) {
  delete_back_show();
  const get_hash = hash.slice(1);
  let flag = 0;
  let get_list_hash = get_hash.split("_"); //get_hash '_'를 기준으로 split
  let match_id = get_list_hash[get_list_hash.length - 1]; //

  const csrftoken = Cookies.get("csrftoken");
  const response = await fetch(`/match/multimatchview/${match_id}`, {
    //match serializer 반환값 가져옴
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    credentials: "include",
  });
  if (response.ok) {
    let data = await response.json();
    if (
      data.player1_uuid === get_list_hash[0] && //해당 match_id에 해당하는 player1 , player2 가 hash에 주어진 uuid와 일치하는지 확인
      data.player2_uuid === get_list_hash[1] &&
      data.player3_uuid === get_list_hash[2] &&
      data.player4_uuid === get_list_hash[3] &&
      data.match_result === null //winner_username 이 값이 없는지 확인 ->값이 있으면 이미 완료된 게임이므로
    ) {
      const response_name = await fetch("user/info", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        credentials: "include",
      });
      if (response_name.ok) {
        //url에 해당 uuid값이 있는지
        let data = await response_name.json();
        let get_list_hash = get_hash.split("_");
        window.players = 0;
        for (let i = 0; i < get_list_hash.length - 1; i++) {
          if (get_list_hash[i] == data[0].user_id) {
            window.uuid = data[0].user_id;
            window.players = i + 1;
            flag = 1;
          }
        }
        if (flag == 1) {
          Main.webfunc(get_hash);
        } else {
          location.href = "/#";
        }
      } else {
        location.href = "/#";
        const error = await response_name.json();
      }
    } else {
      location.href = "/#";
    }
  } else {
    location.href = "/#";
    const error = await response.json();
  }
}
