#version 330 compatibility
in float vLightIntensity; 
in vec3  vMCposition;
in vec3  vECposition;

uniform vec4  uSkyColor;
uniform vec4  uCloudColor;
uniform float uBias;
uniform sampler3D Noise3;

void
main( )
{
	vec4  noisevec  = texture3D( Noise3, vMCposition );

	float intensity = noisevec.r + noisevec.g + noisevec.b + noisevec.a;
	intensity -= 2;		// -1 to 1

	vec3 color   = mix( uSkyColor.rgb, uCloudColor.rgb, clamp( uBias+intensity, 0., 1. ) ) * vLightIntensity;

	if( vECposition.y >= 0. )
		gl_FragColor = vec4(color, 1.0);
	else
		gl_FragColor = vec4( 0., 0., 0., 1. );

}
