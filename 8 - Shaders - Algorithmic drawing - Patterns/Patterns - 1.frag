// Author: Frad Lee
// Title: Patterns - 1

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

vec2 brickTile(vec2 _st, float _zoom){
	_st *= _zoom;
    
    // Setup time
    float time1 = smoothstep(0.0,1.0,mod(sin(u_time),2.0));
    float time2 = smoothstep(0.0,1.0,mod(sin(u_time)-1.0,2.0));

    // Here is where the offset is happening
    _st.y += 2.0 * step(1.0, mod(_st.x,2.0)) * time1;
	_st.y += 2.0 * step(1.0, mod(_st.x + 1.0,2.0)) * -time1;
	_st.x += 2.0 * (step(1.0, mod(_st.y,2.0)) - 1.0) * time2;
	_st.x += 2.0 * (step(1.0, mod(_st.y + 1.0,2.0)) - 1.0) * -time2;
    
    return fract(_st);
}

float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
	return 1.0 - smoothstep(_radius - (_radius * 0.01),
                            _radius + (_radius * 0.01),
                            dot(dist,dist) * 4.0);
}


void main(void){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    // Apply the brick tiling
    st = brickTile(st,9.0);

    color = vec3(circle(st,0.5));
    

    gl_FragColor = vec4(1.0 - color,1.0);
}

