// Author: Frad Lee
// Title: Nosie 2

// Verion 1

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// https://www.shadertoy.com/view/4dS3Wd
float hash(float _n) { return fract(sin(_n) * 1e4); }

float noise(float _x) {
    float i = floor(_x);
    float f = fract(_x);
    float u = f * f * (3.0 - 2.0 * f);
    return mix(hash(i), hash(i + 1.0), u);
}

float line (vec2 _pos, float _posX, float _posY){
    return 0.04 / length(vec2(_posX, _posY) - _pos);
}
void main() {
    vec2 st = (gl_FragCoord.xy * 2.0 - u_resolution) /
        max(u_resolution.x, u_resolution.y);

    st *= vec2(2.0, 1.0);
    st += vec2(0.0, 0.5);

    float offset = abs(atan(u_time)) * 10.0;

    vec3 color = vec3(line(st, st.x, noise(sin(st.x) + u_time)));
    color *= vec3(line(st, st.x, noise(sin(st.x + offset) + u_time)));

    gl_FragColor = vec4(color, 1.0);
}
