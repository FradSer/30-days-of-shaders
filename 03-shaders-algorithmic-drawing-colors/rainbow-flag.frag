// Author: Frad Lee
// Title: Rainbow Flag

// Verion 1

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 colorA = vec3(0.979,0.019,0.980);
vec3 colorB = vec3(0.071,0.077,0.980);
vec3 colorC = vec3(0.026,0.625,0.980);
vec3 colorD = vec3(0.199,0.980,0.134);
vec3 colorE = vec3(0.980,0.894,0.000);
vec3 colorF = vec3(0.980,0.431,0.084);
vec3 colorG = vec3(0.980,0.008,0.064);

float stepX (in float d){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    return step(d, st.x );
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
	vec3 color = mix(
        mix(
            mix(
                mix(
                    mix(
                        mix(
                            colorA, colorB, stepX(1.0/7.0)
                        ),colorC,stepX(2.0/7.0)
                    ),colorD,stepX(3.0/7.0)
                ),colorE,stepX(4.0/7.0)
            ),colorF,stepX(5.0/7.0)
        ),colorG,stepX(6.0/7.0)
    );

	float x = st.y + sin(u_time);

    gl_FragColor = vec4(color * x  ,1.0);
}
