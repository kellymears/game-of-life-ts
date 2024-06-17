import { Life } from "./Life.js";

import "./style.css";

function init() {
  if (!window.requestAnimationFrame) {
    console.log("window not ready.");
    return setTimeout(init, 10);
  }

  const target = document.getElementById("root");
  if (!target) {
    console.log("dom not ready");
    return setTimeout(init, 10);
  }

  const params = new URLSearchParams(window.location.search);

  const scale = (params.has("scale") ? parseInt(params.get("scale")) : 2) * 0.1;

  const options = { scale };

  target ? new Life(target, options).init() : init();
}

init();
