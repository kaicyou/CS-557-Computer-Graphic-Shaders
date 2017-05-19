#version 330 compatibility

out vec2 vST;
out float noise;

uniform sampler3D Noise3;
uniform float uBoomRange;
uniform float uFrequency;

void main()
{
	vST = gl_MultiTexCoord0.st;

	vec4 nv = texture3D(Noise3, uFrequency*gl_Vertex.xyz);
	float n = nv.r + nv.g + nv.b + nv.a;	// 1. -> 3.
	noise = n - 1.;				// 0. -> 2.

	vec3 Position = gl_Vertex.xyz - gl_Normal.xyz*noise*uBoomRange;

	gl_Position = gl_ModelViewProjectionMatrix * vec4(Position,1.0);
}