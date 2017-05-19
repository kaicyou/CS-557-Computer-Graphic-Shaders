#version 400 compatibility

in  vec2  vST;

uniform bool	uDoublePrecision;
uniform int	uMaxIterations;
uniform float	uXcenter;
uniform float	uYcenter;
uniform float	uCreal;
uniform float	uCimag;
uniform vec4 	uInnerColor;
uniform vec4 	uOuterColor1;
uniform vec4 	uOuterColor2;

out vec4  fFragColor;

void
main( )
{
	int	   iter;
	float   r2 = 0.0;

	if( uDoublePrecision )
	{
		dvec2    st = dvec2(vST) + dvec2( uXcenter, uYcenter );
		double   real  = st.s;
		double   imag  = st.t;

		for( iter = 0; iter < uMaxIterations && r2 < 4.0; iter++ )
		{
			double newreal = real*real - imag*imag  +  uCreal;
			double newimag = double(2.)*real*imag   +  uCimag;
			r2 = float( newreal*newreal + newimag*newimag );
			real = newreal;
			imag = newimag;
		}
	}
	else
	{
		vec2    st = vST + vec2( uXcenter, uYcenter );
		float   real  = st.s;
		float   imag  = st.t;

		for( iter = 0; iter < uMaxIterations && r2 < 4.0; iter++ )
		{
			float newreal = real*real - imag*imag  +  uCreal;
			float newimag = 2.*real*imag   +  uCimag;
			r2 = newreal*newreal + newimag*newimag;
			real = newreal;
			imag = newimag;
		}
	}

	// base the color on the number of iterations

	vec4 color;

	if( r2 < 4. )
		color = uInnerColor;
	else
		color = mix( uOuterColor1, uOuterColor2, fract( 0.2 * float(iter) ) );

	gl_FragColor = color;
}
