import * as THREE from 'three';
import 'three/examples/js/postprocessing/EffectComposer.js';
import 'three/examples/js/postprocessing/ShaderPass.js';
import 'three/examples/js/shaders/CopyShader.js';
import FullDomePass from './src/FullDomePass.js';
import earthURL from './texture/earth.jpg';

document.body.style.margin = 0;
document.body.style.padding = 0;
document.body.style.backgroundColor = 'black';

// creater renderer
const renderer = new THREE.WebGLRenderer();
renderer.domElement.style.display = 'block';
renderer.domElement.style.margin = '0 auto';
document.getElementById('app').appendChild(renderer.domElement);

// create scene
const scene = new THREE.Scene();

// cube camera renders to a cube texture, this texture is transformed to a 180deg fisheye view
const camera = new THREE.CubeCamera(0.1, 1000, 1024);
scene.add(camera);

const domeGeometry = new THREE.SphereBufferGeometry(1, 10, 10, 0, Math.PI * 2, 0, Math.PI / 2);
const domeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
const shield = new THREE.Mesh(domeGeometry, domeMaterial);
shield.rotation.x = Math.PI;
camera.add(shield);

const geometry = new THREE.SphereBufferGeometry(10, 20, 20);
// const material = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xffffff });
const material = new THREE.MeshBasicMaterial({ side: THREE.BackSide });
new THREE.TextureLoader().load(earthURL, texture => {
  material.map = texture;
  material.needsUpdate = true;
});
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = Math.PI / 2;
scene.add(mesh);

// setup composer
const composer = new THREE.EffectComposer(renderer);

const fishEyePass = new FullDomePass(scene, camera);
fishEyePass.renderToScreen = true;
composer.addPass(fishEyePass);

function animate() {
  mesh.rotation.y += 0.005;
  composer.render();
  requestAnimationFrame(animate);
}
animate();

// set size
function updateSize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const size = Math.min(width, height);

  renderer.setSize(size, size);
  composer.setSize(size, size);
}
updateSize();
window.addEventListener('resize', updateSize);
