#version 400 compatibility
#extension GL_EXT_gpu_shader4: enable
#extension GL_EXT_geometry_shader4: enable
layout( triangles ) in;
layout( triangle_strip, max_vertices=1024 ) out;

uniform float uShrink;

in vec2 teST[ ];
in vec3 teMCposition[ ];

out vec2 gST;
out vec3 gMCposition;

vec3 V[3];
vec3 CG;

void
ProduceVertex( int v )
{
	gl_Position = gl_ProjectionMatrix * vec4( CG + uShrink * ( V[v] - CG ), 1. );
	gST = teST[v];
	gMCposition = teMCposition[v];
	EmitVertex();
}



void
main( )
{
	V[0]  =   gl_PositionIn[0].xyz;
	V[1]  =   gl_PositionIn[1].xyz;
	V[2]  =   gl_PositionIn[2].xyz;

	CG = ( V[0] + V[1] + V[2] ) / 3.;

	ProduceVertex( 0 );
	ProduceVertex( 1 );
	ProduceVertex( 2 );
}
