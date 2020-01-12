import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Universe } from 'wasm-app';
type WasmApp = typeof import('wasm-app');
const asyncImport = import('wasm-app');

const CELL_SIZE = 5;
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('canvas', { static: false }) canvasElementRef: ElementRef<HTMLCanvasElement>;
  private canvasRenderingContext2D: CanvasRenderingContext2D;
  private wasmApp: WasmApp;
  private universe: Universe;
  private universeWidth: number;
  private universeHeight: number;

  async ngOnInit() {
    this.wasmApp = await asyncImport;
    this.initUniverse();
    this.runAnimation();
  }

  private initUniverse() {
    this.universe = this.wasmApp.Universe.new();
    this.universeWidth = this.universe.width();
    this.universeHeight = this.universe.height();
    const canvas = this.canvasElementRef.nativeElement;
    canvas.width = (CELL_SIZE + 1) * this.universeWidth + 1;
    canvas.height = (CELL_SIZE + 1) * this.universeHeight + 1;
    this.canvasRenderingContext2D = canvas.getContext('2d');
  }

  private runAnimation() {
    const renderLoop = () => {
      this.universe.tick();
      this.drawGrid();
      this.drawCells();
      requestAnimationFrame(renderLoop);
    };

    requestAnimationFrame(renderLoop);
  }

  private drawGrid() {
    this.canvasRenderingContext2D.beginPath();
    this.canvasRenderingContext2D.strokeStyle = GRID_COLOR;
    for (let i = 0; i <= this.universeWidth; i++) {
      this.canvasRenderingContext2D.moveTo(
        i * (CELL_SIZE + 1) + 1,
        0
      );

      this.canvasRenderingContext2D.lineTo(
        i * (CELL_SIZE + 1) + 1,
        (CELL_SIZE + 1) * this.universeHeight + 1
      );
    }

    for (let j = 0; j <= this.universeHeight; j++) {
      this.canvasRenderingContext2D.moveTo(
        0,
        j * (CELL_SIZE + 1) + 1
      );

      this.canvasRenderingContext2D.lineTo(
        (CELL_SIZE + 1) * this.universeWidth + 1,
        j * (CELL_SIZE + 1) + 1
      );
    }

    this.canvasRenderingContext2D.stroke();
  };

  private drawCells() {
    const cellsPtr = this.universe.cells();
    const cells = new Uint8Array(
      this.wasmApp.wasm_memory().buffer,
      cellsPtr,
      this.universeWidth * this.universeHeight
    );

    this.canvasRenderingContext2D.beginPath();
    for (let row = 0; row < this.universeHeight; row++) {
      for (let col = 0; col < this.universeWidth; col++) {
        const idx = row * this.universeWidth + col;
        this.canvasRenderingContext2D.fillStyle = cells[idx] === this.wasmApp.Cell.Dead
          ? DEAD_COLOR
          : ALIVE_COLOR;

        this.canvasRenderingContext2D.fillRect(
          col * (CELL_SIZE + 1) + 1,
          row * (CELL_SIZE + 1) + 1,
          CELL_SIZE,
          CELL_SIZE
        );
      }
    }

    this.canvasRenderingContext2D.stroke();
  };
}
