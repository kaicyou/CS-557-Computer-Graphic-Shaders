#version 330 compatibility

in vec3  vReflectVector;
in vec3  vRefractVector;
in vec3  vEyeDir;
in vec3  vNormal;
in vec3  vMC;

uniform bool  uUseNormalInterpolation;
uniform float uMix;
uniform float uEta;
uniform samplerCube uReflectUnit;
uniform samplerCube uRefractUnit;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform sampler3D Noise3;
uniform vec4 uColor;
uniform float uP;

const vec3 WHITE = vec3( 1.,1.,1. );

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

void
main( )
{
	vec3 reflectvector;
	vec3 refractvector;
	vec3 reflectcolor;
	vec3 refractcolor;
	vec3 norm;

	//Noise
	vec4 nvx = texture3D( Noise3, uNoiseFreq*vMC );
    vec4 nvy = texture3D( Noise3, uNoiseFreq*vec3(vMC.xy,vMC.z+0.5) );
    float angx = nvx.r + nvx.g + nvx.b + nvx.a;
    angx = uNoiseAmp * (angx - 2.);
    float angy = nvy.r + nvy.g + nvy.b + nvy.a;
    angy = uNoiseAmp * (angy - 2.);

	if( uUseNormalInterpolation )
	{
		norm = RotateNormal(angx, angy, vNormal);
		reflectvector = reflect( vEyeDir, normalize(norm) );
		reflectcolor = textureCube( uReflectUnit, reflectvector ).rgb;
		refractvector = refract( vEyeDir, normalize(norm), uEta );
		refractcolor = textureCube( uRefractUnit, refractvector ).rgb;
	}
	else
	{
		reflectcolor = textureCube( uReflectUnit, vReflectVector ).rgb;
		refractcolor = textureCube( uRefractUnit, vRefractVector ).rgb;
	}

	refractcolor = mix( refractcolor, WHITE, 0.30 );
	gl_FragColor = vec4( mix( refractcolor, reflectcolor, uMix ), 1. );
	gl_FragColor = mix(gl_FragColor,uColor,uP);
}
