// Author: Frad Lee
// Title: Circle Wave

// Version 1

// https://thebookofshaders.com/edit.php#11/circleWave-noise.frag
// https://www.flickr.com/photos/7554601@N06/

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float hash(in float _n)
{
  return fract( sin( _n ) * 43758.5453123 );
}

vec2 random2(vec2 _st){
  _st = vec2( dot(_st,vec2(127.1,311.7)),
    dot(_st,vec2(269.5,183.3)) );
  return -1.0 + 2.0*fract(sin(_st)*43758.5453123);
}

// Value Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/lsf3WH
float noise(vec2 _st) {
  vec2 i = floor(_st);
  vec2 f = fract(_st);

  vec2 u = f*f*(3.0-2.0*f);

  return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                   dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
              mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                   dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

mat2 rotate2d(float _angle){
  return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

float shape(vec2 st, float radius) {
	st = vec2(0.5)-st;
  float r = length(st)*2.0;
  float a = atan(st.y,st.x);
  float m = abs(mod(a+ u_time*2.,TWO_PI)-PI)/.9;
  float f = radius;
  m += noise(st+u_time*0.5)*5.;
  f += sin(a*5.)*noise(st+u_time*.1)*.1;
  f += (sin(a*2.)*pow(m,2.))*.002;
  return 1.-smoothstep(f,f+(200. + hash(u_time * 20.0))*0.0002,r);
}

float shapeBorder(vec2 st, float radius, float width) {
  return shape(st,radius)-shape(st + vec2(0.013), radius - width);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution.xy;

	// move space from the center to the vec2(0.0)
  st -= vec2(0.5);
  // rotate the spacec
  st *= rotate2d(u_time*PI *.05);
  // move it back to the original place
  st += vec2(0.5);

  vec3 color = vec3(1.0);

	color *= shapeBorder(st,0.7,0.04);

	gl_FragColor = vec4( color, 1.0 );
}
