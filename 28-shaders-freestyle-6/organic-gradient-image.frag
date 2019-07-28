// Author: Frad Lee
// Title: Organic Gradient Image

// Version 1

#ifdef GL_ES
precision mediump float;
#endif

// texure form https://heypik.com/backgrounds/dazzling-laser-fluid-gradient-background-template_8XU448V.html
uniform sampler2D u_tex0; // https://dsc.cloud/c05567/ai-dazzling-laser-fluid-gradient-background-template-heypik-8XU448V.jpg

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// https://github.com/hughsk/glsl-noise/blob/7870430c384bd53488ff6fe9a47f8a6f571524c4/simplex/2d.glsl
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
// First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

// Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

// Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

// Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// https://github.com/AnalyticalGraphicsInc/cesium/blob/master/Source/Shaders/Builtin/Functions/saturation.glsl
vec3 czm_saturation(vec3 rgb, float adjustment)
{
    // Algorithm from Chapter 16 of OpenGL Shading Language
    const vec3 W = vec3(0.2125, 0.7154, 0.0721);
    vec3 intensity = vec3(dot(rgb, W));
    return mix(intensity, rgb, adjustment);
}

// https://github.com/kinectron/Three-Kinectron/blob/master/src/shaders/kinectron.frag
//Thanks to this excelent post - http://alaingalvan.tumblr.com/post/79864187609/glsl-color-correction-shaders
vec3 brightnessContrast(vec3 value, float brightness, float contrast)
{
    return (value - 0.5) * contrast + 0.5 + brightness;
}

void main() {

    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    float s = snoise(vec2(st.x, st.y * 1.5 + u_time / 2.));

    st *= vec2( 1. + s * ( 0.3) );
    st.x += sin(u_time) * 0.2 + 0.2;
    st.y += sin(u_time) * 0.1 + 0.1;

    vec3 color = vec3(0.);

    color = texture2D( u_tex0, vec2(st.x * .5, st.y) / 1.5 ).xyz;

    color = czm_saturation( color, 1.2 );

    color = brightnessContrast( color, -.1, 1. );

    gl_FragColor = vec4(color,1.0);
}
