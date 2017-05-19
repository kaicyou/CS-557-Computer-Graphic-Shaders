#version 330 compatibility

flat in vec3 vNf;
     in vec3 vNs;
flat in vec3 vLf;
     in vec3 vLs;
flat in vec3 vEf;
     in vec3 vEs;

uniform float uKa, uKd, uKs;

uniform vec4 uColor;
uniform vec4 uSpecularColor;

uniform float uShininess;

uniform bool uFlat;
uniform bool uHalf;


void
main( )
{
	vec3 Normal;
	vec3 Light;
	vec3 Eye;

	if( uFlat )
	{
		Normal = normalize(vNf);
		Light = normalize(vLf);
		Eye = normalize(vEf);
	}
	else
	{
		Normal = normalize(vNs);
		Light = normalize(vLs);
		Eye = normalize(vEs);
	}

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