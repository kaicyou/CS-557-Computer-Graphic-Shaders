#version 330 compatibility

uniform bool uUseNormalInterpolation;
uniform float uEta;

out vec3  vRefractVector;
out vec3  vReflectVector;
out vec3  vEyeDir;
out vec3  vNormal;
out vec3  vMC;

void
main( )
{
	vec3 ECposition = vec3( gl_ModelViewMatrix * gl_Vertex );

	vec3 eyeDir = normalize( ECposition ) - vec3(0.,0.,0.);			// vector from eye to pt
    	vec3 normal = normalize( gl_NormalMatrix * gl_Normal );

	if( uUseNormalInterpolation )
	{
		vEyeDir = eyeDir;
		vNormal = normal;
	}
	else
	{
		vReflectVector = reflect( eyeDir, normal );
		vRefractVector = refract( eyeDir, normal, uEta );
	}

	vMC = gl_Vertex.xyz;
		
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
