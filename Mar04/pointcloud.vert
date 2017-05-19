#version 330 compatibility

out vec3	vSTP;

void
main( )
{
	vSTP = gl_MultiTexCoord0.stp;
	gl_Position  = gl_ModelViewProjectionMatrix * gl_Vertex;
}
