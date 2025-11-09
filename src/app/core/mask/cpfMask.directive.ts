import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: '[appCpfMask]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CpfMaskDirective),
    multi: true
  }]
})
export class CpfMaskDirective implements ControlValueAccessor {
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private elementRef: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const rawValue = input.value.replace(/\D/g, ''); // Remove não números
    
    // Aplica máscara visual: 000.000.000-00
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
    
    if (value.length <= 3) {
      return value;
    } else if (value.length <= 6) {
      return value.substring(0, 3) + '.' + value.substring(3, 6);
    } else if (value.length <= 9) {
        return value.substring(0, 3) + '.' + value.substring(3, 6) + '.' + value.substring(6, 9);
    } else {
        return value.substring(0, 3) + '.' + value.substring(3, 6) + '.' + value.substring(6, 9) + '-' + value.substring(9, 11);
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