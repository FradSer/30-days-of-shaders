// Author: Frad Lee
// Title: Composition - 2

// Version 3

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 colorArtboar = vec3(244.0/255.0,236.0/255.0,218.0/255.0);
vec3 colorRedBolck = vec3(171.0/255.0,35.0/255.0,37.0/255.0);
vec3 colorYellowBolck = vec3(252.0/255.0,196.0/255.0,51.0/255.0);
vec3 colorBlueBolck = vec3(0.0/255.0,96.0/255.0,154.0/255.0);

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

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    st = fixedRatio(st);

    vec3 color = vec3(0.0);

    // Red Block
    float redBlockX = step(0.6/8.0 ,st.x) - step(2.0/8.0,st.x);
    float redBlockY = step(5.2/8.0 ,st.y);
    float redBlock = redBlockX * redBlockY;
    vec3 pctRedBlock = redBlockX * redBlockY * colorRedBolck;

    // Yellow Block
    float yellowBlockX = step(7.2/8.0 ,st.x) - step(7.4/8.0,st.x);
    float yellowBlockY = step(5.2/8.0 ,st.y);
    float yellowBlock = yellowBlockX * yellowBlockY;
    vec3 pctYellowBlock = yellowBlockX * yellowBlockY * colorYellowBolck;

    // Blue Block
    float blueBlockX = step(5.75/8.0 ,st.x) - step(7.4/8.0,st.x);
    float blueBlockY = 1.0 - step(0.6/8.0 ,st.y);
    float blueBlock = blueBlockX * blueBlockY;
    vec3 pctBlueBlock = blueBlockX * blueBlockY * colorBlueBolck;

    // Background
    float backgroundX = 1.0 - step((0.6/8.0) ,st.x) +  step((7.4/8.0) ,st.x);
    float background = backgroundX;
    vec3 pctBackground = vec3(background - redBlock - blueBlock - yellowBlock) * vec3(1.0);

    // Artboard
    float  artboardX = step((0.6/8.0) ,st.x) - step((7.4/8.0),st.x);
    float artboard = artboardX ;
    vec3 pctArtboard = vec3(artboard) * colorArtboar;

     // Horizontal Lone Line
    float hLLine = 1.0 -
        (step((0.6/8.0) ,st.y) - step((0.8/8.0) ,st.y)) -
        (step((5.0/8.0) ,st.y) - step((5.2/8.0) ,st.y)) -
        (step((6.3/8.0) ,st.y) - step((6.5/8.0) ,st.y));
    float pctHLine = hLLine;

    // Vertical Lone Line
    float vLLine = 1.0 -
        (step((2.0/8.0) ,st.x) - step((2.2/8.0) ,st.x)) -
        (step((5.6/8.0) ,st.x) - step((5.8/8.0) ,st.x)) -
        (step((7.0/8.0) ,st.x) - step((7.2/8.0) ,st.x));
    float pctVLLine = vLLine;

    // Vertical Short Line
    float vSLineX = step(1.05 / 8.0 ,st.x) - step(1.20/8.0,st.x);
    float vSLineY = step(5.2 / 8.0 ,st.y);
    float pctVSLine = vSLineX * vSLineY;

    color = pctBackground + pctArtboard *
        ((pctVLLine - pctVSLine) * pctHLine) +
        pctRedBlock + pctBlueBlock + pctYellowBlock;

    gl_FragColor = vec4(color,1.0);
}
