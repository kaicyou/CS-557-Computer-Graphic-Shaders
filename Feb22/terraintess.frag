#version 400

uniform float		uLightX, uLightY, uLightZ;
uniform float		uExag;
uniform vec4		uColor;
uniform sampler2D	uBumpHgtUnit;
uniform bool		uUseColor;
uniform float		uLevel1;
uniform float		uLevel2;
uniform float		uTol;
uniform float		uDelta;

in vec2			gST;
in vec3			gMCposition;

out vec4			fFragColor;

const float DELTA = 	0.001;

const vec3 BLUE  = 	vec3( 0.1, 0.1, 0.5 );
const vec3 GREEN = 	vec3( 0.0, 0.8, 0.0 );
const vec3 BROWN = 	vec3( 0.6, 0.3, 0.1 );
const vec3 WHITE = 	vec3( 1.0, 1.0, 1.0 );

const float LNGMIN = -579240./2.;
const float LNGMAX =  579240./2.;
const float LATMIN = -419949./2.;
const float LATMAX =  419949./2.;

void main()
{
	float s = gST.s;
	float t = gST.t;
	vec2 stp0 = vec2( DELTA,  0. );
	vec2 st0p = vec2( 0.   ,  DELTA );

	float west  =  texture( uBumpHgtUnit, gST-stp0 ).r;
	float east  =  texture( uBumpHgtUnit, gST+stp0 ).r;
	float south =  texture( uBumpHgtUnit, gST-st0p ).r;
	float north =  texture( uBumpHgtUnit, gST+st0p ).r;

	vec3 stangent = vec3( 2.*DELTA*(LNGMAX-LNGMIN), 0., uExag * ( east - west ) );
	vec3 ttangent = vec3( 0., 2.*DELTA*(LATMAX-LATMIN), uExag * ( north - south ) );
	vec3 normal = normalize(  cross( stangent, ttangent )  );

    	float LightIntensity  = 1.0 * ( dot( normalize(vec3(uLightX,uLightY,uLightZ) - gMCposition), normal ) );
	if( LightIntensity < 0.1 )
		LightIntensity = 0.1;

	if( uUseColor )
	{
		float here = texture( uBumpHgtUnit, gST ).r;
		vec3 color = BLUE;
		if( here > 0. )
		{
			float t = smoothstep( uLevel1-uTol, uLevel1+uTol, here );
			color = mix( GREEN, BROWN, t );
		}
		if( here > uLevel1+uTol )
		{
			float t = smoothstep( uLevel2-uTol, uLevel2+uTol, here );
			color = mix( BROWN, WHITE, t );
		}
		gl_FragColor = vec4( LightIntensity*color, 1. );
	}
	else
	{
		gl_FragColor= vec4( LightIntensity*uColor.rgb, 1. );
	}
}
