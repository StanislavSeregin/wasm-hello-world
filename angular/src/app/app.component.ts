import { Component, OnInit } from '@angular/core';
type WasmApp = typeof import('wasm-app');

const CELL_SIZE = 5; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private wasmApp: WasmApp;

  constructor() { }

  async ngOnInit() {
    this.wasmApp = await import('wasm-app');

    this.startLifeTheGame();
  }

  private startLifeTheGame() {
    const universe = this.wasmApp.Universe.new();
    const width = universe.width();
    const height = universe.height();
    const canvas = document.getElementById("game-of-life-canvas") as any; // ???
    canvas.height = (CELL_SIZE + 1) * height + 1;
    canvas.width = (CELL_SIZE + 1) * width + 1;
    const ctx = canvas.getContext('2d');
    const renderLoop = () => {
      universe.tick();
      drawGrid();
      drawCells();
      requestAnimationFrame(renderLoop);
    };

    const drawGrid = () => {
      ctx.beginPath();
      ctx.strokeStyle = GRID_COLOR;
      for (let i = 0; i <= width; i++) {
        ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
        ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
      }

      for (let j = 0; j <= height; j++) {
        ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
        ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
      }

      ctx.stroke();
    };

    const getIndex = (row, column) => {
      return row * width + column;
    };

    const drawCells = () => {
      const cellsPtr = universe.cells();
      const cells = new Uint8Array(this.wasmApp.wasm_memory().buffer, cellsPtr, width * height);

      ctx.beginPath();

      for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
          const idx = getIndex(row, col);

          ctx.fillStyle = cells[idx] === this.wasmApp.Cell.Dead
            ? DEAD_COLOR
            : ALIVE_COLOR;

          ctx.fillRect(
            col * (CELL_SIZE + 1) + 1,
            row * (CELL_SIZE + 1) + 1,
            CELL_SIZE,
            CELL_SIZE
          );
        }
      }

      ctx.stroke();
    };

    drawGrid();
    drawCells();
    requestAnimationFrame(renderLoop);
  }
}
