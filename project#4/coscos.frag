#version 330 compatibility

in vec3 vNs;
in vec3 vLs;
in vec3 vEs;
in vec3 vMC;

uniform float uKa, uKd, uKs;
uniform float uNoiseAmp;
uniform float uNoiseFreq;

uniform vec4 uColor;
uniform vec4 uSpecularColor;

uniform float uShininess;

uniform sampler3D Noise3;

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
	//Noise
	vec4 nvx = texture3D( Noise3, uNoiseFreq*vMC );
    vec4 nvy = texture3D( Noise3, uNoiseFreq*vec3(vMC.xy,vMC.z+0.5) );
    float angx = nvx.r + nvx.g + nvx.b + nvx.a;
    angx = uNoiseAmp * (angx - 2.);
    float angy = nvy.r + nvy.g + nvy.b + nvy.a;
    angy = uNoiseAmp * (angy - 2.);

	//Lighting
	vec3 Normal;
	vec3 Light;
	vec3 Eye;

	Normal = RotateNormal(angx, angy, vNs);
	Light = normalize(vLs);
	Eye = normalize(vEs);

	vec4 ambient = uKa * uColor;

	float d = max( dot(Normal,Light), 0. );
	vec4 diffuse = uKd * d * uColor;

	float s = 0.;
	if( dot(Normal,Light) > 0. )		// only do specular if the light can see the point
	{
		// use the reflection-vector:
		vec3 ref = normalize( 2. * Normal * dot(Normal,Light) - Light );
		s = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec4 specular = uKs * s * uSpecularColor;

	gl_FragColor = vec4( ambient.rgb + diffuse.rgb + specular.rgb, 1. );

}