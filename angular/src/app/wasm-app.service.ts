import { Injectable } from '@angular/core';

@Injectable()
export class WasmAppService {
    private wasmAppPromise: Promise<WasmApp>;

    constructor() {
        this.wasmAppPromise = import('wasm-app');
    }

    public getWasmAppAsync(): Promise<WasmApp> {
        return this.wasmAppPromise;
    }
}

export interface WasmApp {
    greet(): void;
}
