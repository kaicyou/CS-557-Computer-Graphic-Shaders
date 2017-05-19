#version 330 compatibility

in vec3  vReflectVector;
in vec3  vRefractVector;
in vec3  vEyeDir;
in vec3  vNormal;

uniform bool  uUseNormalInterpolation;
uniform float uMix;
uniform float uEta;
uniform samplerCube uReflectUnit;
uniform samplerCube uRefractUnit;

const vec3 WHITE = vec3( 1.,1.,1. );

void
main( )
{
	vec3 reflectvector;
	vec3 refractvector;
	vec3 reflectcolor;
	vec3 refractcolor;

	if( uUseNormalInterpolation )
	{
		reflectvector = reflect( vEyeDir, normalize(vNormal) );
		reflectcolor = textureCube( uReflectUnit, reflectvector ).rgb;
		refractvector = refract( vEyeDir, normalize(vNormal), uEta );
		refractcolor = textureCube( uRefractUnit, refractvector ).rgb;
	}
	else
	{
		reflectcolor = textureCube( uReflectUnit, vReflectVector ).rgb;
		refractcolor = textureCube( uRefractUnit, vRefractVector ).rgb;
	}

	refractcolor = mix( refractcolor, WHITE, 0.30 );
	gl_FragColor = vec4( mix( refractcolor, reflectcolor, uMix ), 1. );
}
