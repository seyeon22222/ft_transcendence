#version 300 es

precision mediump float;


uniform samplerCube skybox;
uniform sampler2D	screen_emission;
uniform vec3 	camera_position;
uniform mat4	skybox_world_to_local;

in vec3 world_position;
in vec4	f_normal;

out vec4 fragColor;

vec3	parallaxCast(vec3 pos, vec3 dir) {
	vec3	tpos = (skybox_world_to_local * vec4(pos, 1.0)).xyz;
	vec3	tdir = (skybox_world_to_local * vec4(dir, 0.0)).xyz;
	vec3	dt = (sign(tdir) - tpos) / tdir;
	vec3	local_dir = normalize(tpos + tdir * min(dt.x, min(dt.y, dt.z)));
	vec3	sky = texture(skybox, local_dir, 4.0).xyz;
	
	return sky;
}

void main() {
	vec3 N = normalize(f_normal.xyz);
	vec3 V = normalize(camera_position - world_position);
	vec3 R = reflect(-V, N);
	vec3 diffuse = dot(vec3(0.0, 1.0, 0.0), N) * vec3(0.4, 0.4, 0.4);

	vec3 specular = texture(skybox, R, 4.0).xyz;

	// fragColor = vec4(diffuse + specular, 1.0);
	fragColor = vec4(specular * 0.8 + diffuse * 0.2, 1.0);
	// fragColor = vec4(parallaxCast(world_position, R), 1.0);
}