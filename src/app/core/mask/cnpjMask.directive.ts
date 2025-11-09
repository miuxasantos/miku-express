import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: '[appCnpjMask]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CnpjMaskDirective),
    multi: true
  }]
})
export class CnpjMaskDirective implements ControlValueAccessor {
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private elementRef: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const rawValue = input.value.replace(/\D/g, ''); // Remove não números
    
    // Aplica máscara visual: 00.000.000/0001-00
    const maskedValue = this.applyMask(rawValue);
    
    // Atualiza visualmente
    input.value = maskedValue;
    
    // Envia valor limpo para o form control
    this.onChange(rawValue);
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }

  private applyMask(value: string): string {
    if (!value) return '';
    
    if (value.length <= 2) {
      return value;
    } else if (value.length <= 5) {
      return value.substring(0, 2) + '.' + value.substring(2, 5);
    } else if (value.length <= 8) {
        return value.substring(0, 2) + '.' + value.substring(2, 5) + '.' + value.substring(5, 8);
    } else if (value.length <= 12) {
        return value.substring(0, 2) + '.' + value.substring(2,5) + '.' + value.substring(5, 8) + '/' + value.substring(8, 12);
    } else {
        return value.substring(0, 2) + '.' + value.substring(2,5) + '.' + value.substring(5, 8) + '/' + value.substring(8, 12) + '-' + value.substring(12, 14);
    }
  }

  // ControlValueAccessor methods
  writeValue(value: string): void {
    if (value) {
      const maskedValue = this.applyMask(value);
      this.elementRef.nativeElement.value = maskedValue;
    } else {
      this.elementRef.nativeElement.value = '';
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.elementRef.nativeElement.disabled = isDisabled;
  }
}