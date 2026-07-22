import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SignngSwitch } from '@signng/core/switch';
import { cn } from '@/lib/utils';

/**
 * Styled Switch (helm). Behaviour + a11y from the versioned @signng/core/switch primitive.
 * Implements ControlValueAccessor — works with `formControlName`/`[(ngModel)]`.
 */
@Component({
  selector: 'signng-switch',
  imports: [SignngSwitch],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Switch), multi: true }],
  template: `
    <button
      type="button"
      signngSwitch
      [(checked)]="checked"
      [disabled]="isDisabled()"
      (blur)="onTouched()"
      [attr.aria-labelledby]="ariaLabelledby()"
      [attr.aria-label]="ariaLabel()"
      [class]="
        cn(
          'group inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-disabled:cursor-not-allowed aria-disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
          class()
        )
      "
    >
      <!-- thumb position reads the primitive's authoritative host data-state, not a duplicated signal -->
      <span
        class="pointer-events-none block size-5 rounded-full bg-background shadow-lg ring-0 transition-transform group-data-[state=checked]:translate-x-5 group-data-[state=unchecked]:translate-x-0"
      ></span>
    </button>
  `,
})
export class Switch implements ControlValueAccessor {
  readonly checked = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelledby = input<string | undefined>(undefined);
  readonly class = input('');
  protected readonly cn = cn;

  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  private onChange: (value: boolean) => void = () => {};
  protected onTouched: () => void = () => {};

  constructor() {
    effect(() => this.onChange(this.checked()));
  }

  writeValue(value: boolean): void {
    this.checked.set(!!value);
  }
  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}
