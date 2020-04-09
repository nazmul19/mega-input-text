import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MegaInputDirective } from './mega-input.directive';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    MegaInputDirective
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [DecimalPipe],
  bootstrap: [AppComponent],
  exports: [ MegaInputDirective]
})
export class AppModule { }
