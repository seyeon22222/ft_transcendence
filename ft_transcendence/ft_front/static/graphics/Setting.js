import { Pipeline } from "./Pipeline.js"; // comp
import { Box } from "../phong/Box.js"; // comp
import { Sphere } from "../phong/Sphere.js"; // comp
import { Cam } from "../phong/Cam.js"; // comp
import { DefaultFramebuffer } from "./DefaultFramebuffer.js"; // comp

export class Setting {
    static setPipe() {
        Pipeline.initPipeline();
    }

    static setBasicObjects() {
        let objects = [];

        let ball = new Sphere(Pipeline.gl, Pipeline.program);
		ball.createSphere();
        objects.push(ball);
		for (let i = 1; i <= 5; i++)
			objects.push(new Box(Pipeline.gl, Pipeline.program));
		objects[1].createBox(1, 1);
		objects[2].createBox(0.5, 3);
		objects[2].movePos([-15, 0, 0]);
		objects[3].createBox(0.5, 3);
		objects[3].movePos([15, 0, 0]);
		objects[4].createBox(30, 0.5);
		objects[4].movePos([0, 8, 0]);
		objects[5].createBox(30, 0.5);
		objects[5].movePos([0, -8, 0]);

		let loc = Pipeline.gl.getUniformLocation(Pipeline.program.id, "model");
		for (let i = 0; i < objects.length; i++)
			objects[i].setModelLoc(loc);
        return objects;
    }

	//TODO 받아온 정보를 통해 인자 추가하기
    static setGameMap() {
		let objects = [];

		return objects;
	}

    static setAddButton() {
        let add_button = new Box(Pipeline.gl, Pipeline.program);
        add_button.createBox(3, 3);
		add_button.movePos([-19, 5, 0]);
		add_button.setColor([1, 0, 0, 1]);
        let loc = Pipeline.gl.getUniformLocation(Pipeline.program.id, "model");
        add_button.setModelLoc(loc);
        return add_button;
    }

    static setCam() {
        let cam = new Cam(Pipeline.gl);
        // view 행렬 설정
		cam.setCamMat([0, 0, 1], [0, 1, 0], [0, 0, 20]);

		// 투영 행렬 설정
	    cam.projMat(
			Math.PI / 3, 
			canvas.width, 
			canvas.height,
			0.1, 
			1000
		);
        cam.setViewProjLoc(Pipeline.gl.getUniformLocation(Pipeline.program.id, "vp"));
        return cam;
    }

    static setRender() {
        DefaultFramebuffer.setClearColor(0.4, 0.4, 0.4, 1.0);
		Pipeline.gl.enable(Pipeline.gl.CULL_FACE);
		Pipeline.gl.enable(Pipeline.gl.DEPTH_TEST);
		Pipeline.gl.cullFace(Pipeline.gl.BACK);
		DefaultFramebuffer.clearColor(Pipeline.gl);
        Pipeline.program.use();
    }
}