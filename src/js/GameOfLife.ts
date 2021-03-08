const { random } = Math;
const CELL_SIZE: number = 4;
const CELL_PADDING: number = 1;
const ROW_COUNT: number = 16;
const COL_COUNT: number = 16;
const ALIVE_COLOR: string = 'rgba(0, 0, 0, 0.125)';

class Position {
  public x: number;
  public y: number;
  constructor(
    x: number,
    y: number
  ) {
    this.x = x * CELL_SIZE;
    this.y = y * CELL_SIZE;
  }
}

class Cell {
  public position: Position;
  public isAlive: boolean = random() > 0.7 ? true : false;

  constructor(
    public x: number,
    public y: number
  ) {
    this.position = new Position(x, y);
  }

  public render(ctx: CanvasRenderingContext2D): void {
    const x: number = this.position.x + CELL_PADDING;
    const y: number = this.position.y + CELL_PADDING;
    const width: number = CELL_SIZE - (CELL_PADDING * 2);
    const height: number = width;

    ctx.globalAlpha = 1;
    ctx.fillStyle = this.isAlive ? ALIVE_COLOR : 'transparent';
    ctx.save();
    ctx.beginPath();
    ctx.fillRect(x, y, width, height);
    ctx.closePath();
    ctx.restore();
  }
}

function createCells(): Cell[][] {
  const cells: Cell[][] = [];

  for (let y = 0; y < ROW_COUNT; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < COL_COUNT; x++) {
      row.push(new Cell(x, y));
    }
    cells.push(row);
  }

  return cells;
}

function setupCanvas(canvas: HTMLCanvasElement): void {
  canvas.height = CELL_SIZE * ROW_COUNT;
  canvas.width = CELL_SIZE * COL_COUNT;
  console.log(canvas);
  canvas.style.position = 'fixed';
  canvas.style.bottom = '0';
  canvas.style.right = '0';
  canvas.style.zIndex = '30';
  document.body.appendChild(canvas);
}

export default function initCanvas(): void {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  setupCanvas(canvas);
  const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
  const cells: Cell[][] = createCells();
  let last: number = 0;

  const render = (): void => cells.forEach((row: Cell[]) => row.forEach((cell: Cell) => cell.render(ctx)));

  const animateCells = (): void => {
    const origins: [number, number][] = [
      [-1, -1], [0, -1], [1, -1],
      [-1, 0], [1, 0],
      [-1, 1], [0, 1], [1, 1],
    ];

    for (let y = 0; y < cells.length; y++) {
      for (let x = 0; x < cells[y].length; x++) {
        let count: number = 0;
        const cell: Cell = cells[y][x];

        for (let origin of origins) {
          const [i, j] = origin;
          const nx: number = x + i;
          const ny: number = y + j;
          if (cells[ny] && cells[ny][nx]) {
            if(cells[ny][nx].isAlive) count++;
          }
        }

        if ((cell.isAlive && (count >= 2 && count <= 3)) || (!cell.isAlive && count === 3)) cell.isAlive = true;
        else cell.isAlive = false;
      }
    }
  };

  const animate = (now: number): void => {
    ctx.clearRect(canvas.clientLeft, canvas.clientTop, canvas.width, canvas.height);
    if (now - last >= 10) {
      last = now;
      animateCells();
    }
    render();
    requestAnimationFrame(animate);
  };

  render();
  requestAnimationFrame(animate);
}
