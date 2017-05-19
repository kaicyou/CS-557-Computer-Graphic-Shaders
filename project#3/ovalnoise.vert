#version 330 compatibility

out vec4 vColor;
out vec2 vST;
out float vLightIntensity;
out vec3 vMCposition;
out vec3 vWCposition;

const vec3 LIGHTPOS   = vec3( -2., 0., 10. );

void main()
{
	vec3 tnorm      = normalize( gl_NormalMatrix * gl_Normal );	// transformed normal
	vec3 ECposition = ( gl_ModelViewMatrix * gl_Vertex ).xyz;
	vLightIntensity  = abs(  dot( normalize(LIGHTPOS - ECposition), tnorm )  );
	vMCposition = gl_Vertex.xyz;
	vec4 pos = gl_ModelViewMatrix * gl_Vertex;
	vWCposition = pos.xyz;
	vColor = gl_Color;
	vST = gl_MultiTexCoord0.st;
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}