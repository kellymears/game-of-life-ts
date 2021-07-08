import { Life } from "./Life";
import { Cell } from "./Cell";

function init() {
  const target = document.getElementById("root");
  target ? run(target) : init();
}

function run(target: any) {
  const life = new Life(target);

  for (let y = 0; y < target.clientHeight; y++) {
    for (let x = 0; x < target.clientWidth; x++) {
      const cell = new Cell([x, y], 5, Math.random() > 0.5 ? 1 : 0);

      life.cells.set([x, y].join(), cell);
    }
  }

  life.init();
}

window.requestAnimationFrame(init);
