// Author: Frad Lee
// Title: Sunrise to Sunset

// Verion 1

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 colorA = vec3(0.662,0.463,0.995);
vec3 colorB = vec3(1.000,0.689,0.001);

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    float pct = st.y * (ceil(sin(u_time)) + floor(sin(u_time))) * abs(sin(u_time));

    vec3 color = vec3(0.0);

    color = mix(colorA, colorB, pct);


    gl_FragColor = vec4(color,1.0);
}
