#version 330 compatibility

uniform float uA;
uniform sampler2D uTexUnit;

in vec2 vST;

void
main( )
{
	float s = vST.s;
	float t = vST.t;
	vec2 stp = vec2( 1.-s, t );

	vec3 c  = texture2D( uTexUnit, vST ).rgb;
	vec3 cp = texture2D( uTexUnit, stp ).rgb;

	vec3 rgb;

	if( s <= uA )
	{
		float u = .5 + .5 * s / uA;
		rgb = u * c  +  (1.-u) * cp;
	}
	else if( s >= 1.-uA )
	{
		float u = .5 * ( s - 1. + uA ) / uA;
		rgb = u * cp  +  (1.-u) * c;
	}
	else
		rgb = c;

	gl_FragColor = vec4( rgb, 1. );
}
