#version 330 compatibility

uniform float uLightX, uLightY, uLightZ;
uniform float uA, uB, uC;

out vec3 vNs;
out vec3 vLs;
out vec3 vEs;
out vec3 vMC;

vec3 eyeLightPosition = vec3( uLightX, uLightY, uLightZ );


void
main( )
{ 
	// get new coord
	float x = gl_Vertex.x;
	float y = gl_Vertex.y;
	float z = uA * cos(uB * x) * cos(uC * y);
	vec4 vertex = gl_Vertex;
	vertex.xyz = vec3(x, y, z);
	vec4 ECposition = gl_ModelViewMatrix * vertex;

	//Get new normal
	float dzdx = -uA * uB * sin(uB * vertex.x) * cos(uC * vertex.y); 
	float dzdy = -uA * uC * cos(uB * vertex.x) * sin(uC * vertex.y);
	vec3 Tx = vec3(1., 0., dzdx );
	vec3 Ty = vec3(0., 1., dzdy );
	vec3 normal = normalize( cross( Tx, Ty ) );

	//Apply Lighting
	vNs = normalize( gl_NormalMatrix * normal );	// surface normal vector

	vLs = eyeLightPosition - ECposition.xyz;		// vector from the point to the light position

	vEs = vec3( 0., 0., 0. ) - ECposition.xyz;		// vector from the point to the eye position 


	vMC = vertex.xyz;
	//gl_Position = gl_ModelViewProjectionMatrix * mix(gl_Vertex, vertex, uA);
	gl_Position = gl_ModelViewProjectionMatrix * vertex;
}
