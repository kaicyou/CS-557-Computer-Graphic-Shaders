#version 330 compatibility

in vec4  vColor;
in float vLightIntensity; 

void
main( )
{
	gl_FragColor = vec4( vLightIntensity*vColor.rgb, vColor.a );
}
