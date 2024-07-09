import { Pipeline } from "../graphics/Pipeline.js";
import { Box } from "../phong/Box.js";
import { Mat4 } from "../utils/Mat4.js";

async function sendTournament(objects, id, ws) {
    let hash = window.location.hash.slice(1);
    let segments = hash.split('/');
    let uuids = segments[1].split('_');
    let player1 = uuids[0];
    let player2 = uuids[1];
    
    const csrftoken = Cookies.get('csrftoken');
    for (let i = 6; i < objects.length; i++) {
        let game_results = {
            'r' : Math.floor(objects[i].color[0] * 255),
            'g' : Math.floor(objects[i].color[1] * 255),
            'b' : Math.floor(objects[i].color[2] * 255),
            'x' : objects[i].pos[0],
            'y' : objects[i].pos[1],
            'z' : objects[i].degree,
            'w' : objects[i].width,
            'h' : objects[i].height
        }
        const response = await fetch(`/match/updatetournamentcustom/${player1}${player2}${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify(game_results),
        });
    }
    let message = { message: window.players};
    ws.send(JSON.stringify(message));
}

async function sendMatch(objects, id, ws) {
    const csrftoken = Cookies.get('csrftoken');
    for (let i = 6; i < objects.length; i++) {
        let game_results = {
            'r' : Math.floor(objects[i].color[0] * 255),
            'g' : Math.floor(objects[i].color[1] * 255),
            'b' : Math.floor(objects[i].color[2] * 255),
            'x' : objects[i].pos[0],
            'y' : objects[i].pos[1],
            'z' : objects[i].degree,
            'w' : objects[i].width,
            'h' : objects[i].height
        }
        const response = await fetch(`/match/updatematchcustom/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify(game_results),
        });
    }
    let message = { message: window.players};
    ws.send(JSON.stringify(message));
}

async function sendMulti(objects, id, ws) {
    const csrftoken = Cookies.get('csrftoken');

    for (let i = 6; i < objects.length; i++) {
        let game_results = {
            'r' : Math.floor(objects[i].color[0] * 255),
            'g' : Math.floor(objects[i].color[1] * 255),
            'b' : Math.floor(objects[i].color[2] * 255),
            'x' : objects[i].pos[0],
            'y' : objects[i].pos[1],
            'z' : objects[i].degree,
            'w' : objects[i].width,
            'h' : objects[i].height
        }
        
        const response = await fetch(`/match/updatemulticustom/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify(game_results),
        });
    }
    let message = { message: window.players};
    ws.send(JSON.stringify(message));
}

export class MouseEvent {
    static new_object = null;
    static m_flag = 0;
    static c_flag = 0;
    static cor_x = 0;
    static cor_y = 0;
    static obj_idx = 0;
    static start_flag = 0;

    static createObject(objects) {
		objects.push(new Box(Pipeline.gl));
		objects[objects.length - 1].createBox(1, 1);
		MouseEvent.new_object = objects[objects.length - 1];
		let loc = Pipeline.gl.getUniformLocation(Pipeline.program.id, "model");
		MouseEvent.new_object.setModelLoc(loc);
        MouseEvent.obj_idx = objects.length - 1;
    }

    static resetMouseEvent() {
        MouseEvent.new_object = null;
        MouseEvent.m_flag = 0;
        MouseEvent.c_flag = 0;
        MouseEvent.cor_x = 0;
        MouseEvent.cor_y = 0;
        MouseEvent.obj_idx = 0;
        MouseEvent.start_flag = 0;
    }

    constructor(type, ray = null, button = null, objects = null, id = null, ws = null) {
        this.type = type;
        this.child1_type = null;
        this.child1_event = null;
        this.child2_type = null;
        this.child2_event = null;
        this.input_types = [];
        this.input_events = [];
        this.m_event = null;
        if (type == 'click')
            this.setClick(ray, button, objects);
        else if (type == 'mousemove')
            this.setMove(ray);
        else if (type == 'mousedown')
            this.setDown(ray);
        else if (type == 'mouseup')
            this.setUp(objects, ray);
        else if (type == 'start')
            this.setStart(objects, id, ws);
        else if (type == 'gamestart')
            this.setGameStart(ws);
    }

    destructor() {
        if (this.type == 'click')
            window.removeEventListener('click', this.m_event);
        else if (this.type == 'mousemove')
            window.removeEventListener('mousemove', this.m_event);
        else if (this.type == 'mousedown')
            window.removeEventListener('mousedown', this.m_event);
        else if (this.type == 'mouseup') {
            window.removeEventListener('mouseup', this.m_event);
            document.getElementById('save').removeEventListener('click', this.child1_event);
            document.getElementById('cancel').removeEventListener('click', this.child2_event);
            for (let i = 0; i < this.input_events.length; i++)
                document.getElementById(this.input_types[i]).removeEventListener('input', this.input_events[i]);
        }
        else if (this.type == 'start')
            document.getElementById('start').removeEventListener('click', this.m_event);
        else if (this.type == 'gamestart')
            document.getElementById('start').removeEventListener('click', this.m_event);
    }

    setGameStart(ws) {
        let tmp_event = () => {
            let message = { message: window.players};
		    ws.send(JSON.stringify(message));
        };
        document.getElementById('start').addEventListener('click', tmp_event);
        this.m_event = tmp_event;
    }

    setStart(objects, id, ws) {
        let location = window.location.hash.slice(1).toLocaleLowerCase().split("/");
        let tmp_event = async () => {
            if (MouseEvent.start_flag)
                return;
            MouseEvent.start_flag = 1;
            if (MouseEvent.new_object) {
                let max_x = -100, max_y = -100, min_x = 100, min_y = 100;
                let flag = false;
                for (let k = 0; k < 4; k++) {
                    if (MouseEvent.new_object.colbox.vertices[k][0] > max_x)
                        max_x = MouseEvent.new_object.colbox.vertices[k][0];
                    if (MouseEvent.new_object.colbox.vertices[k][0] < min_x)
                        min_x = MouseEvent.new_object.colbox.vertices[k][0];
                    if (MouseEvent.new_object.colbox.vertices[k][1] > max_y)
                        max_y = MouseEvent.new_object.colbox.vertices[k][1];
                    if (MouseEvent.new_object.colbox.vertices[k][1] < min_y)
                        min_y = MouseEvent.new_object.colbox.vertices[k][1];
                }
                if (max_x > 14 || min_x < -14 || max_y > 7 || min_y < -7)
                    flag = true;
                if (flag === false) {
                    for (let i = 1; i < objects.length; i++) {
                        if (MouseEvent.obj_idx === i)
                            continue;
                        if (MouseEvent.new_object.collision(objects[i])) {
                            flag = true;
                            break;
                        }
                    }
                }
                if (flag)
                    objects.splice(MouseEvent.obj_idx, 1);
                MouseEvent.new_object = null;
                MouseEvent.obj_idx = 0;
            }

            if (location[0] === 'customm')
                await sendMatch(objects, id, ws);
            else if (location[0] === 'customt')
                await sendTournament(objects, id, ws);
            else if (location[0] === 'custommulti')
                await sendMulti(objects, id, ws);
        }
        document.getElementById('start').addEventListener('click', tmp_event);
        this.m_event = tmp_event;
    }

    setClick(ray, button, objects) {
        let tmp_event = (event) => {
            if (MouseEvent.start_flag)
                return;
            ray.setRay(event.clientX, event.clientY);
            if(MouseEvent.new_object === null) {
                if (button.collisionRay(ray.ray_des))
                    MouseEvent.createObject(objects);
                else {
                    for (let i = 6; i < objects.length; i++) {
                        if (objects[i].collisionRay(ray.ray_des)) {
                            MouseEvent.obj_idx = i;
                            break;
                        }
                    }
                    if (MouseEvent.obj_idx > 0)
                        MouseEvent.new_object = objects[MouseEvent.obj_idx];
                }
            }
        }
        window.addEventListener('click', tmp_event);
        this.m_event = tmp_event;
    }

    setMove(ray) {
        let tmp_event = (event) => {
            if (MouseEvent.new_object === null || MouseEvent.start_flag)
                return;
            ray.setRay(event.clientX, event.clientY);
            if (MouseEvent.m_flag) {
                if (MouseEvent.c_flag === 0) {
                    let correction = Mat4.sub(ray.ray_des, MouseEvent.new_object.pos);
                    MouseEvent.cor_x = correction[0];
                    MouseEvent.cor_y = correction[1];
                    MouseEvent.c_flag = 1;
                }
                let mov = [ray.ray_des[0] - MouseEvent.cor_x, ray.ray_des[1] - MouseEvent.cor_y, 0];
                MouseEvent.new_object.movePos(mov);
            }
        }
        window.addEventListener('mousemove', tmp_event);
        this.m_event = tmp_event;
    }

    setDown(ray) {
        let tmp_event = (event) => {
            if (MouseEvent.new_object === null || MouseEvent.m_flag === 1 || MouseEvent.start_flag)
                return;
            ray.setRay(event.clientX, event.clientY);
            if (MouseEvent.new_object.collisionRay(ray.ray_des))
                MouseEvent.m_flag = 1;
        }
        window.addEventListener('mousedown', tmp_event);
        this.m_event = tmp_event;
    }

    setUp(objects, ray) {
        
        const modal = this.settingModal();
        let tmp_event = (event) => {
            if (MouseEvent.new_object === null || MouseEvent.start_flag)
                return;
            ray.setRay(event.clientX, event.clientY);
            MouseEvent.m_flag = 0;
            MouseEvent.c_flag = 0;

            if (MouseEvent.new_object.collisionRay(ray.ray_des) === true)
                modal.show();
        }

        window.addEventListener('mouseup', tmp_event);
        this.m_event = tmp_event;

        tmp_event = () => {
            let flag = false;
            if (MouseEvent.new_object.pos[0] >= 14 || MouseEvent.new_object.pos[0] <= -14)
                flag = true;
            if (MouseEvent.new_object.pos[1] >= 7 || MouseEvent.new_object.pos[1] <= -7)
                flag = true;
            let max_x = -100, max_y = -100, min_x = 100, min_y = 100;
			for (let k = 0; k < 4; k++) {
				if (MouseEvent.new_object.colbox.vertices[k][0] > max_x)
					max_x = MouseEvent.new_object.colbox.vertices[k][0];
				if (MouseEvent.new_object.colbox.vertices[k][0] < min_x)
					min_x = MouseEvent.new_object.colbox.vertices[k][0];
				if (MouseEvent.new_object.colbox.vertices[k][1] > max_y)
					max_y = MouseEvent.new_object.colbox.vertices[k][1];
				if (MouseEvent.new_object.colbox.vertices[k][1] < min_y)
					min_y = MouseEvent.new_object.colbox.vertices[k][1];
			}
			if (max_x > 14 || min_x < -14 || max_y > 7 || min_y < -7)
				flag = true;
            if (flag === false) {
                for (let i = 1; i < objects.length; i++) {
                    if (MouseEvent.obj_idx === i)
                        continue;
                    if (MouseEvent.new_object.collision(objects[i])) {
                        flag = true;
                        break;
                    }
                }
            }
            if (flag)
                objects.splice(MouseEvent.obj_idx, 1);
            MouseEvent.new_object = null;
            MouseEvent.obj_idx = 0;
            modal.hide();

            document.getElementById("width").value = 1;
            document.getElementById("height").value = 1;
            document.getElementById("degree").value = 0;
            document.getElementById("red").value = 255;
            document.getElementById("green").value = 255;
            document.getElementById("blue").value = 255;
        }
        document.getElementById('save').addEventListener('click', tmp_event);
        this.child1_event = tmp_event;
        this.child1_type = 'click';

        tmp_event = () => {
            objects.splice(MouseEvent.obj_idx, 1);
            MouseEvent.new_object = null;
            MouseEvent.obj_idx = 0;

            document.getElementById("width").value = 1;
            document.getElementById("height").value = 1;
            document.getElementById("degree").value = 0;
            document.getElementById("red").value = 255;
            document.getElementById("green").value = 255;
            document.getElementById("blue").value = 255;
        }
        document.getElementById('cancel').addEventListener('click', tmp_event);
        this.child2_event = tmp_event;
        this.child2_type = 'click';
        this.setWidth();
        this.setHeight();
        this.setDegree();
        this.setRed();
        this.setGreen();
        this.setBlue();

    }

    setWidth() {
        let tmp_event = () => {
            let width = Math.abs(document.getElementById('width').value);
            let height = Math.abs(document.getElementById('height').value);
            MouseEvent.new_object.setScaleBox(width, height);
        }
        this.input_types.push('width');
        this.input_events.push(tmp_event);
        document.getElementById('width').addEventListener('input', tmp_event);
    }

    setHeight() {
        let tmp_event = () => {
            let width = Math.abs(document.getElementById('width').value);
            let height = Math.abs(document.getElementById('height').value);
            MouseEvent.new_object.setScaleBox(width, height);
        }
        this.input_types.push('height');
        this.input_events.push(tmp_event);
        document.getElementById('height').addEventListener('input', tmp_event);
    }

    setDegree() {
        let tmp_event = () => {
            let d = document.getElementById('degree').value;
            MouseEvent.new_object.rotBox(d);
        }
        this.input_types.push('degree');
        this.input_events.push(tmp_event);
        document.getElementById('degree').addEventListener('input', tmp_event);
    }

    setRed() {
        let tmp_event = () => {
            let r = Math.abs(document.getElementById('red').value);
            r = Math.min(r, 255) / 255;
            let g = Math.abs(document.getElementById('green').value);
            g = Math.min(g, 255) / 255;
            let b = Math.abs(document.getElementById('blue').value);
            b = Math.min(b, 255) / 255;
            MouseEvent.new_object.setColor([r, g, b, 1]);
        }
        this.input_types.push('red');
        this.input_events.push(tmp_event);
        document.getElementById('red').addEventListener('input', tmp_event);
    }

    setGreen() {
        let tmp_event = () => {
            let r = Math.abs(document.getElementById('red').value);
            r = Math.min(r, 255) / 255;
            let g = Math.abs(document.getElementById('green').value);
            g = Math.min(g, 255) / 255;
            let b = Math.abs(document.getElementById('blue').value);
            b = Math.min(b, 255) / 255;
            MouseEvent.new_object.setColor([r, g, b, 1]);
        }
        this.input_types.push('green');
        this.input_events.push(tmp_event);
        document.getElementById('green').addEventListener('input', tmp_event);
    }

    setBlue() {
        let tmp_event = () => {
            let r = Math.abs(document.getElementById('red').value);
            r = Math.min(r, 255) / 255;
            let g = Math.abs(document.getElementById('green').value);
            g = Math.min(g, 255) / 255;
            let b = Math.abs(document.getElementById('blue').value);
            b = Math.min(b, 255) / 255;
            MouseEvent.new_object.setColor([r, g, b, 1]);
        }
        this.input_types.push('blue');
        this.input_events.push(tmp_event);
        document.getElementById('blue').addEventListener('input', tmp_event);
    }

    settingModal() {
        const langNow = document.getElementById("languageSelector").value;
        const modal = new bootstrap.Modal(document.querySelector('.modal'));
        const keyword = {
            '.modal-title' : 'title', '.width' : 'width', 
            '.height' : 'height', '.degree' : 'degree',
            '.red' : 'red', '.green' : 'green', '.blue': 'blue',
            '.save' : 'save', '.cancel' : 'cancel'};
        Object.entries(keyword).forEach(([key, value]) => {
            const set = document.querySelector(`${key}`);
            set.innerText = window.lang[langNow]['custom'][`${value}`];
            set.setAttribute('data-translate', `${value}`);
        });
        
        return modal;
    }
}