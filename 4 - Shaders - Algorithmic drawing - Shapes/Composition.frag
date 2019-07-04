// Author: Frad Lee
// Title: Composition

// Version 1

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Composition
vec2 bl(vec2 st, vec2 pct){
  return  (step( 0.450 - pct, st) + step(pct, st)) *
      (step(0.9 - pct.y , st.y) - step(pct.y - 0.4, st.y)) *
      (step(1.1 - pct.x , st.x) - step(pct.x - 0.65, st.x));
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    vec2 composition = bl(vec2(0.2,0.2) * abs(sin(u_time)),st);

    float pct = composition.x * composition.y;

    color = vec3(pct);

    gl_FragColor = vec4(color,1.0);
}
