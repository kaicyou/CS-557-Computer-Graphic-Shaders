#version 330 compatibility
in vec3  vMCposition;
in float vLightIntensity; 
in vec3 tnorm; 
in vec3 viewDirection;

uniform float uNoiseMag;
uniform float uNoiseFreq;
uniform float uA;
uniform float uTol;
uniform sampler3D Noise3;
uniform float uP;
uniform float uCover;

const vec4 CYAN = vec4( 0., 1., 1., 1. );
const vec4 GRAY	= vec4( 0.2, 0.2, 0.2, 1. );

const float odd = 0.1;
const float even = 0.4;

// return 0. if < left-tol or > right+tol
// return 1. if >= left+tol and <= right-tol
// else blend

float
Pulse( float value, float left, float right, float tol )
{
	float t = (  smoothstep( left-tol, left+tol, value )  -  smoothstep( right-tol, right+tol, value )  );
	return t;
}

void
main( void )
{
	vec4  nv  = texture3D( Noise3, uNoiseFreq * vMCposition ); 
	float n = nv.r + nv.g + nv.b + nv.a;	// 1. -> 3.
	n = n - 2.;				// -1. -> 1.
	float delta = uNoiseMag * n;

	float V = vMCposition.x;
	float f = fract(  uA*(V+delta) );

	float t = Pulse(f,  0.5-uP,  0.5+uP, uTol);
	vec4 crackColor = vec4(0., Pulse(f,  0.5-uP/1.5,  0.5+uP/1.5, uTol), 1., 1.);
	gl_FragColor = mix( GRAY, crackColor, t );
	gl_FragColor.rgb *= vLightIntensity;
	if (dot(normalize(viewDirection), normalize(tnorm))<uCover)
	{
		gl_FragColor = crackColor;
	}
}
