import { showError } from "./gl-utils";

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

showError('Hello, 3D WebGL Tutorial!!!!')