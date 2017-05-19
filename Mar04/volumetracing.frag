#version 330 compatibility

uniform float		uMin;
uniform float		uMax;
uniform sampler3D	TexUnit;
uniform float		uTol;
uniform int		uSteps;
uniform float 		uAmax;
uniform bool		uLighting;

in vec3		vSTP;		// starting location
in vec3		vDir;		// tracing direction

const float SMIN =     0.;
const float SMAX =   120.;

const float DELTA = 0.03;
const vec3 DELTAS = vec3( DELTA, 0., 0. );
const vec3 DELTAT = vec3( 0., DELTA, 0. );
const vec3 DELTAP = vec3( 0., 0., DELTA );

const float AMBIENT = 0.3;
const float DIFFUSE = 1. - AMBIENT;


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
main( void )
{
	vec3 lightvec = normalize(  vec3( 0., 1., 1. )  );

	float astar = 1.;
	// vec3  cstar = vec3( 0., 0., 0. );
	// R = decimal 18 = .0706
	// G = decimal 27 = .1059
	// B = decimal 33 = .1294
	vec3 cstar = vec3( .0706, .1059, .1294 );

	vec3 stp = vSTP;
	for( int i = 0; i < uSteps; i++, stp += vDir )
	{
		float alpha = uAmax;

		// keep looping if we're out of bounds:
		if( any(    lessThan( stp, vec3(0.,0.,0.) ) ) )
		{
			alpha = 0.;
			continue;
		}
	
		if( any( greaterThan( stp, vec3(1.,1.,1.) ) ) )
		{
			alpha = 0.;
			continue;
		}

		float scalar = texture( TexUnit, stp ).r;

		if( scalar < uMin )
		{
			alpha = 0.;
			//continue;
		}

		if( scalar > uMax )
		{
			alpha = 0.;
			//continue;
		}

		// want to do contours every 10 degrees
		// now see how close we are to a 10 degree place:
	
		float scalar10 = float( 10*int( (scalar+5.)/10. ) );
		if( abs( scalar - scalar10 ) > uTol )
		{
			alpha = 0.;
			continue;
		}

		float t = ( scalar - SMIN ) / ( SMAX - SMIN );
		vec3 rgb = Rainbow( t );

		// do lighting:

		float inten = 1.;
		if( uLighting )
		{
			float nx = texture3D( TexUnit, stp+DELTAS ).r - texture3D( TexUnit, stp-DELTAS ).r;
			float ny = texture3D( TexUnit, stp+DELTAT ).r - texture3D( TexUnit, stp-DELTAT ).r;
			float nz = texture3D( TexUnit, stp+DELTAP ).r - texture3D( TexUnit, stp-DELTAP ).r;
			vec3 norm = normalize(  vec3( nx, ny, nz )  );
			inten = AMBIENT  +  DIFFUSE * abs(  dot( norm, lightvec )  );
		}
		
		cstar += astar * alpha * ( inten * rgb );
		astar *= ( 1. - alpha );

		// break out if the rest of the tracing won't matter:

		if( astar == 0. )
			break;
	}


	gl_FragColor = vec4( cstar, 1. );
}
