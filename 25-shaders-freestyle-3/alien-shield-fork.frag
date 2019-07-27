// Author: Frad Lee
// Title: Alien Shield Fork

// Version 1

// https://www.shadertoy.com/view/3slGRH

#ifdef GL_ES
precision mediump float;
#endif

#define SCALE 50.0
#define ROTATION_SPEED 10.0
#define INTENSITY_PULSE_SPEED 1.3

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float getColorComponent(float dist, float angle, float scaleIncrement) {
  return sin(
      (dist * SCALE)
      + angle
      + (cos(dist * SCALE))
      - (u_time *  5.0)
  )
      - dist * (2. + sin(u_time * INTENSITY_PULSE_SPEED))
      + .2;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec2 uv = (gl_FragCoord.xy - .5 * u_resolution.xy) / u_resolution.y;
    float dist = length(uv),
    angle = atan(uv.x, uv.y);
    vec3 color = vec3(0.);

    color += vec3(
        getColorComponent(dist , angle, 2. ),
        getColorComponent(dist  + .1, angle - 0.5, 2. ),
        getColorComponent(dist  + .2, angle - 1.0, 2. )
    ) ;

    gl_FragColor = vec4(color,1.0);
}
