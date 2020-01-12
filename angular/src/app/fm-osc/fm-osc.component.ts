import { Component, OnInit } from '@angular/core';
import { FmOsc } from 'wasm-app';
type WasmApp = typeof import('wasm-app');
const asyncImport = import('wasm-app');

@Component({
  selector: 'app-fm-osc',
  templateUrl: './fm-osc.component.html'
})
export class FmOscComponent implements OnInit {
  public primaryFrequency: string;
  public modulationFrequency: string;
  public modulationAmount: string;
  public gain: string;

  private wasmApp: WasmApp;
  private fm: FmOsc = null;

  async ngOnInit() {
    this.wasmApp = await asyncImport;
  }

  public playOrStopPlayback() {
    if (this.fm === null) {
      this.fm = new this.wasmApp.FmOsc();
      this.fm.set_gain(0.8);
      this.updatePrimaryFrequency();
      this.updateModulationFrequency();
      this.updateModulationAmount();
    } else {
      this.fm.free();
      this.fm = null;
    }
  }

  public updatePrimaryFrequency() {
    if (this.primaryFrequency && this.fm) {
      this.fm.set_note(parseInt(this.primaryFrequency));
    }
  }

  public updateModulationFrequency() {
    if (this.modulationFrequency && this.fm) {
      this.fm.set_fm_frequency(parseFloat(this.modulationFrequency));
    }
  }

  public updateModulationAmount() {
    if (this.modulationAmount && this.fm) {
      this.fm.set_fm_amount(parseFloat(this.modulationAmount));
    }
  }
}
