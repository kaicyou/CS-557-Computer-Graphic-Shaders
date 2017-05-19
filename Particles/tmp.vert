=====================================================
Vertex Shader:
=====================================================

#version 330

uniform mat4 uModelViewProjectionMatrix;

layout( location=0 ) in vec4 aVertex;

void
main( )
{
	gl_Position = uModelViewProjectionMatrix * aVertex;
}




=====================================================
C Code:
=====================================================

        glBindBuffer( GL_ARRAY_BUFFER, posSSbo  );
        glVertexAttribPointer( 0, 4, GL_FLOAT, GL_FALSE, 0, (void *)0 );
        glEnableVertexAttribArray( 0 ):

