import { Cell } from "./Cell";

export class Life {
  public width: number = 640;
  public height: number = 480;

  public target: HTMLCanvasElement;
  public context: CanvasRenderingContext2D | null;
  public cells: Map<string, Cell> = new Map();

  public constructor(el: HTMLElement) {
    this.main = this.main.bind(this);

    this.target = document.createElement("canvas");
    this.target.width = el.offsetWidth;
    this.target.height = el.offsetHeight;

    this.context = this.target.getContext("2d");

    el.appendChild(this.target);
  }

  public init() {
    this.cells.forEach((cell: Cell) => {
      cell.load(this);
    });

    this.main();
  }

  public main() {
    this.cells.forEach((cell: Cell) => {
      cell.update();
    });

    this.cells.forEach((cell: Cell) => {
      this.context && cell.render(this.context);
    });

    this.cells.forEach((cell: Cell) => {
      cell.step();
    });

    window.requestAnimationFrame(this.main);
  }
}
