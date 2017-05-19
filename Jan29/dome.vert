#version 330 compatibility

out vec4	vColor;
out float  vLightIntensity;

const float PI =  3.14159265;
const vec3 LIGHTPOS = vec3( 2., 0., 10. );

void
main( )
{
	vColor = gl_Color;

	vec4 pos = gl_ModelViewMatrix * gl_Vertex;
	float lenxy = length( pos.xy );

	if( lenxy != 0.0 )
	{
		float phi = atan( lenxy, -pos.z );
		pos.xy = ( phi / (PI/2. ) )  *  ( pos.xy / lenxy );
	}

	vec3 tnorm = normalize( gl_NormalMatrix*gl_Normal );
	vLightIntensity = abs( dot( tnorm, normalize( gl_Position.xyz - LIGHTPOS ) ) );

	gl_Position = gl_ProjectionMatrix * pos;
}
