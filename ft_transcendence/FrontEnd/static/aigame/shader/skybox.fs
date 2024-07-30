#version 300 es
precision mediump float;

uniform samplerCube skybox;

in vec2 f_uv;
in vec3 f_v;

out vec4 fragColor;

void main() {
	fragColor = texture(skybox, normalize(f_v));
}