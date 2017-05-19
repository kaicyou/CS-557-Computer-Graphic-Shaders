varying vec4	Color;
varying float	LightIntensity;
uniform float	Inten;

void
main( )
{
	// gl_FragColor = vec4( Inten*LightIntensity*Color.rgb, Color.a );
	gl_FragColor = vec4( 0., 1., 1., 1. );
}
