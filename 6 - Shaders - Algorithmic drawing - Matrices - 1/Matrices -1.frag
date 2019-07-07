// Author: Frad Lee
// Title: Matrices

// Verion 1

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

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

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution.xy;  
    
    float time = abs(sin(u_time / 2.0));
    vec3 color = vec3(0);
    
    // Scale
    st -= vec2(0.5);
    st = scale(vec2(time * 2.0)) * st;
    st += vec2(0.5);
    
    // Rotate
    st -= vec2(0.5);
    st = rotate2d(u_time) * st;
    st += vec2(0.5);
    
	vec2 translateInit = vec2(time * 3.0 / 8.0 + 0.125);
    
    // Circle #1
    vec2 translate1= vec2(translateInit.x, 0.5);
	color += vec3(circle(st,translate1,0.05));
    
    // Circle #2
	vec2 translate2 = vec2(1.0 - translateInit.x, 0.5);
    color += vec3(circle(st,translate2,0.05));
    
    // Circle #3
    vec2 translate3 = vec2(translateInit.x, translateInit.y);
    color += vec3(circle(st,translate3,0.05));
    
    // Circle #4
    vec2 translate4 = vec2(translateInit.x, 1.0 -translateInit.y);
    color += vec3(circle(st,translate4,0.05));
    
    // Circle #5
    vec2 translate5 = vec2(1.0 - translateInit.x, 1.0 -translateInit.y);
    color += vec3(circle(st,translate5,0.05));
    
    // Circle #6
    vec2 translate6 = vec2((1.0 - translateInit.x), translateInit.y);
    color += vec3(circle(st,translate6,0.05));
    
    color *= vec3(st.x,st.y,abs(sin(u_time * 3.0)));
    
	gl_FragColor = vec4( color, 1.0 );
}

