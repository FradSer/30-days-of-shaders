// Author: Frad Lee
// Title: Lead Light Fork

// Version 1

// http://glslsandbox.com/e#55306.0

#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

void main()
{
	vec2 position = gl_FragCoord.xy / u_resolution.x - 0.5;

	float r = length(position);
	float a = atan(position.y, position.x);
	float t = u_time + 50.0/(r+1.0);

	float light = 15.0*abs(0.05*(sin(t)+sin(u_time+a)));
	vec3 color = vec3(
        -sin(r*5.0-a-u_time + sin(r+t))*sin(r+t),
		sin(r*3.0+a-cos(u_time) + sin(r+t)*sin(r+t)),
        cos(r+a*2.0+log(100.-(a/2.0))+u_time) + sin(r+t)*sin(r+t)
    );

	gl_FragColor = vec4((normalize(color)+.9) * light, 1.0);
}
