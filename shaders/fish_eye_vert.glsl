attribute vec3 position;
attribute vec2 uv;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
varying vec2 vUv;

void main() {
	// vUv = vec2(uv.x, uv.y);
	// gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
  vUv = vec2(uv.x, uv.y) - .5;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}
