#version 330 compatibility

uniform samplerCube uReflectUnit;
uniform bool uUseNormalInterpolation;

in vec3  vReflectVector;
in vec3  vEyeDir;
in vec3  vNormal;


void
main( )
{
	vec3 reflectvector;
	vec3 reflectcolor;
	if( uUseNormalInterpolation )
	{
		reflectvector = reflect( vEyeDir, normalize(vNormal) );
		reflectcolor= textureCube( uReflectUnit, reflectvector ).rgb;
	}
	else
	{
		reflectcolor= textureCube( uReflectUnit, vReflectVector ).rgb;
	}

	gl_FragColor = vec4( reflectcolor, 1. );
}
