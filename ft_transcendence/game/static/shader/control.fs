#version 300 es

precision mediump float;

uniform sampler2D albedo_texture;
uniform sampler2D emission_texture;

const vec3 rim_color = vec3(1.0, 1.0, 2.5);

in vec4 world_position;
in vec4 f_normal;
in vec2 f_uv;

out vec4 fragColor;

void main() {
	vec3 albedo = texture(albedo_texture, f_uv).rgb;
	float emission = texture(emission_texture, f_uv).r;

	vec3 normal = normalize(f_normal.xyz);
	vec3 diffuse = dot(vec3(0.0, 1.0, 0.0), normal) * albedo + emission * rim_color;
	fragColor = vec4(diffuse, 1.0);
}