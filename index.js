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

// add half a sphere to the back of the camera to add the round corners
const shieldGeometry = new THREE.SphereBufferGeometry(1000, 10, 10, 0, Math.PI * 2, 0, Math.PI / 2);
const shieldMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
shieldMaterial.depthWrite = false;
shieldMaterial.depthTest = false;
const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
shield.rotation.z = Math.PI;
shield.renderOrder = 10000;
camera.add(shield);

const geometry = new THREE.SphereBufferGeometry(10, 20, 20);
// const material = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xffffff });
const material = new THREE.MeshBasicMaterial({ side: THREE.BackSide });
new THREE.TextureLoader().load(earthURL, texture => {
  material.map = texture;
  material.needsUpdate = true;
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// // test cube
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const colors = [0xff0000, 0x00ff00, 0x0000ff, 0x00ffff, 0xff00ff, 0xffff00];
// for (let i = 0; i < geometry.faces.length; i += 2) {
//   const color = colors[i / 2];
//   geometry.faces[i].color.setHex(color);
//   geometry.faces[i + 1].color.setHex(color);
// }
// const material = new THREE.MeshBasicMaterial({ color: 0xffffff, vertexColors: THREE.FaceColors, side: THREE.BackSide });
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// setup composer
const composer = new THREE.EffectComposer(renderer);

const fullDomePass = new FullDomePass(scene, camera);
fullDomePass.renderToScreen = true;
composer.addPass(fullDomePass);

function animate() {
  camera.rotation.y += 0.005;
  camera.rotation.x += 0.01;
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
