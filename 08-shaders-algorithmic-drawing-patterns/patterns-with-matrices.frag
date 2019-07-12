// Author: Frad Lee
// Title: Pattern with Matrices

// Verion 2
// Fork from Matrices - 1

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform vec2 position;

float circle(in vec2 _st, in vec2 _center, in float _radius){
    vec2 dist = _st-vec2(_center);
	return 1.0 - smoothstep(_radius - (_radius * 0.01),
                            _radius + (_radius * 0.01),
                            dot(dist,dist) * 4.0);
}


mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

vec2 tile(vec2 _st, float _zoom){
    _st *= _zoom;
    return fract(_st);
}

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution.xy;

    float time = sin(u_time);
    vec3 color = vec3(0);

    st = tile(st,-time);

    st += st * 2.0;
    st -= vec2(sqrt(2.0));

    // Rotate
    st = rotate2d(u_time) * st;

    // Scale
    st = scale(vec2(time / 2.0 + 1.0)) * st;


    // Circles
	vec2 translateInit = vec2(-time);

    // Magic
    st *= vec2(st.y,st.x);

	color += vec3(circle(st,translateInit,0.1));
	color += vec3(circle(st * rotate2d(PI / 4.0),translateInit,0.1));
	color += vec3(circle(st * rotate2d(PI / -4.0),translateInit,0.1));
	color += vec3(circle(st * rotate2d(PI / 8.0),translateInit,0.1));
	color += vec3(circle(st * rotate2d(PI / -8.0),translateInit,0.1));

    st -= vec2(0.5);
    st = st * rotate2d(PI / 2.0);
    st += vec2(0.5);

	color += vec3(circle(st,translateInit,0.1));
	color += vec3(circle(st * rotate2d(PI / 4.0),translateInit,0.1));
	color += vec3(circle(st * rotate2d(PI / -4.0),translateInit,0.1));
	color += vec3(circle(st * rotate2d(PI / 8.0),translateInit,0.1));
	color += vec3(circle(st * rotate2d(PI / -8.0),translateInit,0.1));


    st -= vec2(0.5);
    st = st * rotate2d(PI / 2.0);
    st += vec2(0.5);

	color += vec3(circle(st,translateInit,0.1));
	color += vec3(circle(st * rotate2d(PI / 4.0),translateInit,0.1));
	color += vec3(circle(st * rotate2d(PI / -4.0),translateInit,0.1));
	color += vec3(circle(st * rotate2d(PI / 8.0),translateInit,0.1));
	color += vec3(circle(st * rotate2d(PI / -8.0),translateInit,0.1));


    st -= vec2(0.5);
    st = st * rotate2d(PI / 2.0);
    st += vec2(0.5);

	color += vec3(circle(st,translateInit,0.1));
	color += vec3(circle(st * rotate2d(PI / 4.0),translateInit,0.1));
	color += vec3(circle(st * rotate2d(PI / -4.0),translateInit,0.1));
	color += vec3(circle(st * rotate2d(PI / 8.0),translateInit,0.1));
	color += vec3(circle(st * rotate2d(PI / -8.0),translateInit,0.1));


    st *= rotate2d(fract(abs(time)) * 10.0);

    color *= vec3(st.x,st.y,abs(sin(u_time * 3.0)));

	gl_FragColor = vec4( color, 1.0 );
}
