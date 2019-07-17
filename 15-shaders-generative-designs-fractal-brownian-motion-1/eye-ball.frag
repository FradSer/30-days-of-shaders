// Author: Frad Lee
// Title: Eye Ball

// Version 1

// http://wannemag.blogspot.com/2014/11/glsl-eye-ball.html

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
  return fract( sin(_n) * 43758.5453123 );
}

float noise( in vec2 _st )
{
  vec2 i = floor(_st);
  vec2 f = fract(_st);
  f = f * f * ( 3. - 2. * f );
  float n = i.x + i.y * 57.;
  float res = mix( mix( hash( n +  0. ), hash( n +  1. ), f.x ),
  	mix( hash( n + 57. ), hash( n + 58. ) ,f.x ), f.y );
  return res;
}

mat2 rotate2d(float _angle){
  return mat2(cos(_angle),-sin(_angle),
    sin(_angle),cos(_angle));
}

#define OCTAVES 6
float fbm (in vec2 _st) {
  // initial values
  float value = 0.0;
  float amplitud = .5;
  float frequency = 0.;

  // loop of octaves
  for (int i = 0; i < OCTAVES; i++) {
    value += amplitud * noise(_st);
    _st *= 2.;
    amplitud *= .5;
  }
  return value;
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  vec3 color = vec3( 1. );

  // remap the space to -1. to 1.
  vec2 p = -1. + 2. * st;
  p.x *= u_resolution.x / u_resolution.y;

  float r = sqrt( dot( p, p ) );

  // animation
  float ss = 0.5 + 0.5 * sin(4.0 * u_time);
  float anim = 1.0 + 0.1 * ss * clamp( 1. - r, 0.0, 1.0);
  r *= anim;

  if ( r < .8 ) {
    float a = 0.;
    float f = 1.;

    color = vec3(0.1,0.4,0.5);

    // color variation
    f = fbm( p * 5.);
    color = mix (color, vec3(0.0,0.6,0.4), f);
            f *= anim * 2.0;

    // yellow center
    f = smoothstep( .5, .2, r);
    color = mix( color, vec3(0.9,0.7,0.2), f);

    // reflection
    f = 1. - smoothstep(
      .0, .2, length( p - vec2( .1, .3 ))
      );
    color += vec3(f);

    // white pattern
    p *= rotate2d(u_time * .2 ); // animation
    a = atan( p.y, p.x );
    f = fbm( vec2( r * 5., a * 20. ) );
    f = smoothstep ( .3, 1., f );
    color = mix( color, vec3(1.), f);

    // black flecks
    f = fbm( vec2( r * 10., a * 16. ));
    f = smoothstep( .4, 1., f );
    color *= ( 1. - f * .7 );

    // black border
    f = smoothstep( .9, .55, r );
    color *= f;

    // anti-aliasing
    f = smoothstep( .75, .8, r );
    color = mix( color, vec3(1.), f );

    // pupi
    f = smoothstep( .25 - anim * 0.1, .25, r );
    color *= f;
  }

  gl_FragColor = vec4( color, 1.0 );
}
