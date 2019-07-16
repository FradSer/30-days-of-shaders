// Author: Frad Lee
// Title: Cellular Unicorn Puke

// Version 1

// Most codes forked from "Unicorn Puke" by Nicolas Barradeau

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.1415926535897932384626433832795

//this is a basic Pseudo Random Number Generator
float hash(in float n)
{
    return fract(sin(n)*43758.5453123);
}

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

void main() {

    //"squarified" coordinates
    vec2 xy = (gl_FragCoord.xy * 2.0 - u_resolution) / min (u_resolution.x, u_resolution.y);

    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    //rotating light
    vec3 center = vec3( sin( u_time ), 1., cos( u_time * .5 ));

    // Scale
    xy *= 2.;

    // Tile the space
    vec2 i_st = floor(st);

    //temporary vector
    vec3 pp = vec3(0.);

    //maximum distance of the surface to the center
    // (try a value of 0.1 for example)
    float length = 5.;

    //this is the number of cells
    const float count = 20.;

    for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
            for( float i = 0.; i < count; i+=1. ) {
                // Neighbor place in the grid
                vec2 neighbor = vec2(float(x),float(y));

                // Fabricate point
                vec2 point = vec2(0);
                point = random2(i_st + neighbor);

                //random cell: create a point around the center

                //gets a 'random' angle around the center
                float an = sin( u_time * PI * .000005 ) - hash( i ) * PI * 2.;

                //gets a 'random' radius ( the 'spacing' between cells )
                float ra = sqrt( hash( an ) ) * .5;

                //creates a temporary 2d vector with point
                vec2 p = vec2( center.x + cos( an ) * ra,
                  center.z + sin( an ) * ra ) + neighbor + point;

                //finds the closest cell from the fragment's XY coords

                //compute the distance from this cell
                //to the fragment's coordinates
                float di = distance( xy, p );

                //and check if this length is inferior to the minimum length
                length = min( length, di );

                //if this cell was the closest
                if( length == di )
                {
                    //stores the XY values of the cell
                    // and compute a 'Z' according to them
                    pp.xy = p;
                    pp.z = i / count * xy.x * xy.y;
                }
            }
        }
    }

    //shimmy shake:
    //uses the temp vector's coordinates and uses the angle and the temp vector
    //to create light & shadow (quick & dirty )
    vec3 shade = vec3( .5 ) * ( 1. - max( 0.0, dot( pp, center ) ) );

    //final color
    gl_FragColor = vec4( pp + shade, 1. );

}
