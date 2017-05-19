#version 400 compatibility

in float gLightIntensity;

void
main( )
{
	gl_FragColor = vec4( gLightIntensity, gLightIntensity, 0., 1. );
}
