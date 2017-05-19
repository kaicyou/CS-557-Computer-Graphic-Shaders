#version 330 compatibility

uniform bool	uPolar;
uniform float	uK;
uniform float	uTransX;
uniform float	uTransY;
uniform float	uXcntr;
uniform float	uYcntr;
uniform float	uScale;

out vec4	vColor;

void
main( )
{
	vColor = gl_Color;

	vec4 vertex = gl_Vertex;
	vertex.xy -= vec2( uXcntr, uYcntr );
	vertex.xy /= uScale;

	vec2 pos = ( gl_ModelViewMatrix * vertex ).xy;
	pos += vec2( uTransX, uTransY );
	float r = length( pos );

	vec4 pos2 = vec4( 0., 0., -5., 1. );
	if( uPolar )
	{
		pos2.xy = pos / ( r + uK );
	}
	else
	{
		pos2.xy = pos * inversesqrt( pos*pos + uK*uK );
	}

	gl_Position = gl_ProjectionMatrix * pos2;
}
