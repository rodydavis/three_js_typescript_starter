import * as THREE from "three";
import { VRButton } from "./utils/vrbutton";

const renderer = new THREE.WebGLRenderer({
  antialias: true, // smooth edges
  alpha: true, // transparent background
});
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

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", resize, false);

//RENDER LOOP
function render(isXr: boolean) {
  if (!isXr) {
    requestAnimationFrame(animate);
  } else {
    document.body.appendChild(VRButton.createButton(renderer));
    renderer.xr.enabled = true;
    renderer.setAnimationLoop(animate);
  }
}

function animate() {
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.03;
  renderer.render(scene, camera);
}

export { render, resize };
