#version 330 compatibility

in vec3 vRefractVector;

uniform samplerCube RefractUnit;

const vec4 WHITE = vec4( 1.,1.,1.,1. );

void
main( )
{

	vec4 refractcolor = textureCube( RefractUnit, vRefractVector );
	gl_FragColor = mix( refractcolor, WHITE, .3 );
}
