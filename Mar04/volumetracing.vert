#version 330 compatibility

uniform int	uSteps;
uniform bool	uPerspective;

out vec3		vSTP;		// starting location
out vec3		vDir;		// tracing direction

const float SQRT3 = 1.732;

void
main( void )
{
	vSTP.stp = ( gl_Vertex.xyz + 1. ) / 2.;	// xyz [-1.,1.] to stp [0.,1.]
				// In the fragment shader, vSTP will tell us
				// where to sample the volume data.

	// leave the vSTP alone, rotate the position forwards, rotate the Dir backwards

	vec4 xyzw;

	if( uPerspective )		// perspective
	{
		xyzw = gl_ModelViewMatrix*gl_Vertex;	// where the vertex went when it got moved into the scene
		xyzw.stp = ( xyzw.xyz + vec3(1.,1.,1.) ) / 2.;		// change from xyz [-1.,1.] to stp [0.,1.]
		vec3 eye = ( vec3(0.,0.,0.) + vec3( 1., 1., 1. ) ) / 2.;	// same for eye position
		xyzw.stp = xyzw.stp - eye;			// stp vector from eye to vertex
		xyzw.w = 0.;
	}
	else				// orthographic
	{
		xyzw = vec4( 0., 0., -1., 0. );		// stp vector to the vertex
	}

	vDir = SQRT3 * normalize( ( gl_ModelViewMatrixInverse * xyzw ).stp ) / float(uSteps);
				// vDir has had translations removed and uniform scale normailzed out.
				// In the fragment shader, vDir will tell us how to get to the
				// next volume data value to sample.

	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
