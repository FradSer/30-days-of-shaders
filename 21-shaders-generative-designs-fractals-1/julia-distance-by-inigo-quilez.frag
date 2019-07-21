// The MIT License
// Copyright © 2013 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// learn more here: // http://www.iquilezles.org/www/articles/distancefractals/distancefractals.htm

#ifdef GL_ES
precision mediump float;
#endif

#define AA 2

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float calc( vec2 p, float time )
{
    // non p dependent
	float ltime = 0.5-0.5*cos(time*0.06);
    float zoom = pow( 0.9, 50.0*ltime );
	vec2  cen = vec2( 0.2655,0.301 ) + zoom*0.8*cos(4.0+2.0*ltime);

	vec2 c = vec2( -0.745, 0.186 ) - 0.045*zoom*(1.0-ltime*0.5);

    //
    p = (2.0*p-u_resolution.xy)/u_resolution.y;
	vec2 z = cen + (p-cen)*zoom;

    // full derivatives version
	vec2 dz = vec2( 1.0, 0.0 );
	for( int i=0; i<256; i++ )
	{
		dz = 2.0*vec2(z.x*dz.x-z.y*dz.y, z.x*dz.y + z.y*dz.x );
        z = vec2( z.x*z.x - z.y*z.y, 2.0*z.x*z.y ) + c;
		if( dot(z,z)>200.0 ) break;
	}
	float d = sqrt( dot(z,z)/dot(dz,dz) )*log(dot(z,z));

	return sqrt( clamp( (150.0/zoom)*d, 0.0, 1.0 ) );
}


void main( )
{
	vec2 st = gl_FragCoord.xy/u_resolution.xy;

	float scol = calc( gl_FragCoord.xy, u_time );

	vec3 vcol = pow( vec3(scol), vec3(0.9,1.1,1.4) );

	vcol *= 0.7 + 0.3*pow(16.0*st.x*st.y*(1.0-st.x)*(1.0-st.y),0.25);

	gl_FragColor = vec4( vcol, 1.0 );
}
