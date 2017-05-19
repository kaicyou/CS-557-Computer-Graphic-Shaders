uniform float uS, uT;
uniform float uTol;

varying vec2  vST;
varying vec4  vColor;
varying float vLightIntensity; 

void main( )
{
	vec4 newColor = vColor;
	if( uS-uTol <= vST.s  &&  vST.s <= uS+uTol  &&   uT-uTol <= vST.t  &&  vST.t <= uT+uTol )
		newColor = vec4( 1., 0., 0., 1. );
	newColor.rgb *= vLightIntensity;
	gl_FragColor = newColor;
}
