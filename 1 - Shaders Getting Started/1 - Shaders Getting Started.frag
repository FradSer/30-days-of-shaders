// Author: Frad Lee
// Title: 1 - Shaders Getting Started

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution;
	gl_FragColor = vec4(abs(sin(u_time)) * st.x ,abs(sin(u_time)) * st.y,abs(sin(u_time * 2.0)),1.0);
}
