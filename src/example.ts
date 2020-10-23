import * as THREE from "three";
import { VRScene } from "./utils/vr-render";
import * as TWEEN from "@tweenjs/tween.js";

export class Example extends VRScene {
  mesh?: THREE.Mesh;

  constructor() {
    super(document.getElementById("container"));
    this.renderer.setClearColor(0x25c8ce); // Background Color
    //LIGHTS
    const light1 = new THREE.AmbientLight(0xffffff, 0.5),
      light2 = new THREE.PointLight(0xffffff, 1);

    this.scene.add(light1);
    this.scene.add(light2);

    //OBJECT
    const geometry = new THREE.BoxGeometry(100, 100, 100);
    const material = new THREE.MeshLambertMaterial({ color: 0xf3ffe2 });
    this.mesh = new THREE.Mesh(geometry, material);

    this.mesh.position.set(0, 0, -1000);
    this.mesh.scale.set(1, 1, 1);
    this.scene.add(this.mesh);
  }

  selected: THREE.Object3D;
  tween: TWEEN.Tween<Vec3>;
  scale: Vec3 = { x: 1, y: 1, z: 1 };

  animate() {
    super.animate();
    TWEEN.update();
    const intersects = this.selection();
    if (intersects.length > 0) {
      const first = intersects[0];
      const object = first.object;
      this.selected = object;
      if (object instanceof THREE.Mesh) {
        const objectMesh = object as THREE.Mesh<
          THREE.BoxGeometry,
          THREE.MeshLambertMaterial
        >;
        objectMesh.material.color.set(0xff0000);
        if (this.tween == undefined) {
          this.scaleTo({ x: 1.2, y: 1.2, z: 1.2 });
        }
      }
    } else {
      const objectMesh = this.mesh as THREE.Mesh<
        THREE.BoxGeometry,
        THREE.MeshLambertMaterial
      >;
      objectMesh.material.color.set(0xf3ffe2);
      if (this.tween == undefined) {
        this.scaleTo({ x: 1, y: 1, z: 1 });
      }
    }
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.03;
  }

  scaleTo(value: Vec3) {
    this.tween = new TWEEN.Tween<Vec3>(this.scale)
      .to(value, 150)
      .onUpdate(() => {
        this.mesh.scale.set(this.scale.x, this.scale.y, this.scale.z);
        super.animate();
      })
      .onComplete(() => {
        this.tween = undefined;
      })
      .start();
  }
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}
