uniform float uS0, uT0;
uniform float uPower;
uniform sampler2D uTexUnit;

in vec2 vST;

void
main( )
{
	vec2 delta = vST - vec2(uS0,uT0);

	vec2 st = vec2(uS0,uT0) + sign(delta) * pow( abs(delta), uPower );

	vec3 rgb = texture2D( uTexUnit, st ).rgb;

	gl_FragColor = vec4( rgb, 1. );
}
