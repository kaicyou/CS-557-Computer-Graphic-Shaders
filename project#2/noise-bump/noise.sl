surface
noise(
	float	Ad  = 0.1,
		Bd = 0.175,
		Ks = 0.4,				// specular coefficient
		Kd = 0.5, 				// diffuse  coefficient
		Ka = 0.1, 				// ambient  coefficient
		Roughness = 0.1;			// specular roughness
	color	SpecularColor = color( 1, 1, 1 )	// specular color
)
{
	color LAND = color( 0.095, 0.97, 0.05 );

	// be sure the normal points correctly (used for lighting):

	varying vector Nf = faceforward( normalize( N ), I );
	vector V = normalize( -I );
	
	// determine how many dots over and up we are in right now:
	point PP = point "shader" P;
	float magnitude = 0.;
	float size = 1.;
	float i;
	for( i = 0.; i < 6.0; i += 1.0 )
	{
		magnitude += ( noise( size * PP ) - 0.5 ) / size;
		size *= 2.0;
	}

	float up = 2. * u;	// because we are rendering a sphere
	float vp = v;
	float numinu = floor( up / Ad );
	float numinv = floor( vp / Bd );
	float uc = numinu * Ad + Ad / 2;
	float vc = numinv * Bd + Bd / 2;
	Oi = Os;
	
	//handle the dots:
	point upvp =  point( up, vp, 0. );      // the point
	point cntr =  point( uc, vc, 0. );      // the center
	vector delta = upvp - cntr;      // vector from center to u',v'

	float oldrad = length(delta);		// result from the ellipse equation
	float newrad = oldrad + 0.3 * magnitude;
	delta = delta * newrad / oldrad;

	float deltau = xcomp(delta);
	float deltav = ycomp(delta);
	float d = deltau/(Ad/2)*deltau/(Ad/2) + deltav/(Bd/2)*deltav/(Bd/2);
	color TheColor = Cs;
	if( d <= 1. )
		TheColor = LAND;

	// determine the lighted output color Ci:

	Ci =        TheColor * Ka * ambient();
	Ci = Ci  +  TheColor * Kd * diffuse(Nf);
	Ci = Ci  +  SpecularColor * Ks * specular( Nf, V, Roughness );
	Ci = Ci * Oi;
}