// Author: Frad Lee
// Title: Lines

// Version 1

#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

vec4 grid(vec2 _pos){
	vec4 color = vec4(0.0);

    float fac = cos(20.0 * _pos.x * cos(100.0 * _pos.y - 10000.0 * _pos.x) + u_time * PI);

    if(fac < -0.9){
    	fac = 1000.0 * (fac);
   		color += abs(fac);
    }

	return color;
}


void main(void){
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    vec4 color = vec4(0.0);
    vec2 pos = vec2(st);

    color += grid(st);

    gl_FragColor = vec4(color);
}
