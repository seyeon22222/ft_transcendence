#version 300 es

uniform mat4 V;
uniform mat4 P;

in vec4 position;
in vec2 uv;

out vec2 f_uv;
out vec3 f_v;

void main() {
	vec3 t = (V * vec4(position.xyz, 0.0)).xyz;
	gl_Position = P * vec4(t, 1.0);
	f_uv = uv;
	f_v = position.xyz;
}