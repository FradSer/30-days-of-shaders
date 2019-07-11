// Author: Frad Lee
// Title: Noise - 1

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float rand(float c){
	return fract(sin(dot(c ,12.9898)) * 43758.5453);
}

float noise(float x) {
	float i = floor(x);
	float f = fract(x);
	float u = f * f * (5.0 - 2.0 * sin(f) );
	return mix(rand(i), rand(i + 1.0), u);
}

float circel(in vec2 _st){
	vec2 dist = _st-vec2(0.5);
	return 1.0 - dot(dist,dist) * 10.0;
}

void main(void){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;

  vec3 color = vec3(0.0);

	st.x = noise(st.x*u_time * 3.0);

  color = vec3(circel(st));
	
  gl_FragColor = vec4(1.0 - color,1.0);
}
