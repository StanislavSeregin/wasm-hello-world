import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameOfLifeComponent } from './game-of-life/game-of-life.component';
import { FmOscComponent } from './fm-osc/fm-osc.component';

@NgModule({
  declarations: [
    AppComponent,
    GameOfLifeComponent,
    FmOscComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
