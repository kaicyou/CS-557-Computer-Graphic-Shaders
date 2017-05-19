#version 330 compatibility

out vec3 vRefractVector;

uniform float uR1, uR2;

const float ETA_RATIO = 0.66;

void
main( )
{

	vec3 P   = vec3( gl_ModelViewMatrix * gl_Vertex );
	vec3 Eye = vec3( 0., 0., 0. );

	vec3 FromEyeToPt = normalize( P - Eye  );			// vector from eye to pt

	vec3 Center1 = vec3( 0., 0., P.z - uR1 );
	vec3 Normal1;

	if( uR1 >= 0. )
		Normal1 = normalize( P - Center1 );
	else
		Normal1 = normalize( Center1 - P );

	vec3 v1 = refract( FromEyeToPt, Normal1, ETA_RATIO );   // eta ratio = in/out
	v1 = normalize( v1 );

	vec3 Center2 = vec3( 0., 0., P.z + uR2 );
	vec3 Normal2;

	if( uR2 >= 0. )
		Normal2 = normalize( Center2 - P );
	else
		Normal2 = normalize( P - Center2 );

	vec3 v2 = refract( v1, Normal2, 1./ETA_RATIO );

	vRefractVector = v2;

	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
