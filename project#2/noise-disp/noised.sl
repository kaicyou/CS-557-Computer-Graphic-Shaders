displacement
noised(
	float	
		Ad = 0.1,              // u diameter
        Bd = 0.175,              // v diameter
        NoiseAmp = 0.00,        // noise amplitude
        DispAmp = 0.10;          // displacement amplitude
)
{
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
	float uc = numinu * Ad + Ad / 2.;
	float vc = numinv * Bd + Bd / 2.;
	
	//handle the dots:
	point upvp =  point( up, vp, 0. );      // the point
	point cntr =  point( uc, vc, 0. );      // the center
	vector delta = upvp - cntr;      // vector from center to u',v'

	float oldrad = length(delta);		// result from the ellipse equation
	float newrad = oldrad + 0.3 * magnitude;
	delta = delta * newrad / oldrad;

	float deltau = xcomp(delta);
	float deltav = ycomp(delta);
	float d = deltau/(Ad/2.)*deltau/(Ad/2.) + deltav/(Bd/2.)*deltav/(Bd/2.);
	float t = smoothstep(0., 1.0, 1.-d);
	float disp = (1. - d)*DispAmp*t;
	if( disp != 0. )
	{
			normal n = normalize(N);
        	P = P + disp * n;
        	N = calculatenormal(P);
	}
}