#version 330 compatibility

in vec4 vColor;
in vec2 vST;
in float vLightIntensity;
in vec3 vMCposition;
in vec3 vWCposition;

uniform float uAd;
uniform float uBd;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform float uAlpha;
uniform float uTol;
uniform sampler3D Noise3;
uniform vec4 uOvalnoiseColor;
uniform float uChromaRed;
uniform float uChromaBlue;
uniform bool uUseChromaDepth;
vec3 TheColor;
vec4 PutColor;

vec3
ChromaDepth( float t )
{
	t = clamp( t, 0., 1. );

	float r = 1.;
	float g = 0.0;
	float b = 1.  -  6. * ( t - (5./6.) );

        if( t <= (5./6.) )
        {
                r = 6. * ( t - (4./6.) );
                g = 0.;
                b = 1.;
        }

        if( t <= (4./6.) )
        {
                r = 0.;
                g = 1.  -  6. * ( t - (3./6.) );
                b = 1.;
        }

        if( t <= (3./6.) )
        {
                r = 0.;
                g = 1.;
                b = 6. * ( t - (2./6.) );
        }

        if( t <= (2./6.) )
        {
                r = 1.  -  6. * ( t - (1./6.) );
                g = 1.;
                b = 0.;
        }

        if( t <= (1./6.) )
        {
                r = 1.;
                g = 6. * t;
        }

	return vec3( r, g, b );
}

void main()
{
	float s = vST.s;
	float t = vST.t;
	float sp = 2. * s;		// good for spheres
	float tp = t;

	//handle ellipses
	int numins = int( sp / uAd );
	int numint = int( tp / uBd );
	float sc = numins * uAd + uAd / 2;
	float tc = numint * uBd + uBd / 2;

	gl_FragColor = vColor;		// default color

	vec3 sptp = vec3(sp, tp, 0.);
	vec3 cntr = vec3(sc, tc, 0.);
	vec3 delta = sptp - cntr;

	//Extra 2
	if( uUseChromaDepth )
	{
		float t = (2./3.) * ( vWCposition.z - uChromaRed ) / ( uChromaBlue - uChromaRed );
		t = clamp( t, 0., 2./3. );
		TheColor = ChromaDepth( t );
		PutColor = vec4(TheColor, 1.);
	}
	else
	{
		PutColor = uOvalnoiseColor;
	}

	//Handle noise
	vec4 nv = texture3D(Noise3, uNoiseFreq * vMCposition);
	float n = nv.r + nv.g + nv.b + nv.a;	// 1. -> 3.
	n = n - 2.;				// -1. -> 1.
	
	float oldrad = length(delta);
	float newrad = oldrad + n * uNoiseAmp;
	delta = delta * newrad / oldrad;

	float deltau = delta.x;
	float deltav = delta.y;

	float d = deltau/(uAd/2)*deltau/(uAd/2) + deltav/(uBd/2)*deltav/(uBd/2);
	float T = smoothstep(1.-uTol, 1.+uTol, d);
	gl_FragColor = mix(PutColor, vColor, T);

	//Extra 1
	if(uTol == 0 && d>1)
	{
		if(uAlpha == 0)
			discard;
		else
			gl_FragColor = vec4(vColor.r, vColor.g, vColor.b, uAlpha);
	}

	gl_FragColor.rgb *= vLightIntensity;
}