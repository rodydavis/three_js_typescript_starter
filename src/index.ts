import { render } from "./render";
import { WEBGL } from "./webgl";
const container = document.getElementById("container");
if (WEBGL.isWebGLAvailable()) {
  render();
} else {
  const warning = WEBGL.getWebGLErrorMessage();
  container.appendChild(warning);
}
