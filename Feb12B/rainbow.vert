#version 330 compatibility

out vec3 vECposition;

void
main( )
{
	vECposition = vec3( gl_ModelViewMatrix * gl_Vertex );
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
