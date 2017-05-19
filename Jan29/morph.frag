#version 330 compatibility

uniform bool  uUseTex;
uniform float uDensity;
uniform float uFrequency;
uniform vec4  uBackColor;
uniform float uTol;
uniform sampler2D   uWorldTexUnit;

in vec4  vColor;
in float vLightIntensity;
in vec2  vST;

float
Pulse( float density, float tol, float vals, float valt )
{
	return	smoothstep( .5 - density/2. - tol, .5 - density/2. + tol, vals ) -
			smoothstep( .5 + density/2. - tol, .5 + density/2. + tol, vals ) +
			smoothstep( .5 - density/2. - tol, .5 - density/2. + tol, valt ) -
			smoothstep( .5 + density/2. - tol, .5 + density/2. + tol, valt );
}

void
main( )
{
	float s = vST.s;
	float t = 1. - vST.t;

	float sf = s * uFrequency;
	float tf = t * uFrequency;
	
	vec4 newColor;
	if( uUseTex )
	{
		newColor = texture2D( uWorldTexUnit, vST );
	}
	else
	{
		float tt = Pulse( uDensity, uTol, fract(sf), fract(tf) );
		newColor = mix( vColor, uBackColor, tt );
		newColor = clamp( newColor, 0., 1. );
	}


	gl_FragColor = vec4( vLightIntensity*newColor.rgb, vColor.a );
}
