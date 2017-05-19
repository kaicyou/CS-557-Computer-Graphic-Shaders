#version 400

in float gLightIntensity;

const vec3 COLOR = vec3( 1., 1., 0. );

void
main( )
{
	gl_FragColor = vec4( gLightIntensity * COLOR, 1. );
}
