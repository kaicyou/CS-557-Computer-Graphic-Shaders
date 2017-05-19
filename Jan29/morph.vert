#version 330 compatibility

uniform float uBlend;
uniform float uOffsetS, uOffsetT;

out vec4  vColor;
out float vLightIntensity;
out vec2  vST;

const float TWOPI    = 2.*3.141592653589;
const vec3  LIGHTPOS = vec3( 5., 10., 10. );

void
main( )
{
	// original model coords (sphere):

	vec4 vertex0 = gl_Vertex;
    	vec3 norm0   = gl_Normal;

	// circle coords:

	vec2 ST = gl_MultiTexCoord0.st;
	float radius = 1.-ST.t;
	float theta = TWOPI*ST.s;
	vec4  circle = vec4( radius*cos(theta), radius*sin(theta), 0., 1. );
	vec3 circlenorm = vec3( 0., 0., 1. );

	vST = ST + vec2( uOffsetS, uOffsetT );

	// blend:

	vec4 theVertex = mix( vertex0, circle, uBlend );
	vec3 theNormal = normalize(  mix( norm0, circlenorm, uBlend )  );

	// do the lighting:

    	vec3 tnorm      = normalize( vec3( gl_NormalMatrix * theNormal ) );
	vec3 ECposition = vec3( gl_ModelViewMatrix * theVertex );
    	vLightIntensity  = abs( dot( normalize(LIGHTPOS - ECposition), tnorm ) );
	if( vLightIntensity < 0.2 )
		vLightIntensity = 0.2;
		
	vColor = gl_Color;
	gl_Position = gl_ModelViewProjectionMatrix * theVertex;
}
