#version 330 compatibility

in vec2	vST;

uniform int       uLength;
uniform bool	  uPhoto;
uniform sampler2D pTexUnit;
uniform sampler2D wnTexUnit;

void
main( )
{
	float TwoOverRes = 2. / 512.;
	float OneOverNum = 1./float(uLength+uLength+1);
	vec3 color;
	
	// starting location:

	vec2 st = vST;
	vec2 tmp = st - vec2(.5,.5);
	vec2 v = vec2( -tmp.y, tmp.x );
	v *= TwoOverRes;

	if( uPhoto )
		color = vec3( texture( pTexUnit, st ) );
	else
		color = vec3( texture( wnTexUnit, st ) );

	st = vST;
	int LengthP = uLength;
	for( int i = 0; i < LengthP; i++ )
	{
		st += v;
		st = clamp( st, 0., 1. );
		if( uPhoto )
			color += vec3( texture( pTexUnit, st ) );
		else
			color += vec3( texture( wnTexUnit, st ) );

	}


	st = vST;
	LengthP = uLength;
	for( int i = 0; i < LengthP; i++ )
	{
		st -= v;
		st = clamp( st, 0., 1. );
		if( uPhoto )
			color += vec3( texture( pTexUnit, st ) );
		else
			color += vec3( texture( wnTexUnit, st ) );
	}

	
	color *= OneOverNum;

	gl_FragColor = vec4( color, 1. );
}
