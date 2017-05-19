#version 330 compatibility

uniform float uMix;
uniform float uEta;
uniform samplerCube uReflectUnit;
uniform samplerCube uRefractUnit;
uniform float uTemp;
uniform float uWaterHeight;
uniform sampler3D Noise3;

const vec3 WATERCOLOR = vec3( .6, .85, 1. );
const vec3 ICECOLOR = vec3( 0.75, 0.85, 1.);
const vec3 WHITE = vec3( 0.75, 0.85, 1.);

in vec3  vEyeDir;
in vec3  vNormal;
in vec4  vPos;

vec3
RotateNormal( float angx, float angy, vec3 n )
{
        float cx = cos( angx );
        float sx = sin( angx );
        float cy = cos( angy );
        float sy = sin( angy );

        // rotate about x:
        float yp =  n.y*cx - n.z*sx;    // y'
        n.z      =  n.y*sx + n.z*cx;    // z'
        n.y      =  yp;
        // n.x     

        // rotate about y:
        float xp =  n.x*cy + n.z*sy;    // x'
        n.z      = -n.x*sy + n.z*cy;    // z'
        n.x      =  xp;
        // n.y      =  n.y;

        return normalize( n );
}

void main() {
    vec3 reflectvector;
	vec3 refractvector;
	vec3 reflectcolor;
	vec3 refractcolor;
	vec3 Normal;
	vec3 FragColor;
	float Alpha = 1;

	if( (uTemp <=0) || (uTemp >=1) )
	{
		vec4 nvx = texture3D( Noise3, 0.28*vPos.xyz );
    	vec4 nvy = texture3D( Noise3, 0.28*vec3(vPos.xy,vPos.z+0.5) );
    	float angx = nvx.r + nvx.g + nvx.b + nvx.a;
    	angx = 2.62 * (angx - 2.);
    	float angy = nvy.r + nvy.g + nvy.b + nvy.a;
    	angy = 2.62 * (angy - 2.);
    	Normal = RotateNormal(angx, angy, vNormal);
	}
	else
		Normal = vNormal;

	reflectvector = reflect( vEyeDir, normalize(Normal) );
	reflectcolor = textureCube( uReflectUnit, reflectvector ).rgb;
	refractvector = refract( vEyeDir, normalize(Normal), uEta );
	refractcolor = textureCube( uRefractUnit, refractvector ).rgb;



	if( (uTemp>0)&&(uTemp<1) )
	{
		refractcolor = mix( refractcolor, WATERCOLOR, 0.30 );
		FragColor = mix( refractcolor, reflectcolor, uMix );
		if(uTemp >=0.5)
		{
			Alpha = 1 - (uTemp - 0.5);
		}
	}
	else if( uTemp <= 0 )
	{
		refractcolor = mix( refractcolor, ICECOLOR, 0.30 );
		FragColor = mix( refractcolor, reflectcolor, uMix+0.3 );
	}
	else
	{
		float scale = (Normal.x+Normal.y+Normal.z) * uTemp / 2.;
		if(Normal.x+Normal.y+Normal.z<=0)
		{
			scale = 0;
		}
		FragColor = WHITE*scale;
		Alpha = scale;
	}
	
	
	if( (uTemp <= 0) )
	{
		float tester = (vPos.y-uWaterHeight-0.113)/0.226 - uTemp;
		float T = smoothstep(-0.6, 0.6, tester);
		FragColor = mix( FragColor, WHITE, (Normal.x+Normal.y+Normal.z)*T );
	}

	gl_FragColor = vec4( FragColor, Alpha );
}
