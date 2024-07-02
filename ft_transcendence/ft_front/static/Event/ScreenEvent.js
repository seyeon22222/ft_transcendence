export class ScreenEvent {
    constructor(type) {
        this.type = type;
        this.s_event = null;
        if (type === 'resize')
            this.setResize();
    }

    destructor() {
        window.removeEventListener(this.type, this.s_event);
    }

    setResize() {
        const handleResize = () => {
			canvas.height = window.innerHeight - 50;
			canvas.width = window.innerWidth - 50;
		};
        this.s_event = handleResize;
		window.addEventListener("resize", handleResize);
    }
};