#version 330 compatibility

out vec3  vMCposition;
out float vLightIntensity;
out vec3 tnorm; 
out vec3 viewDirection;

const vec3 LIGHTPOS = vec3( 0., 0., 10. );

void
main( )
{
	float PI = 3.1415927;
	tnorm = normalize( gl_NormalMatrix * gl_Normal );
	viewDirection = -normalize( (gl_ModelViewMatrix * gl_Vertex).xyz );
	vec3 ECposition = ( gl_ModelViewMatrix * gl_Vertex ).xyz;
	vLightIntensity  = abs( dot( normalize(LIGHTPOS - ECposition), tnorm ) );

	vMCposition = gl_Vertex.xyz;
	vec4 position = gl_Vertex;
	if(position.x >0)
	{
		position.x *= 4;
		position.y = position.y*cos(PI/2*position.x/10);
		position.z = position.z*cos(PI/2*position.x/10);
	}

	gl_Position = gl_ModelViewProjectionMatrix * position;
}
