import { Box } from "./Box.js";
import { Sphere } from "./Sphere.js";
import { Pipeline } from "../graphics/Pipeline.js";

export class ObjectManager {
    static setBasicObjects() {
        let objects = [];

        let ball = new Sphere(Pipeline.gl);
		ball.createSphere();
        objects.push(ball);
		for (let i = 1; i <= 5; i++)
			objects.push(new Box(Pipeline.gl));
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

	static setDualMap() {
		let objects = [];

        let ball = new Sphere(Pipeline.gl);
		ball.createSphere();
        objects.push(ball);
		for (let i = 1; i < 5; i++)
			objects.push(new Box(Pipeline.gl));
		objects[1].createBox(0.5, 3);
		objects[1].movePos([-15, 0, 0]);
		objects[2].createBox(0.5, 3);
		objects[2].movePos([15, 0, 0]);
		objects[3].createBox(30, 0.5);
		objects[3].movePos([0, 8, 0]);
		objects[4].createBox(30, 0.5);
		objects[4].movePos([0, -8, 0]);

		let loc = Pipeline.gl.getUniformLocation(Pipeline.program.id, "model");
		for (let i = 0; i < objects.length; i++)
			objects[i].setModelLoc(loc);
        return objects;
	}

	static setMultiMap() {
		let objects = [];

        let ball = new Sphere(Pipeline.gl);
		ball.createSphere();
        objects.push(ball);
		for (let i = 1; i < 7; i++)
			objects.push(new Box(Pipeline.gl));
		objects[1].createBox(0.5, 3);
		objects[1].movePos([-15, 1.5, 0]);
		objects[2].createBox(0.5, 3);
		objects[2].movePos([15, 1.5, 0]);
		objects[3].createBox(0.5, 3);
		objects[3].movePos([-15, -1.5, 0]);
		objects[4].createBox(0.5, 3);
		objects[4].movePos([15, -1.5, 0]);
		objects[5].createBox(30, 0.5);
		objects[5].movePos([0, 8, 0]);
		objects[6].createBox(30, 0.5);
		objects[6].movePos([0, -8, 0]);

		let loc = Pipeline.gl.getUniformLocation(Pipeline.program.id, "model");
		for (let i = 0; i < objects.length; i++)
			objects[i].setModelLoc(loc);
        return objects;
	}
    static setGameMap(multiFlag) {
		let objects = [];
		if (multiFlag == false)
			objects = ObjectManager.setDualMap();
		else 
			objects = ObjectManager.setMultiMap();
		return objects;
	}

    static setAddButton() {
        let add_button = new Box(Pipeline.gl);
        add_button.createBox(3, 3);
		add_button.movePos([-19, 5, 0]);
		add_button.setColor([1, 0, 0, 1]);
        let loc = Pipeline.gl.getUniformLocation(Pipeline.program.id, "model");
        add_button.setModelLoc(loc);
        return add_button;
    }

    static addObstacle(obstacles, color, pos, degree, width, height) {
        let object = new Box(Pipeline.gl);
        object.createBox(width, height);
        object.movePos(pos);
        if (degree !== 0)
            object.rotBox(degree);
        object.setColor(color);
		let loc = Pipeline.gl.getUniformLocation(Pipeline.program.id, "model");
		object.setModelLoc(loc);
        obstacles.push(object);
    }
}