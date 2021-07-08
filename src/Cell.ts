import { Life } from "./Life";

declare type Coordinate = [number, number];

const STATE = {
  ALIVE: 1,
  DEAD: 0,
};

const shift = {
  left: (x: number) => x - 1,
  right: (x: number) => x + 1,
  up: (y: number) => y - 1,
  down: (y: number) => y + 1,
};

export class Cell {
  public alive: number | null = null;
  public next: number | null = null;

  public x: number = 0;
  public y: number = 0;

  public scale: number = 10;

  public group: number = 0;
  public color: {
    r: number;
    g: number;
    b: number;
  } = {
    r: 255,
    g: 255,
    b: 255,
  };

  public neighbors: Cell[] = [];

  public constructor([x, y]: Coordinate, scale?: number, group?: number) {
    this.x = x;
    this.y = y;

    if (scale) this.scale = scale;
    if (group) this.group = group;

    this.alive = Math.random() > 0.5 ? STATE.ALIVE : STATE.DEAD;
  }

  public load(life: Life) {
    if (!life.context) return;

    const colors = [
      255 * ((this.x * this.scale) / life.context.canvas.width),
      255 * ((this.y * this.scale) / life.context.canvas.height),
    ];

    this.color = {
      r: this.group == 1 ? colors[0] : colors[1],
      g: this.group == 1 ? colors[1] : colors[0],
      b: 255,
    };

    const neighbors: [number, number][] = [
      [this.x, shift.up(this.y)],
      [this.x, shift.down(this.y)],
      [shift.right(this.x), this.y],
      [shift.left(this.x), this.y],
      [shift.right(this.x), shift.up(this.y)],
      [shift.left(this.x), shift.up(this.y)],
      [shift.right(this.x), shift.down(this.y)],
      [shift.left(this.x), shift.down(this.y)],
    ];

    neighbors.map((coord) => {
      const neighbor = life.cells.get(coord.join());
      neighbor && this.neighbors.push(neighbor);
    });

    this.alive ? this.draw(life.context) : this.clear(life.context);
  }

  public update() {
    /**
     * Alive neighbor count
     */
    const count = this.neighbors.reduce(
      (acc: number, neighbor: Cell) =>
        acc + (neighbor.alive ? STATE.ALIVE : STATE.DEAD),
      0
    );

    switch (count) {
      /**
       * 2 neighbors; no change
       */
      case 2:
        break;

      /**
       * 3 neighbors; alive
       */
      case 3:
        this.next = STATE.ALIVE;
        break;

      /**
       * All others; die.
       */
      default:
        this.next = STATE.DEAD;
    }
  }

  public render(ctx: CanvasRenderingContext2D) {
    if (this.alive == this.next) return;
    this.next ? this.draw(ctx) : this.clear(ctx);
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 1)`;

    ctx.fillRect(
      this.x * this.scale,
      this.y * this.scale,
      this.scale,
      this.scale
    );
  }

  public clear(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(
      this.x * this.scale,
      this.y * this.scale,
      this.scale,
      this.scale
    );
  }

  public step() {
    this.alive = this.next;
  }
}
