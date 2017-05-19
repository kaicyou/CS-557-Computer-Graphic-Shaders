#version 400 compatibility

uniform float uScale;

out vec3 vNormal;

void
main( )
{
	vec3 xyz = gl_Vertex.xyz;
	xyz *= uScale;
	vNormal = normalize( gl_NormalMatrix * gl_Normal );
	gl_Position = gl_ModelViewMatrix * vec4( xyz, 1. );
}
