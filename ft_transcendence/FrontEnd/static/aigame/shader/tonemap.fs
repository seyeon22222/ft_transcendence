#version 300 es

precision mediump float;

const float exposure = 1.0;
// uniform float exposure;

uniform sampler2D src;

out vec4 fragColor;

void main()
{             
    const float gamma = 2.2;
    vec3 color = texelFetch(src, ivec2(gl_FragCoord.xy), 0).rgb;
  
    // exposure tone mapping
    vec3 mapped = vec3(1.0) - exp(-color * exposure);
    // gamma correction 
    mapped = pow(mapped, vec3(1.0 / gamma));
  
    fragColor = vec4(mapped, 1.0);
}  