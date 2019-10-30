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

const mouseTarget = new THREE.Mesh(new THREE.SphereBufferGeometry(1, 20, 20), new THREE.MeshBasicMaterial({ color: 0xffffff }));
mouseTarget.position.set(0, 10, 0);
scene.add(mouseTarget);

const geometry = new THREE.SphereBufferGeometry(10, 20, 20);
const material = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xffffff });
// const material = new THREE.MeshBasicMaterial({ side: THREE.BackSide });
// new THREE.TextureLoader().load(earthURL, texture => {
//   material.map = texture;
//   material.needsUpdate = true;
//   composer.render();
// });
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, 2, 4);
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

function unprojectFishEye(mouse) {
  const r = Math.min(window.innerWidth / 2, window.innerHeight / 2);

  const center = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);

  const d = mouse.distanceTo(center);

  const alpha = d / r * Math.PI / 2;

  const x1 = Math.sin(alpha);
  const y1 = Math.cos(alpha);

  const x = (mouse.x - center.x) / d * x1;
  const y = y1;
  const z = -(mouse.y - center.y) / d * x1;

  return new THREE.Vector3(x, y, z);
}

window.addEventListener('mousemove', event => {
  const mouse = new THREE.Vector2(event.x, event.y);

  const ray = new THREE.Ray(camera.position, unprojectFishEye(mouse));

  // mathmatical representation of a sphere
  const mathSphere = new THREE.Sphere(mesh.position, mesh.geometry.parameters.radius);

  const pos = new THREE.Vector3();
  ray.intersectSphere(mathSphere, pos);

  mouseTarget.position.copy(pos);
  composer.render();
});

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

composer.render();
