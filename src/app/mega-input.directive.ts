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
    let userInput = numeral().unformat(targetElement.value);
    console.log('numeral value=', userInput)
    if(this.fractionSize){
      let digitOptStr = `1.0-${this.fractionSize}`;
      //userInput = this.decimalPipe.transform(userInput, digitOptStr);
    }
    this.onChangeCallback(userInput);
    this.writeValue(userInput)
  }

  /*Check permission for decimal point */
  isFirstDecimalPoint(targetElement: any) {
    let isValid = false;
    if (this.fractionSize) {
      let value = targetElement.value;
      let precisionArr = value.split(this.separator);
      if (precisionArr != undefined && precisionArr.length == 1)
        isValid = true;
    }
    return isValid;
  }

  /* Check permission for minus character */
  isFirstMinusCharacter(targetElement: any) {
    let isValid = false;
    let value = targetElement.value;
    if (value != undefined) {
      if (!value.toString().includes("-"))
        isValid = true;
    }
    return isValid;
  }

  // @HostListener('input', ['$event.target']) input(targetElement: any) {
  //     console.log('input change event');
  // }
  // @HostListener('keydown', ['$event']) input(event: KeyboardEvent) {
  //   console.log('keydown event');
  //   var key = event.keyCode;
  //   if (key == 190 && this.isFirstDecimalPoint(event.target))
  //     return;
  //   if (key == 189 && this.isFirstMinusCharacter(event.target))
  //     return;
  //   // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
  //   // This lets us support copy and paste too
  //   if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40))
  //     return

  //   //$browser.defer(listener)
  // }
  @HostListener('blur',['$event.target']) touched(targetElement: any) {
      console.log('blur event')
      this.changeValueFn(targetElement);
      this.onTouchedCallback();
  };
  @HostListener('paste', ['$event.target']) paste(targetElement: any) {
    console.log('paste event');
    // this.changeValueFn(targetElement);
    // this.onTouchedCallback();
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
