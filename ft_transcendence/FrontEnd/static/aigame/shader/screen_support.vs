#version 300 es

uniform mat4 M;
uniform mat4 V;
uniform mat4 P;

in vec4 position;
in vec3 normal;

out vec3 world_position;
out vec4 f_normal;

void main() {
	world_position = (M * vec4(position.xyz, 1.0)).xyz;
	f_normal = transpose(inverse(M)) * vec4(normal, 0.0);
	gl_Position = P * V * vec4(world_position, 1.0);
}