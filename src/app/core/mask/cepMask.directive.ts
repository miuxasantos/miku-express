import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: '[appCepMask]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CepMaskDirective),
    multi: true
  }]
})
export class CepMaskDirective implements ControlValueAccessor {
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private elementRef: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const rawValue = input.value.replace(/\D/g, ''); // Remove não números
    
    // Aplica máscara visual: 00000-000
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
    
    if (value.length <= 5) {
      return value;
    } else {
      return value.substring(0, 5) + '-' + value.substring(5, 8);
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