import * as THREE from "three";
import { VRButton } from "./vrbutton";
import { WEBGL } from "./webgl";

export class VRScene {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  private _vrButton: HTMLElement;
  node: HTMLElement;
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  private _onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  public get width(): number {
    return window.innerWidth;
  }
  public get height(): number {
    return window.innerHeight;
  }

  constructor(node: HTMLElement) {
    this.node = node;
    if (WEBGL.isWebGLAvailable()) {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      this._vrButton = VRButton.createButton(this.renderer);
      this.renderer.xr.enabled = this.isXrEnabled;
      this.renderer.setClearColor(0X00000000);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.width, this.height);
      node.appendChild(this.renderer.domElement);
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(35, this.aspect, 0.1, 3000);
      window.addEventListener("resize", (_) => this.resize());
      window.addEventListener(
        "mousemove",
        (event) => this._onMouseMove(event),
        false
      );
      this.render();
    } else {
      const warning = WEBGL.getWebGLErrorMessage();
      this.node.appendChild(warning);
    }
  }

  private _isXrEnabled: boolean = "xr" in navigator;
  public get isXrEnabled(): boolean {
    return this._isXrEnabled;
  }
  public set isXrEnabled(value: boolean) {
    this._isXrEnabled = value;
    this.renderer.xr.enabled = value;
    if ("xr" in navigator)
      if (value) {
        document.body.appendChild(this._vrButton);
      } else {
        document.body.removeChild(this._vrButton);
      }
  }

  public get aspect(): number {
    return this.width / this.height;
  }

  private resize(): void {
    this.camera.aspect = this.aspect;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
    this.animate();
  }

  animate() {
    this.renderer.render(this.scene, this.camera);
    if (!this.isXrEnabled) {
      requestAnimationFrame(this.animate);
    }
  }

  selection() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);
    return intersects;
  }

  render() {
    if (this.isXrEnabled) {
      this.renderer.setAnimationLoop(() => {
        this.animate();
      });
    } else {
      requestAnimationFrame(() => {
        this.animate();
      });
    }
  }
}
