import { Component, OnInit } from '@angular/core';
import { WasmAppService, WasmApp } from './wasm-app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private wasmApp: WasmApp;

  constructor(
    private wasmAppService: WasmAppService
  ) { }

  async ngOnInit() {
    this.wasmApp = await this.wasmAppService.getWasmAppAsync();
    this.wasmApp.greet();
  }
}
