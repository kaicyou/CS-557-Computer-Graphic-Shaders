varying vec4  vColor;
varying float vLightIntensity;
varying vec2  vST;
uniform float uBlend;
uniform float uOffsetS, uOffsetT;
uniform float uFrequency;
uniform sampler2D uTexUnit;

void
main( )
{
	float s = vST.s;
	float t = vST.t;

	float sf = fract( s * uFrequency + uOffsetS );
	float tf = fract( t * uFrequency + uOffsetT );

	vec3 newcolor = texture( uTexUnit, vec2(sf,tf) ).rgb;
	newcolor = mix( newcolor, vColor.rgb, uBlend );
	gl_FragColor = vec4( vLightIntensity*newcolor, 1. );
}
