
// const CANVAS_WIDTH = 480;
// const CANVAS_HEIGHT = 320;
const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 512;

const canvas = document.getElementById("canvas");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
const ctx = canvas.getContext("2d");

const gl_canvas = new OffscreenCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
const gl = gl_canvas.getContext("webgl2");
gl.getExtension('EXT_color_buffer_float');
