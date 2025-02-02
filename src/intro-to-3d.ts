import { CUBE_INDICES, CUBE_VERTICES, TABLE_INDICES, TABLE_VERTICES, create3dPosColorInterleavedVao } from "./geometry";
import { createStaticVertexBuffer, createStaticIndexBuffer, getContext, showError, createProgram } from "./gl-utils";


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
    

}

try{
    introTo3DDemo()
}catch (e){
    showError(`Unhandled JS exception: ${e}`);
}