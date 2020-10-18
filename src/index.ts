import { render } from "./render";
import { WEBGL } from "./utils/webgl";
const container = document.getElementById("container");
if (WEBGL.isWebGLAvailable()) {
  render(true);
} else {
  const warning = WEBGL.getWebGLErrorMessage();
  container.appendChild(warning);
}
