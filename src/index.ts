import { Life } from "./Life";

function init() {
  const target = document.getElementById("root");
  target ? run(target) : init();
}

function run(target: any) {
  new Life(target, new URLSearchParams(window.location.search)).init();
}

window.requestAnimationFrame(init);
