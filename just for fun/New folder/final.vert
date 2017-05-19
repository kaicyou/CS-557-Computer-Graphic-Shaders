#version 330 compatibility

uniform float uLightX, uLightY, uLightZ;
uniform float uA, uB, uC;
uniform float Timer;

out vec3 vNormal;
out vec4 vMC;

vec3 eyeLightPosition = vec3( uLightX, uLightY, uLightZ );


void
main( )
{ 
	// get new coord
	float x = gl_Vertex.x;
	float y = gl_Vertex.y;
	float z = uA * cos(uB * x * Timer) * cos(uC * y * Timer);
	vec4 vertex = gl_Vertex;
	vertex.xyz = vec3(x, y, z);
	vec4 ECposition = gl_ModelViewMatrix * vertex;

	//Get new normal
	float dzdx = -uA * uB * sin(uB * vertex.x * Timer) * cos(uC * vertex.y * Timer); 
	float dzdy = -uA * uC * cos(uB * vertex.x * Timer) * sin(uC * vertex.y * Timer);
	vec3 Tx = vec3(1., 0., dzdx );
	vec3 Ty = vec3(0., 1., dzdy );
	vec3 normal = normalize( cross( Tx, Ty ) ); 
	//vNormal = gl_NormalMatrix * normal;
	vNormal =cross( Tx, Ty );
	vMC.xyz = vertex.xyz;
	if(gl_Vertex.z >= 0)
	{
		vMC.w = 1;
	}
	else
		vMC.w = -1;
	//gl_Position = gl_ModelViewProjectionMatrix * mix(gl_Vertex, vertex, uA);
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
