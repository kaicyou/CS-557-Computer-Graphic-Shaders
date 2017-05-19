surface
dot(
	float	Ad  = 0.025,
		Bd = 0.10,
		Ks = 0.4,				// specular coefficient
		Kd = 0.5, 				// diffuse  coefficient
		Ka = 0.1, 				// ambient  coefficient
		Roughness = 0.1;			// specular roughness
	color	SpecularColor = color( 1, 1, 1 )	// specular color
)
{
	color ORANGE = color( 1., .5, 0. );

	// be sure the normal points correctly (used for lighting):

	varying vector Nf = faceforward( normalize( N ), I );
	vector V = normalize( -I );
	
	// determine how many dots over and up we are in right now:

	float up = 2. * u;	// because we are rendering a sphere
	float vp = v;
	float numinu = floor( up / Ad );
	float numinv = floor( vp / Bd );
	float uc = numinu * Ad + Ad / 2;
	float vc = numinv * Bd + Bd / 2;
	float test = (up-uc)/(Ad/2)*(up-uc)/(Ad/2) + (vp-vc)/(Bd/2)*(vp-vc)/(Bd/2);

	Oi = Os;
	
	//handle the dots:
	color TheColor = Cs;
	   if( test <= 1 )
		if( mod( numinu+numinv, 2. ) == 0 )
		   TheColor = ORANGE;
	   else
		   Oi = color( 1., 1., 1. );


	// determine the lighted output color Ci:

	Ci =        TheColor * Ka * ambient();
	Ci = Ci  +  TheColor * Kd * diffuse(Nf);
	Ci = Ci  +  SpecularColor * Ks * specular( Nf, V, Roughness );
	Ci = Ci * Oi;
}