import * as THREE from 'three';
import fishEyeVert from '../shaders/fish_eye_vert.glsl';
import fishEyeFrag from '../shaders/fish_eye_frag.glsl';

export default class FishEyePass {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;

    this.clear = true;
    this.renderToScreen = false;

    this._camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this._scene = new THREE.Scene();
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        map: { type: 't', value: null }
      },
      vertexShader: fishEyeVert,
      fragmentShader: fishEyeFrag,
      side: THREE.DoubleSide
    });
    this._quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), material);
    this._quad.frustumCulled = false;
    this._scene.add(this._quad);
  }

  setSize(width, height) {
  }

  render(renderer) {
    this.camera.update(renderer, this.scene);

    this._quad.material.uniforms.map.value = this.camera.renderTarget.texture;
    renderer.render(this._scene, this._camera, this.renderToScreen ? null : readBuffer, this.clear);
  }
}
