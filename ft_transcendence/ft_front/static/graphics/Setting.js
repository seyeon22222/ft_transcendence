import { Pipeline } from "./Pipeline.js";
import { Cam } from "../phong/Cam.js";
import { DefaultFramebuffer } from "./DefaultFramebuffer.js";
import { ObjectManager } from "../phong/ObjectManager.js";

export class Setting {
    static setPipe() {
        Pipeline.initPipeline();
    }

	static setBasicObjects() {
		return ObjectManager.setBasicObjects();
	}

	static setGameMap(multiFlag) {
		return ObjectManager.setGameMap(multiFlag);
	}

	static setAddButton() {
		return ObjectManager.setAddButton();
	}

    static setCam() {
        let cam = new Cam(Pipeline.gl);
        // view 행렬 설정
		cam.setCamMat([0, 0, 1], [0, 1, 0], [0, 0, 20]);

		// 투영 행렬 설정
	    cam.projMat(
			Math.PI / 3, 
			Pipeline.canvas.width, 
			Pipeline.canvas.height,
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