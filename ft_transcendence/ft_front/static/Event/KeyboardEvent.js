export class KeyboardEvent {
    constructor(type, cam, ws) {
        this.type = null;
        this.k_event = null;
        if (type === 'keyup')
            this.setKeyUp(cam, ws);
        if (type === 'keydown')
            this.setKeyDown(cam, ws);
    }

    destructor() {
        window.removeEventListener(this.type, this.k_event);
    }

    setKeyUp(cam, ws) {
        let tmp_event = (event) => {
            let message = { message: event.key, players: window.players};
            let flag = 0;
            if (event.code === "KeyQ") {
                message = { message: "upstop", players: window.players};
                flag = 1;
            }
            if (event.code == "KeyA") {
                message = { message: "downstop", players: window.players};
                flag = 1;
            }
            if (event.code === "ArrowRight" || event.code === "ArrowLeft")
                cam.rotCam(0);
            if (flag) ws.send(JSON.stringify(message));
        }
        window.addEventListener('keyup', tmp_event);
        this.type = 'keyup';
        this.k_event = tmp_event;
    }

    setKeyDown(cam, ws) {
        let tmp_event = (event) => {
            let message = { message: event.key, players: window.players};
            let flag = 0;
            if (event.code === "KeyQ") {
                message = { message: "up", players: window.players};
                flag = 1;
            }
            if (event.code === "KeyA") {
                message = { message: "down", players: window.players};
                flag = 1;
            }
            if (event.code === "ArrowRight")
                cam.rotCam(Math.min(45, cam.degree + 1));
            if (event.code === "ArrowLeft")
                cam.rotCam(Math.max(-45, cam.degree - 1));
            if (flag) ws.send(JSON.stringify(message));
        }
        window.addEventListener('keydown', tmp_event);
        this.type = 'keydown';
        this.k_event = tmp_event;
    }
}