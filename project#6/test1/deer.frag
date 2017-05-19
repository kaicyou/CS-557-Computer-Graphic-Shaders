#version 330 compatibility

in vec2 vST;
in float noise;

uniform vec4 uColor;

void main()
{
	vec3 Color = uColor.rgb * noise;
	gl_FragColor = vec4(Color,1.);
}