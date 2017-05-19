uniform float uAmbient;
uniform float uBumpDensity;
uniform float uBumpSize;
uniform vec4  uSurfaceColor;
uniform float uHeight;

in vec2 vST;
in vec3 vLightDir;

void
main( )
{
	vec3 normal;

	vST.s *= 2.;				// makes the bumps round on the equator of the sphere

	vec2 c = uBumpDensity * vST;		// make lots more bumps
	vec2 uv = fract(c) - vec2(.5,.5);	// (u,v,w) are local coordinates for the bump normal
	uv *= 2.;				// change [-.5,-.5] to [-1.,1.]

	// in surface coords, the normal starts out to be (0,0,1) -- change it from there:

	float u = 0. + uv.s;	// normal perturbation in s
	float v = 0. + uv.t;	// normal perturbation in t
	float w = 1.;		// don't perturb in w


	// see if we are actually in a bump -- BumpSize is the radius:

	float dist2d = u*u + v*v;
	if( dist2d < uBumpSize*uBumpSize )
	{
		normal = normalize( vec3( uHeight*u, uHeight*v, w ) );
	}
	else
	{
		normal = vec3( 0., 0., 1. );
	}

	float intensity = uAmbient + (1.-uAmbient)*abs( dot(normal, vLightDir) );
	vec3 litColor = uSurfaceColor.rgb * intensity;
	
	gl_FragColor = vec4( litColor, 1. );
}
