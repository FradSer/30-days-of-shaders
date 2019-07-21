// Author: Frad Lee
// Title: Fractals - 1

// Version 1

// Thanks Inigo Quilez

#ifdef GL_ES
precision mediump float;
#endif

#define AA 2

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

float calc( vec2 _p, float _time )
{
    // non p dependent
    float ltime = .5 - .5 * (cos( _time * .2));
    float zoom = pow( 0.9, 50.0*ltime );
	vec2 cen = vec2( .0, .0 ) + zoom * 0.5 * cos(20. * ltime);

	vec2 c = vec2( -0.745, 0.15 ) - 0.05 * zoom * ( 1. - ltime * .5 );

    _p = ( 2.* _p - u_resolution.xy ) / u_resolution.y;
    _p *= .002;

	// Rotate
    _p *= rotate2d(_time);

	// Scale
    _p *= scale(vec2(_time));

	vec2 z = cen + ( _p - cen ) * zoom;

    // full derivatives version
	vec2 dz = vec2( 1., .0 );

	for( int i=0; i<512; i++ )
	{
		dz = 2.0*vec2(z.x*dz.x-z.y*dz.y, z.x*dz.y + z.y*dz.x );
        z = vec2( z.x*z.x - z.y*z.y, 2.0*z.x*z.y ) + c;
		if( dot(z,z)>100.0 ) break;
	}
	float d = sqrt( dot(z,z)/dot(dz,dz) )*log(dot(z,z));

	return sqrt( clamp( (100.0/ zoom ) * d, .0, 1. ) );
}


void main( )
{
	vec2 st = gl_FragCoord.xy / u_resolution.xy;

	float scol = calc( gl_FragCoord.xy, u_time );

	vec3 vcol = pow( vec3(scol), vec3(0.9,1.1,1.4) );

	vcol *= 0.7 + 0.3*pow(16.0*st.x*st.y*(1.0-st.x)*(1.0-st.y),0.25);

	gl_FragColor = vec4( vcol, 1.0 );
}
