#version 400 compatibility

out vec2	 vST;
out vec3    vMCposition;

void
main( ) 
{
	vST = (  gl_Vertex.xy - vec2( -1.2569, -1. )  )  /  vec2( 2.*1.2569, 2.*1. );
	vMCposition = ( gl_ModelViewMatrix * gl_Vertex ).xyz;
	gl_Position = gl_Vertex;
}