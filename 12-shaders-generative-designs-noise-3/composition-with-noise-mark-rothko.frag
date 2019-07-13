// Author: Frad Lee
// Titile: Composition with Noise - Mark Rothko

// Version 1

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

#define D_TB 1.0 / 44.5
#define D_LR (356.0 - 269.0) / 2.0 / 356.0

// Height of 3 parts
#define H_P_1 150.0 / 356.0
#define H_P_2 78.0 / 356.0
#define H_P_3 112.0 / 356.0

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 colorB = vec3(32.0 / 255.0, 37.0 / 255.0, 91.0 / 255.0);
vec3 colorP1 = vec3(57.0 / 255.0, 18.0 / 255.0, 29.0 / 255.0);
vec3 colorP2 = vec3(51.0 / 255.0, 77.0 / 255.0, 169.0 / 255.0);
vec3 colorP3 = vec3(44.0 / 255.0, 44.0 / 255.0, 71.0 / 255.0);

float hash(float n) { return fract(sin(n) * 1e4); }

float noise(float x) {
    float i = floor(x);
    float f = fract(x);
    float u = f * f * (3.0 - 2.0 * f);
    return mix(hash(i), hash(i + 1.0), u);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

vec3 artboard(in float _posN, in float _offset, in float _dT, in float _dB, in float _dRL, in vec2 _st) {
    
    float edgeNoiseXT = noise(_st.x * 200.0 + u_time + _offset),
    	edgeNoiseXB = noise(_st.x * 200.0 + u_time + 2.0 * _offset),
    	edgeNoiseYR = noise(_st.y * 200.0 + u_time + 3.0 * _offset),
    	edgeNoiseYL = noise(_st.y * 200.0 + u_time + 4.0 * _offset);
    
    vec2 t = step(edgeNoiseXT * _posN + _dT, _st); // top
    vec2 b = step(edgeNoiseXB * _posN + _dB, 1.0 - _st); // bottom
    vec2 r = step(edgeNoiseYR * _posN + _dRL, _st); //right
    vec2 l = step(edgeNoiseYL * _posN + _dRL, 1.0 - _st); // left

    return vec3(b.y * t.y * r.x * l.x);
}

vec2 fixedRatio (in vec2 _st) {
    _st = gl_FragCoord.xy / u_resolution.xy;
  if (u_resolution.x > u_resolution.y) {
      float edge = (u_resolution.x - u_resolution.y) / 2.0;
      _st -= vec2(edge/ u_resolution.x, 0.0);
      _st.x *= u_resolution.x / u_resolution.y;
    } else if (u_resolution.x < u_resolution.y){
      float edge = (u_resolution.y - u_resolution.x) / 2.0;
      _st -= vec2(0.0,edge/ u_resolution.y);
      _st.y *= u_resolution.y / u_resolution.x;
    };
    return _st;
}

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main(){
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(0.0);
    
    st = fixedRatio(st);
    
    // color = colorB;
    float frep =  noise(u_time * 2.0) * (abs(sin(u_time)) * 0.5 ) * 0.02;
    
  	// color += colorB;
    color += vec3(
        artboard(0.02, 10.0, D_TB + H_P_2 + H_P_3, D_TB, D_LR , st )) * 
        mix(vec3(
            noise(st * 1000.0) * 
            noise(st * (10000000.0 + abs(sin(u_time))))
        	), colorP1, 1.124);
    
    color += vec3(
        artboard(0.02, 20.0, D_TB + H_P_3, D_TB + H_P_1, D_LR, st)) * 
        mix(vec3(
            noise(st*rotate2d(PI / 1.088) * 100.0) *
            noise(st*rotate2d(PI / 0.328) * 10000000.0)
        	), colorP2, 1.080);
    
    color += vec3(
        artboard(0.02, 30.0, D_TB, D_TB + H_P_1 + H_P_2, D_LR, st)) * 
        mix(vec3(
            noise(st * 1000000.0) * 
        	noise(st*rotate2d(PI / 3.344) * 100.0) *
            noise(st*rotate2d(PI / 4.008) * 10.0)
        	), colorP3, 1.096);
    
    
    gl_FragColor = vec4(color,1.0);
}

