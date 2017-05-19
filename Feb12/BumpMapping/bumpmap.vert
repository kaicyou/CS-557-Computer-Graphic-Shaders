#version 330 compatibility

uniform float uLightX, uLightY, uLightZ;	// from a slider

in vec3 Tangent;				// passed in by glman Sphere primitive

out vec2 vST;
out vec3 vLightDir;				// light direction in TNB coords

// N is the direction of normal
// T is the direction of "Tangent", which is (dx/dt, dy/dt, dz/dt)
// B is the TxN, which is the direction of (dx/ds, dy/ds, dz/ds)

void
main( ) 
{
	vST = gl_MultiTexCoord0.st;

	// the vectors B-T-N form an X-Y-Z-looking right handed coordinate system:

	vec3 T = normalize(gl_NormalMatrix * Tangent);
	vec3 N = normalize(gl_NormalMatrix * gl_Normal);
	vec3 B = normalize( cross(T, N) );

	// where the light is coming from:

	vec3 lightPosition = vec3( uLightX, uLightY, uLightZ );	// world space vector

	// transform the lightPosition into surface coordinates:
	// (note: this is really a matrix multiply, a row at a time)

	vec3 v;
	v.x = dot( B, lightPosition );
	v.y = dot( T, lightPosition );
	v.z = dot( N, lightPosition );
	vLightDir = normalize(v);		// surface space vector
						// z pointing in same dir as normal

	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
