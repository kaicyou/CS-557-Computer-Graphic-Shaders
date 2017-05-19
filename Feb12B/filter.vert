#version 330 compatibility

out float vLightIntensity;
out vec2  vST;
out vec3  vMC;

void
main( )
{
	vST = gl_MultiTexCoord0.st;
	vMC = gl_Vertex.xyz;

	vec3 tnorm      = normalize( gl_NormalMatrix * gl_Normal );
	vec3 LightPos   = vec3( 2., 10., 10. );
	vec3 ECposition = vec3( gl_ModelViewMatrix * gl_Vertex );
	vLightIntensity  = dot( normalize(LightPos - ECposition), tnorm );
	vLightIntensity = abs( vLightIntensity );

	gl_Position = gl_ModelViewProjectionMatrix * gl_TextureMatrix[0] * gl_Vertex;
}
