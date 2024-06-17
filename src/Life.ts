import { Cell } from "./Cell";

interface Options {
  scale: number;
}

export class Life {
  public width: number;
  public height: number;

  public target: HTMLCanvasElement;
  public context: CanvasRenderingContext2D | null;
  public cells: Map<string, Cell> = new Map();

  public scale: number = 5;

  public constructor(element: HTMLElement, public options?: Options) {
    this.main = this.main.bind(this);

    this.scale = 1 / options.scale;

    this.target = document.createElement("canvas");
    this.target.width = element.offsetWidth;
    this.target.height = element.offsetHeight;

    this.context = this.target.getContext("2d");

    if (this.context) {
      this.context.fillStyle = `rgb(48, 48, 48)`;
      this.context.fillRect(0, 0, this.target.width, this.target.height);
    }

    element.appendChild(this.target);

    this.width = this.target.width / this.scale;
    this.height = this.target.height / this.scale;
  }

  public init(): Life {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = new Cell([x, y], Math.random() > 0.5 ? 1 : 0);

        this.cells.set([x, y].join(), cell);
      }
    }

    this.cells.forEach((cell: Cell) => {
      cell.load(this);
    });

    return this.main();
  }

  public main(): Life {
    Array.from(this.cells.values())
      .map((cell) => cell.update())
      .map((cell) => (this.context ? cell.render(this.context) : cell))
      .map((cell) => cell.step());

    window.requestAnimationFrame(this.main);

    return this;
  }
}
