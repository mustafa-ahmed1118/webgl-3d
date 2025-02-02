import { CUBE_INDICES, CUBE_VERTICES, TABLE_INDICES, TABLE_VERTICES, create3dPosColorInterleavedVao } from "./geometry";
import { createStaticVertexBuffer, createStaticIndexBuffer, getContext, showError, createProgram } from "./gl-utils";
import { glMatrix, mat4, vec3 } from "gl-matrix";


//////////////////////
//SHADER SOURCE CODE//
/////////////////////
const vertexShaderSourceCode = `#version 300 es
precision mediump float;

in vec3 vertexPosition;
in vec3 vertexColor;

out vec3 fragmentColor;

uniform mat4 matWorld;
uniform mat4 matViewProj;

void main() {
  fragmentColor = vertexColor;

  gl_Position = matViewProj * matWorld * vec4(vertexPosition, 1.0);
}`;

const fragmentShaderSourceCode = `#version 300 es
precision mediump float;

in vec3 fragmentColor;
out vec4 outputColor;

void main() {
  outputColor = vec4(fragmentColor, 1.0);
}`;


   function introTo3DDemo(){
    const canvas = document.getElementById('demo-canvas');
    if(!canvas || !(canvas instanceof HTMLCanvasElement)){
        showError('Could not get canvas reference');
        return;
    }

    const gl = getContext(canvas);

    const cubeVertices = createStaticVertexBuffer(gl, CUBE_VERTICES);
    const cubeIndices = createStaticIndexBuffer(gl, CUBE_INDICES)
    const tableVertices = createStaticVertexBuffer(gl, TABLE_VERTICES);
    const tableIndices = createStaticIndexBuffer(gl, TABLE_INDICES)
    if(!cubeVertices || !cubeIndices || !tableVertices || !tableIndices){
        showError(`Faled to allocate buffer: cubeVertices= ${cubeVertices} 
                                            cubeIndices=  ${cubeIndices}
                                            tableVertices=  ${tableVertices}
                                            tableIndices=${tableIndices})`);
        
        return;
    }

    const demoProgram = createProgram(gl, vertexShaderSourceCode, fragmentShaderSourceCode);
    if(!demoProgram){
        showError('Failed to compile webgl program')
        return;
    }
    const posAttrib = gl.getAttribLocation(demoProgram, 'vertexPosition');
    const colorAttrib = gl.getAttribLocation(demoProgram, 'vertexColor');

    const matWorldUniform = gl.getUniformLocation(demoProgram, 'matWorld');
    const matViewProjUniform = gl.getUniformLocation(demoProgram, 'matViewProj');

    if(posAttrib < 0 || colorAttrib < 0 || !matWorldUniform || !matViewProjUniform){
        showError(`Failed to get attribs/uniforms`+
            `pos=${posAttrib}, color=${colorAttrib}`+
            `matWorld=${!!matWorldUniform}, matViewProj=${matViewProjUniform}`);
        return;
    }

    //create the VAOs
    const cubeVao = create3dPosColorInterleavedVao(
        gl, cubeVertices, cubeIndices, posAttrib, colorAttrib);
    const tableVao = create3dPosColorInterleavedVao(
        gl, tableVertices, tableIndices, posAttrib, colorAttrib);
    if(!cubeVao || !tableVao){
        showError(`Failed to create VAO: cubeVao=${cubeVao}, tableVAO=${tableVao}`);
        return;
    }
    
    //TEST RENDER
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;

    gl.clearColor(0.2, 0.2, 0.2, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
    gl.viewport(0,0,canvas.width, canvas.height);

    gl.useProgram(demoProgram);

    const matWorld = mat4.create();
    const matView = mat4.create();
    const matProj = mat4.create();

    mat4.lookAt(
        matView,
        /*pos = */ vec3.fromValues(5,5,5),
        /*lookAt = */ vec3.fromValues(0,0,0),
        /*up = */ vec3.fromValues(0,1,0));
    
    mat4.perspective( 
        matProj,
        /*fov= */ glMatrix.toRadian(80),
        /*aspectRation= */ canvas.width/canvas.height,
        /*near, far= */ 0.1, 100.0);


    const matViewProj = mat4.create();
    mat4.multiply(matViewProj, matProj, matView); //actually multiply the view and proj matrices 

    gl.uniformMatrix4fv(matWorldUniform, false, matWorld);
    gl.uniformMatrix4fv(matViewProjUniform, false, matViewProj);

    gl.bindVertexArray(cubeVao);
    gl.drawElements(gl.TRIANGLES, CUBE_INDICES.length, gl.UNSIGNED_SHORT,0);


}

try{
    introTo3DDemo()
}catch (e){
    showError(`Unhandled JS exception: ${e}`);
}