#version 440 compatibility
#extension GL_ARB_compute_shader : enable
#extension GL_ARB_shader_storage_buffer_object : enable
#extension GL_ARB_compute_variable_group_size : enable

#define POSITION	vec3
#define VELOCITY	vec3
#define VECTOR		vec3
#define COLOR		vec3
#define SPHERE		vec4

layout( std140, binding=4 ) buffer Pos
{
    vec4 Positions[ ];
};

layout( std140, binding=5 ) buffer Vel
{
    vec4 Velocities[ ];
};

layout( std140, binding=6 ) buffer Col
{
    vec4 Colors[ ];
};

layout( local_size_x = 128,  local_size_y = 1, local_size_z = 1 )   in;
//layout( local_size_variable )   in;


VELOCITY
Bounce( VELOCITY vin, VECTOR n )
{
	VELOCITY vout = reflect( vin, n );
	return vout;
}

VELOCITY
BounceSphere( POSITION p, VELOCITY v, SPHERE s )
{
	VECTOR n = normalize( p - s.xyz );
	return Bounce( v, n );
}

bool
IsInsideSphere( POSITION p, SPHERE s )
{
	float r = length( p - s.xyz );
	return  ( r < s.w );
}


void
main( )
{
	const vec3    G     = vec3( 0., -9.8, 0. );
	const float  Dt     = 0.1;
	const SPHERE Sphere = vec4( -100., -800., 0.,  600. );

	uint  gid = gl_GlobalInvocationID.x;	// the .y and .z are both 1 in this case

	POSITION p  = Positions[  gid  ].xyz;
	VELOCITY v  = Velocities[ gid  ].xyz;

	POSITION pp = p + v*Dt + .5*Dt*Dt*G;
	VELOCITY vp = v + G*Dt;

	if( IsInsideSphere( pp, Sphere ) )
	{
		vp = BounceSphere( p, v, Sphere );
		pp = p + vp*Dt + .5*Dt*Dt*G;
	}

	Positions[  gid  ].xyz = pp;
	Velocities[ gid  ].xyz = vp;
}
