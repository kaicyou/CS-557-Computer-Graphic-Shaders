#version 330 compatibility

in vec3 vNormal;
in vec4 vMC;

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
	vec4 nvx = texture3D( Noise3, uNoiseFreq*vMC.xyz );
    vec4 nvy = texture3D( Noise3, uNoiseFreq*vec3(vMC.xy,vMC.z+0.5) );
    float angx = nvx.r + nvx.g + nvx.b + nvx.a;
    angx = uNoiseAmp * (angx - 2.);
    float angy = nvy.r + nvy.g + nvy.b + nvy.a;
    angy = uNoiseAmp * (angy - 2.);

    vec3 Normal = RotateNormal(angx, angy, vNormal);
    float alpha = Normal.x+Normal.y+Normal.z;
    if (alpha < 0)
    	alpha = 0;
    if (vMC.w >= 0)
		gl_FragColor = vec4(uColor.rgb * alpha, alpha);
	if (vMC.w <= 0)
		gl_FragColor = vec4(vec3(0.2, 0.2, 0.2)*alpha,alpha*0.75);
}