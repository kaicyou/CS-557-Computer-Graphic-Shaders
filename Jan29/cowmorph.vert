#version 330 compatibility

uniform bool  uUseTimer;
uniform float uBlend;
uniform bool  uCube;
uniform float Timer;

out vec4  vColor;
out float vLightIntensity; 

const vec3 LIGHTPOS = vec3( 5., 10., 10. );
const float PI = 3.14159265;
const float SIDE = 2.;

void
main( )
{
	vec4 vertex0 = gl_Vertex;

	vertex0.xyz *= 4./length(vertex0.xyz);
	if( uCube )
	{
		vertex0.xyz = clamp( vertex0.xyz, -SIDE, SIDE );
	}

    	vec3 tnorm      = normalize( vec3( gl_NormalMatrix * gl_Normal ) );
	vec3 ECposition = vec3( gl_ModelViewMatrix * gl_Vertex );
    	vLightIntensity  = abs( dot( normalize(LIGHTPOS - ECposition), tnorm ) );
	if( vLightIntensity < 0.2 )
		vLightIntensity = 0.2;
		
	vColor = gl_Color;

	float t;
	if( uUseTimer )
		t = .5 + .5 * sin( 2. * PI * Timer );
	else
		t = uBlend;

	gl_Position = gl_ModelViewProjectionMatrix * mix( gl_Vertex, vertex0, t );
}
