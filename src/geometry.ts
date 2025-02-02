import { showError } from "./gl-utils";
//Vertex buffer format: XYZ RGB (interleaved)


/*
    General Methodology used to create shapes:
        - Define square faces and rgb color values
        - Read them as triangles for the vertex buffer
*/

//
// Cube Geometry
// copied from: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Creating_3D_objects_using_WebGL
export const CUBE_VERTICES = new Float32Array([
  
    // Front face
    -1.0, -1.0, 1.0,    1, 0, 0, // 0
    1.0, -1.0, 1.0,     1, 0, 0, // 1
    1.0, 1.0, 1.0,      1, 0, 0, // 2
    -1.0, 1.0, 1.0,     1, 0, 0, // 3
    
    // Back face
    -1.0, -1.0, -1.0,   1, 0, 0, // 4
    -1.0, 1.0, -1.0,    1, 0, 0, // 5
    1.0, 1.0, -1.0,     1, 0, 0, // 6
    1.0, -1.0, -1.0,    1, 0, 0, // 7
    
    // Top face
    -1.0, 1.0, -1.0,    0, 1, 0, // 8
    -1.0, 1.0, 1.0,     0, 1, 0, // 9
    1.0, 1.0, 1.0,      0, 1, 0, // 10
    1.0, 1.0, -1.0,     0, 1, 0, // 11
    
    // Bottom face
    -1.0, -1.0, -1.0,   0, 1, 0, // 12
    1.0, -1.0, -1.0,    0, 1, 0, // 13
    1.0, -1.0, 1.0,     0, 1, 0, // 14
    -1.0, -1.0, 1.0,    0, 1, 0, // 15
    
    // Right face
    1.0, -1.0, -1.0,    0, 0, 1, // 16
    1.0, 1.0, -1.0,     0, 0, 1, // 17
    1.0, 1.0, 1.0,      0, 0, 1, // 18
    1.0, -1.0, 1.0,     0, 0, 1, // 19
    
    // Left face
    -1.0, -1.0, -1.0,   0, 0, 1, // 20
    -1.0, -1.0, 1.0,    0, 0, 1, // 21
    -1.0, 1.0, 1.0,     0, 0, 1, // 22
    -1.0, 1.0, -1.0,    0, 0, 1  // 23
]);

const CUBE_INDICES = new Uint16Array([
    0, 1, 2, 
    0, 2, 3, // front
    4, 5, 6, 
    4, 6, 7, // back
    8, 9, 10, 
    8, 10, 11, // top
    12, 13, 14, 
    12, 14, 15, // bottom
    16, 17, 18, 
    16, 18, 19, // right
    20, 21, 22, 
    20, 22, 23, // left
]);

/*NOTE: The table top is simply the top of the cube with the following transformations:
    - X and Z scaled up by 10 to create thickness
    - Y transalted down by 1 to be flat on the surface 
    - Color changed to RGB(0.2, 0.2, 0.2) for a grey color
*/
const TABLE_VERTICES = new Float32Array([
    // Top face
    -10.0, 0.0, -10.0,    0.2, 0.2, 0.2, 
    -10.0, 0.0, 10.0,     0.2, 0.2, 0.2, 
    10.0, 0.0, 10.0,      0.2, 0.2, 0.2, 
    10.0, 0.0, -10.0,     0.2, 0.2, 0.2, 
]);

const TABLE_INDICES = new Float32Array([
    0, 1, 2, 
    0, 2, 3 // top
]);

export function create3dPosColorInterleavedVao(
    gl: WebGL2RenderingContext,
    vertexBuffer: WebGLBuffer, indexBuffer: WebGLBuffer,
    postAttrib: number, colorAttrib: number
){
    const vao = gl.createVertexArray();
    if(!vao){
        showError('Failed to create VAO!');
        return null;
    }
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(postAttrib);
    gl.enableVertexAttribArray(colorAttrib);

    //Bind the vertex buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(
        postAttrib, 3, gl.FLOAT, false, 
        6 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(
        colorAttrib, 3, gl.FLOAT, false, 
        6 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    //Bind the index buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bindVertexArray(null);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null) //safety measure

    return vao;
}