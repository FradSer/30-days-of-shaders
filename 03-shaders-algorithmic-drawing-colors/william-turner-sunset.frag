#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform float u_time;

vec3 mixer_1( in vec3 c ){
    return c.z * mix( vec3(0.007,0.044,0.995), vec3(0.980,0.815,0.370), c.y);
}

vec3 mixer_2( in vec3 c ){
    return c.z * mix( vec3(0.995,0.940,0.018), vec3(0.995,0.169,0.342), c.y);
}

vec3 mixer_3( in vec3 c ){
    return c.z * mix( vec3(0.521,0.501,0.995), vec3(0.989,0.990,0.751), c.y);
}

void main(){
  vec2 st = gl_FragCoord.xy / u_resolution;

    // Use polar coordinates instead of cartesian
    vec2 toCenter_1 = vec2(0,1.5)-st;
    vec2 toCenter_2 = vec2(0.8,0.4)-st;
    vec2 toCenter_3 = vec2(0.2,0.2)-st;
    float angle_1 = atan(toCenter_1.y,toCenter_1.x);
    float angle_2 = atan(toCenter_2.y,toCenter_2.x);
    float angle_3 = atan(toCenter_3.y,toCenter_3.x);
    float radius_1 = length(toCenter_1);
    float radius_2 = length(toCenter_2);
    float radius_3 = length(toCenter_3);

    // Map the angle (-PI to qaAPI) to the Hue (from 0 to 1)
    // and the Saturation to the radius.
    // smooth the edge of angle with simple animation
    vec3 color_1 = mixer_1(vec3((angle_1/TWO_PI),smoothstep(0.0,(sin(u_time * 2.0)/4.0 + 0.75),radius_1),1.0));
    vec3 color_2 = mixer_2(vec3((angle_2/TWO_PI),smoothstep(0.0,(sin(u_time  * 2.0)/4.0 + 0.75),radius_2),1.0));
    vec3 color_3 = mixer_3(vec3((angle_2/TWO_PI),smoothstep(0.0,(sin(u_time  * 2.0)/4.0 + 0.75),radius_3),1.0));

    gl_FragColor = vec4((color_1 + color_2 + color_3) / 3.0, 1.0);
}


