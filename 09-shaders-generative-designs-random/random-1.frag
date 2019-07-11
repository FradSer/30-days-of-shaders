// Author: Frad Lee
// Title: Random - 1

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (in float _x) {
    return fract(
        sin(
            dot(_x, 12.989)
        ) * 43758.5453123
    );
}

float colorPct(in float _x, in float _freq, in float _time) {
    return step(
        0.7, random(
            floor(_x * _freq) +
            floor( _time )
        )
    );
}

// Fork frim Patterns - 1
vec2 brickTile(vec2 _st, vec2 _zoom, float _time){
    _st *= _zoom;

  	_st.x += (step(1.0, mod(_st.y,2.0)) - 1.0) * _time / 2.0;
  	_st.x += (step(1.0, mod(_st.y + 1.0,2.0)) - 1.0) * - _time /  2.0;;
    return fract(_st);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(1.0);

    float freq = random(floor(u_time * 2.0));
    float time = u_time * freq;

    st *= brickTile(st, vec2(1.0, 2.0 * freq), time);

    color = vec3(
        colorPct(st.x, freq * 190.0,time)
    );

    gl_FragColor = vec4(1.0 - color, 1.0);
}
