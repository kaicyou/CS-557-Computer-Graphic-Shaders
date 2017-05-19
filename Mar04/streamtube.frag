#version 400 compatibility
in float	vLightIntensity;
in vec3	vColor;

void
main( void )
{
	gl_FragColor = vec4( vLightIntensity * vColor.rgb, 1. );
}
