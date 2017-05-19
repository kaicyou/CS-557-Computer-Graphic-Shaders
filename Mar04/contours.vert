#version 330 compatibility

uniform float	uZ;

out vec3		vMCposition;

void
main( )
{
	vMCposition = vec3( gl_Vertex.xy, uZ );
	gl_Position = gl_ModelViewProjectionMatrix * vec4( vMCposition, 1. );
}
