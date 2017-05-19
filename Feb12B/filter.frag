#version 330 compatibility

in float vLightIntensity; 
in vec2  vST;
in vec3  vMC;

uniform float uAd;
uniform float uBd;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform float uTol;
uniform sampler3D Noise3;

const vec3 BEAVER = vec3( 1., .5, 0. );
const vec3 OTHER  = vec3( 1., .9, .2);

void
main( )
{
	vec4  nv  = texture3D( Noise3, uNoiseFreq*vMC );
	float n = nv.r + nv.g + nv.b + nv.a;	// 1. -> 3.
	n = ( n - 2. );				// -1. -> 1.

	vec2 st = vST;

	float Ar = uAd/2.;
	float Br = uBd/2.;

	float numins = floor( st.s / uAd );
	float numint = floor( st.t / uBd );

	vec3 TheColor = OTHER;

	vec2 center = vec2( numins*uAd + Ar , numint*uBd + Br );
	vec2 delta = st - center;
	float oldrad = length( delta );
	float newrad = oldrad + uNoiseAmp*n;
	delta = delta * newrad / oldrad;
	float ds = delta.s/Ar;
	float dt = delta.t/Br;
	float d = ds*ds + dt*dt;
	float t = smoothstep( 1.-uTol, 1.+uTol, d );
	TheColor = mix( BEAVER, OTHER, t );

	gl_FragColor = vec4( vLightIntensity*TheColor, 1. );
}