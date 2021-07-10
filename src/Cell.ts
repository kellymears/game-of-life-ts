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

  public box: {
    x: number;
    y: number;
    scale: number;
  } = {
    x: 0,
    y: 0,
    scale: 0,
  };

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

  public constructor([x, y]: Coordinate, group?: number) {
    this.x = x;
    this.y = y;

    if (group) this.group = group;

    this.alive = Math.random() > 0.5 ? STATE.ALIVE : STATE.DEAD;
  }

  public load(life: Life) {
    if (!life.context) return;

    this.box.scale = life.scale;

    this.box.x = this.x * this.box.scale;
    this.box.y = this.y * this.box.scale;

    const colors = [255 * (this.x / life.width), 255 * (this.y / life.height)];

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

    return this;
  }

  public render(ctx: CanvasRenderingContext2D): Cell {
    if (this.alive == this.next) return this;
    return this.next ? this.draw(ctx) : this.clear(ctx);
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
    ctx.fillRect(this.box.x, this.box.y, this.box.scale, this.box.scale);

    return this;
  }

  public clear(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(this.box.x, this.box.y, this.box.scale, this.box.scale);

    return this;
  }

  public step() {
    this.alive = this.next;
    return this;
  }
}
