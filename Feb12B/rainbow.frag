#version 330 compatibility

in vec3 vECposition;

uniform float uSunY;
uniform float uTol;
uniform float uMaxAlpha;

float
Pulse( float min, float max, float tol, float t )
{
	float a = min - tol;
	float b = min + tol;

	float c = max - tol;
	float d = max + tol;

	return  smoothstep(a,b,t) - smoothstep(c,d,t);
}


void
main( )
{
	vec3 SunDirection = vec3( 0., uSunY, 10. );
	vec3 PtToSun = normalize( SunDirection );
	vec3 PtToEye = normalize( vec3(0.,0.,0.) - vECposition );
	float costheta = dot( PtToEye, PtToSun );

	float R = Pulse( .7400, .7490, uTol, costheta );
	float G = Pulse( .7490, .7605, uTol, costheta );
	float B = Pulse( .7605, .7700, uTol, costheta );
	float A = clamp( R+G+B, 0., uMaxAlpha );

	// clip rainbow at the ground (otherwise it will be a circle):

	if( vECposition.y >= 0. )
		gl_FragColor = vec4( R, G, B, A );
	else
		gl_FragColor = vec4( 0., 0., 0., 1. );
}
