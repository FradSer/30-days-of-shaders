// Author: Frad Lee
// Title: Procedural Warping - 1

// Version 1

// Most codes fork from "Warping - procedural 2"
// https://www.shadertoy.com/view/lsl3RH

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

float noise( in vec2 p )
{
  return sin(p.x)*sin(p.y);
}

float fbm4( vec2 p )
{
  float f = 0.0;
  f += 0.5000*noise( p ); p = m*p*2.02;
  f += 0.2500*noise( p ); p = m*p*2.03;
  f += 0.1250*noise( p ); p = m*p*2.01;
  f += 0.0625*noise( p );
  return f/0.9375;
}

#define OCTAVES 6
float fbm6 (in vec2 _st) {
  // initial values
  float value = .0;
  float amplitud = .5;
  float frequency = .5;

  // loop of octaves
  for (int i = 0; i < OCTAVES; i++) {
    value += amplitud * (frequency + frequency * noise( _st ));
    _st *= 2.;
    amplitud *= .5;
  }

  return value / .96875;
}

vec2 fbm4_2( vec2 p )
{
  // return vec2(fbm4(p - vec2(.9)), fbm4(p+vec2(.8)));
  return vec2(fbm4(p));
}

vec2 fbm6_2( vec2 p )
{
  // return vec2(fbm6(p+vec2(16.8)), fbm6(p+vec2(11.5)));
  return vec2(fbm6(p));
}

//====================================================================


mat2 rotate2d(float _angle){
  return mat2(cos(_angle),-sin(_angle),
    sin(_angle),cos(_angle));
}

// f(p) = fbm( p + fbm( p + fbm( p )) )
float func( vec2 q, out vec4 ron )
{
  q += 0.03*noise( vec2(0.27,0.23)* u_time + length(q)*vec2(4.1,4.3));

  vec2 o = fbm4_2( 0.9*q );

  o += 0.04*noise( vec2(0.12,0.14)* u_time * 10.0 + length(o));

  vec2 n = fbm6_2( 3.0*o );

  ron = vec4( o, n );

  float f = 0.5 + 0.5*fbm4( 1.8*q + 6.0*n );

  return mix( f, f*f*f*3.5, f*abs(n.x) );
}

void main( ) {
  vec2 p = (2.0*gl_FragCoord.xy - u_resolution.xy)/u_resolution.y;
  float e = 2.0/u_resolution.y;

  p *= 3.5;
  p *= rotate2d(u_time * .05);

  vec4 on = vec4(0.0);
  float f = func(p, on);

  vec3 col = vec3(0.0);
  col = mix( vec3(0.2,0.1,0.4), vec3(0.3,0.05,0.05), f );
  col = mix( col, vec3(0.9,0.9,0.9), dot(on.zw,on.zw) );
  col = mix( col, vec3(0.4,0.3,0.3), 0.2 + 0.5*on.y*on.y );
  col = mix( col, vec3(0.0,0.2,0.4), 0.5*smoothstep(1.2,1.3,abs(on.z)+abs(on.w)) );
  col = clamp( col*f*2.0, 0.0, 1.0 );

  // manual derivatives - better quality, but slower
	vec4 kk;
  vec3 nor = normalize( vec3( func(p+vec2(e,0.0),kk)-f,
    2.0*e,
    func(p+vec2(0.0,e),kk)-f ) );

  vec3 lig = normalize( vec3( 0.9, 0.2, -0.4 ) );
  float dif = clamp( 0.3+0.7*dot( nor, lig ), 0.0, 1.0 );
  vec3 lin = vec3(0.70,0.90,0.95)*(nor.y*0.5+0.5) + vec3(0.15,0.10,0.05)*dif;
  col *= 1.2*lin;
  col = 1.0 - col;
  col = 1.1*col*col;

  gl_FragColor = vec4( col, 1.0 );
}
