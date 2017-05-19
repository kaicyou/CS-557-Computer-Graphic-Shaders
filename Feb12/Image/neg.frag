#version 330 compatibility

uniform sampler2D uImageUnit;
uniform float uT;

in vec2 vST;

void
main( )
{
	vec3 irgb = texture2D( uImageUnit,  vST ).rgb;
	vec3 neg  = vec3(1.,1.,1.) - irgb;
	gl_FragColor = vec4( mix( irgb, neg, uT ), 1. );
}
