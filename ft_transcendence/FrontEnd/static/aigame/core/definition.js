
// const CANVAS_WIDTH = 480;
// const CANVAS_HEIGHT = 320;
const CANVAS_WIDTH = 768 * 2;
const CANVAS_HEIGHT = 480 * 2;

let canvas = null;
let ctx = null;

let gl_canvas = null;
let gl = null;

export { CANVAS_WIDTH, CANVAS_HEIGHT, canvas, ctx, gl_canvas, gl };

export function canvas_init() {
    canvas = document.getElementById("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    ctx = canvas.getContext("2d");
    gl_canvas = new OffscreenCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    gl = gl_canvas.getContext("webgl2");
    gl.getExtension("EXT_color_buffer_float");
}

