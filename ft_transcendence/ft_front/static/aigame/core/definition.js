
// const CANVAS_WIDTH = 480;
// const CANVAS_HEIGHT = 320;
window.CANVAS_WIDTH = 512;
window.CANVAS_HEIGHT = 512;

export let canvas = null;
export let ctx = null

export let gl_canvas = null;
export let gl = null;
export function canvas_init() {
    canvas = document.getElementById("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    ctx = canvas.getContext("2d");
    
    gl_canvas = new OffscreenCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    gl = gl_canvas.getContext("webgl2");
    gl.getExtension('EXT_color_buffer_float');
}
