// Author: Frad Lee
// Title: Eye of Providence

// Version 1

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

float noise( in vec2 _st )
{
  vec2 i = floor( _st );
  vec2 f = fract( _st );
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
  // Initial values
  float value = .0;
  float amplitud = .5;
  float frequency = 0.;

  // Loop of octaves
  for ( int i = 0; i < OCTAVES; i++ ) {
    value += amplitud * noise(_st);
    _st *= 2.;
    amplitud *= .5;
  }
  return value;
}

float circle(in vec2 _st, in float _radius){
	vec2 dist = _st - vec2( .5 );
	return 1. - smoothstep( _radius - ( _radius * .01 ) - .02,
    _radius + ( _radius * .01 ) + .02,
    dot( dist * 2., dist ) * 4. );
}

void main() {

  //
  // setup
  //

  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  float f = 1.;
  vec3 color = vec3( 0., 0., 0.);

  float frep =  hash( u_time * 20. ) *
      ( abs( sin( u_time ) ) * .5 ) * .02;

  // Remap the space to -1. to 1.
  vec2 p = -1. + 2. * st;

  //
  // triangle
  //

  p += vec2(.0, .2);

  // Number of sides of triangle
  int N = 3;

  // Angle and radius from the current pixel
  float a = atan( p.x, p.y ) + PI;
  float r = TWO_PI / float( N );

  // Shaping function that modulate the distance
  float d = cos( floor( .5 + a / r ) * r - a ) * length( p );

  // big lights
  p += vec2( .0, 0.1);
  a = atan( p.y, p.x * ( 1. + frep )) ;
  f = fbm( vec2( r * 30. + u_time, a * 15. + u_time) ) ;
  f = smoothstep ( .2 * .1, 1. , f) ;
  color = mix( color, vec3( 1. ), f ) ;

  color += 1. - vec3( smoothstep( .4 - .02, .4 + .02, d ));

  //
  // circle
  //

  st *= vec2( 1., 2. );
  st -= vec2( .0, .2 );
  float c = circle( st, .4 );
  color -= vec3( 1. ) * c;

  //
  // eye ball
  //

  // draw a circle
  r = sqrt( dot( p, p ) );

  // animation
  float ss = .5 + .5 * sin( 4. * u_time );
  float anim = 1. + .1 * ss * clamp( 1. - r, .0, 1. );

  // define diameter of eye
  float diameter = .2;

  if ( r < diameter ) {
    float a = 0.;
    float f = 1.;

    color = vec3( .5, .5, .5);

    // color variation
    f = fbm( p * 5.);
    color = mix (color, vec3( 0., 0., 0. ), f);
    f *= anim * 2.;

    // light
    f = smoothstep( diameter * .6, diameter * .3, r);
    color = mix( color, vec3( 1., 1., 1. ), f);

    // reflection
    f = 1. - smoothstep(
      .0, diameter * .2, length( p - vec2( diameter * .2, diameter *.5 ))
      );
    color += vec3(f);

    // white pattern
    p *= rotate2d(u_time * .2 ); // animation
    a = atan( p.y, p.x * ( 1. + frep ));
    f = fbm( vec2( r * 20. + u_time * 2., a * 5. + u_time * 2.) );
    f = smoothstep ( diameter * .1, 1., f);
    color = mix( color, vec3(1.), f);

    // black border
    f = smoothstep( diameter * 1.1, diameter * .7, r);
    color *= f;

    // anti-aliasing
    f = smoothstep( diameter * .9, diameter * 1.1, r);
    color = mix( color, vec3(1.), f);

    // pupi
    f = smoothstep( diameter * .2, diameter * .4, r);
    color *= f;
  }

  gl_FragColor = vec4( color, 1. );
}
