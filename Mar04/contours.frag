#version 330 compatibility

uniform float		uMin;
uniform float		uMax;
uniform sampler3D	TexUnit;
uniform float		uTol;
uniform bool		uDiscard;
in vec3			vMCposition;

const float SMIN =   0.;
const float SMAX = 120.;


vec3
Rainbow( float t )
{
	t = clamp( t, 0., 1. );

	vec3 rgb;

	// b -> c
	rgb.r = 0.;
	rgb.g = 4. * ( t - (0./4.) );
	rgb.b = 1.;

	// c -> g
	if( t >= (1./4.) )
	{
		rgb.r = 0.;
		rgb.g = 1.;
		rgb.b = 1. - 4. * ( t - (1./4.) );
	}

	// g -> y
	if( t >= (2./4.) )
	{
		rgb.r = 4. * ( t - (2./4.) );
		rgb.g = 1.;
		rgb.b = 0.;
	}

	// y -> r
	if( t >= (3./4.) )
	{
		rgb.r = 1.;
		rgb.g = 1. - 4. * ( t - (3./4.) );
		rgb.b = 0.;
	}

	return rgb;
}


vec3
HeatedObject( float t )
{
	t = clamp( t, 0., 1. );

	vec3 rgb;
	rgb.r = 3. * ( t - (0./6.) );
	rgb.g = 0.;
	rgb.b = 0.;

	if( t >= (1./3.) )
	{
		rgb.r = 1.;
		rgb.g = 3. * ( t - (1./3.) );
	}

	if( t >= (2./3.) )
	{
		rgb.g = 1.;
		rgb.b = 3. * ( t - (2./3.) );
	}

	return rgb;
}



void
main( )
{
	float alpha = 1.;
	vec4 rgba;
	vec3 stp = ( vMCposition + 1 ) / 2.;		// maps [-1.,1.] to [0.,1.]
	if( stp.s < 0.  ||  stp.s > 1. )
		discard;

	if( stp.t < 0.  ||  stp.t > 1. )
		discard;

	if( stp.p < 0.  ||  stp.p > 1. )
		discard;

	float scalar = texture( TexUnit, stp ).r;

	if( uDiscard )
	{
		if( scalar < uMin )
			discard;

		if( scalar > uMax )
			discard;

		// want to do contours every 10 degrees
		// now see how close we are to a 10 degree place:

		float scalar10 = float( 10*int( (scalar+5.)/10. ) );
		if( abs( scalar - scalar10 ) > uTol )
			discard;
	}
	else
	{
		if( scalar < uMin )
			alpha = 0.;

		if( scalar > uMax )
			alpha = 0.;

		// want to do contours every 10 degrees
		// now see how close we are to a 10 degree place:

		float scalar10 = float( 10*int( (scalar+5.)/10. ) );
		if( abs( scalar - scalar10 ) > uTol )
			alpha = 0.;
	}

	float t = ( scalar - SMIN ) / ( SMAX - SMIN );
	vec3 rgb = Rainbow( t );

	gl_FragColor = vec4( rgb, alpha );
}
