#version 330 compatibility
out float vLightIntensity;
out vec3  vMCposition;
out vec3  vECposition;

uniform vec3  uLightPos;
uniform float uScale;

void
main( )
{
    vECposition = vec3( gl_ModelViewMatrix * gl_Vertex );
    vMCposition = uScale * vec3( gl_Vertex );
    vec3 tnorm  = normalize( vec3( gl_NormalMatrix * gl_Normal ) );
    vLightIntensity  = abs( dot( normalize(uLightPos - vECposition), tnorm ) );

    gl_Position     = gl_ModelViewProjectionMatrix * gl_Vertex;
}
