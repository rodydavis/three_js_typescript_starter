import * as THREE from "three";
import { VRButton } from "./utils/vrbutton";

var isXrEnabled: boolean = true;
const renderer = new THREE.WebGLRenderer({
  antialias: true, // smooth edges
  alpha: true, // transparent background
});
renderer.xr.enabled = isXrEnabled;
renderer.setClearColor(0x25c8ce);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//CAMERA
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
);

//SCENE
const scene = new THREE.Scene();

//LIGHTS
const light1 = new THREE.AmbientLight(0xffffff, 0.5),
  light2 = new THREE.PointLight(0xffffff, 1);

scene.add(light1);
scene.add(light2);

//OBJECT
const geometry = new THREE.BoxGeometry(100, 100, 100);
const material = new THREE.MeshLambertMaterial({ color: 0xf3ffe2 });
const mesh = new THREE.Mesh(geometry, material);

mesh.position.set(0, 0, -1000); //set the view position backwards in space so we can see it
scene.add(mesh);

// Render Scene
function render(_isXrEnabled: boolean = isXrEnabled) {
  isXrEnabled = _isXrEnabled;
  if (isXrEnabled) {
    document.body.appendChild(VRButton.createButton(renderer));
    renderer.xr.enabled = true;
    renderer.setAnimationLoop(animate);
  } else {
    requestAnimationFrame(animate);
  }
}

// Render Loop
function animate() {
  update();
  renderer.render(scene, camera);
  if (!isXrEnabled) requestAnimationFrame(animate);
}

// Called Every Frame
function update() {
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.03;
}

// Called on window resize
function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", resize, false);

export { render, resize };
