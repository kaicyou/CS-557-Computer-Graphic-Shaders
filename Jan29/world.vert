#version 330 compatibility
out vec4  vColor;
out float vLightIntensity; 
out vec2  vST;

const vec3 LIGHTPOS = vec3( 5., 10., 10. );

void
main( )
{
	vST = gl_MultiTexCoord0.st;

    	vec3 tnorm = normalize( gl_NormalMatrix * gl_Normal );
	vec3 ECposition = vec3( gl_ModelViewMatrix * gl_Vertex );
    	vLightIntensity  = abs( dot( normalize(LIGHTPOS - ECposition), tnorm ) );
	if( vLightIntensity < 0.2 )
		vLightIntensity = 0.2;
		
	vColor = gl_Color;
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
