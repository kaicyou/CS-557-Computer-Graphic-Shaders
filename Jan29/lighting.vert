#version 330 compatibility

uniform float uLightX, uLightY, uLightZ;

flat out vec3 vNf;
     out vec3 vNs;
flat out vec3 vLf;
     out vec3 vLs;
flat out vec3 vEf;
     out vec3 vEs;

vec3 eyeLightPosition = vec3( uLightX, uLightY, uLightZ );


void
main( )
{ 

	vec4 ECposition = gl_ModelViewMatrix * gl_Vertex;

	vNf = normalize( gl_NormalMatrix * gl_Normal );	// surface normal vector
	vNs = vNf;

	vLf = eyeLightPosition - ECposition.xyz;		// vector from the point
									// to the light position
	vLs = vLf;

	vEf = vec3( 0., 0., 0. ) - ECposition.xyz;		// vector from the point
									// to the eye position 
	vEs = vEf;

	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
