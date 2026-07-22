import { ChangeDetectionStrategy, Component, effect, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SignngRadio, SignngRadioGroup } from '@signng/core/radio-group';

/**
 * Styled RadioGroup (helm) over the @signng/core/radio-group compound primitive.
 * Container: `<signng-radio-group [(value)]="x" aria-labelledby="...">`.
 * Item: `<signng-radio value="a">Label</signng-radio>` — the projected text is the radio's name.
 * Implements ControlValueAccessor — works with `formControlName`/`[(ngModel)]` too.
 */
@Component({
  selector: 'signng-radio-group',
  hostDirectives: [
    { directive: SignngRadioGroup, inputs: ['value', 'disabled', 'orientation'], outputs: ['valueChange'] },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'grid gap-2', '(focusout)': 'onTouched()' },
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RadioGroup), multi: true }],
  template: `<ng-content />`,
})
export class RadioGroup implements ControlValueAccessor {
  // Injected directly (bypasses hostDirectives' template-binding-only forwarding) so CVA can set
  // value/disabled imperatively — both are `model()` on the primitive, so this is a plain signal write.
  private readonly group = inject(SignngRadioGroup, { self: true });

  private onChange: (value: string | null) => void = () => {};
  protected onTouched: () => void = () => {};

  constructor() {
    effect(() => this.onChange(this.group.value()));
  }

  writeValue(value: string | null): void {
    this.group.value.set(value);
  }
  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.group.disabled.set(isDisabled);
  }
}

@Component({
  selector: 'signng-radio',
  hostDirectives: [{ directive: SignngRadio, inputs: ['value', 'disabled'] }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'inline-flex items-center gap-2 text-sm cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
  },
  template: `
    <span
      class="flex size-5 shrink-0 items-center justify-center rounded-full border border-primary"
    >
      @if (radio.checked()) {
        <span class="size-2.5 rounded-full bg-primary"></span>
      }
    </span>
    <ng-content />
  `,
})
export class Radio {
  protected readonly radio = inject(SignngRadio, { self: true });
}
