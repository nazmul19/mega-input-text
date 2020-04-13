import {Directive, Renderer2, ElementRef, Input, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as numeral from "numeraljs";
import { DecimalPipe } from '@angular/common';

@Directive({
  selector: '[megaInput]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(()=> MegaInputDirective),
    multi: true
  }]
})
export class MegaInputDirective implements ControlValueAccessor {
  @Input()
  fractionSize: number;
  separator: string = '.';
  onChangeCallback = (_: any) => {};
  onTouchedCallback = () => {};
  changeValueFn(targetElement: any){
    let raw = targetElement.value;
    raw = raw.toLowerCase().replace(/ /g, '');
    raw = raw.replace(/[^\dkmbt.-]/g, '');
    if(this.fractionSize == null) 
      raw = raw.replace(/[^\dkmbt-]/g, '');
    let userInput = numeral().unformat(raw);
    if(this.fractionSize){
      userInput = Number(userInput.toFixed(this.fractionSize));
      var rounder = Math.pow(10, this.fractionSize);
      userInput = (userInput * rounder) / rounder;
    }
    this.onChangeCallback(userInput);
    this.writeValue(userInput)
  }

  @HostListener('blur',['$event.target']) touched(targetElement: any) {
      this.changeValueFn(targetElement);
      this.onTouchedCallback();
  }
  @HostListener('paste', ['$event.target']) paste(targetElement: any) {
    
  }

  constructor(private _renderer: Renderer2, private _elementRef: ElementRef, private decimalPipe: DecimalPipe) {
      
  }

  writeValue(value: any): void {
      console.log('writeValue method', value);
      let displayValue: any;
      if(this.fractionSize){
        let digitOptStr = `1.0-${this.fractionSize}`;
        displayValue = this.decimalPipe.transform(value, digitOptStr);
      } else {
        displayValue = this.decimalPipe.transform(value);
      }
      this._renderer.setProperty(this._elementRef.nativeElement, 'value', displayValue);
      this._renderer.setAttribute(this._elementRef.nativeElement, 'data-valuex', 'hello');
   }

  registerOnChange(fn: any){
      console.log('registerOnChange')
      this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any){
      console.log('registerOnTouched')
      this.onTouchedCallback = fn;
  }

}
