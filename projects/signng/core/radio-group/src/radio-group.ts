import {
  Directive,
  ElementRef,
  booleanAttribute,
  computed,
  contentChildren,
  forwardRef,
  inject,
  input,
  model,
} from '@angular/core';

/**
 * Net-new compound RadioGroup primitive — the provider-directive + item-directive + DI-as-context
 * pattern (like Tabs/Slider), authored from scratch (no radio-group primitive in @angular/aria/cdk).
 *
 * WAI-ARIA APG radiogroup: roving tabindex (one tab stop), arrow keys move AND select (selection
 * follows focus), Home/End, wrap. role + ARIA live in host bindings so a consumer can't drop them.
 * Signals-only, zoneless/SSR-safe (DOM only touched in event handlers).
 */
@Directive({
  selector: '[signngRadio]',
  exportAs: 'signngRadio',
  host: {
    role: 'radio',
    class: 'signng-radio',
    '[attr.aria-checked]': 'checked()',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[attr.data-state]': 'checked() ? "checked" : "unchecked"',
    '[attr.tabindex]': 'tabindex()',
    '(click)': 'select()',
    '(keydown.space)': 'onSpace($event)',
  },
})
export class SignngRadio {
  private readonly group = inject<SignngRadioGroup>(forwardRef(() => SignngRadioGroup));
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly value = input.required<string>();
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly checked = computed(() => this.group.value() === this.value());
  readonly isDisabled = computed(() => this.group.disabled() || this.disabled());

  /**
   * Roving tabindex: the checked item is the tab stop; if none checked, the first enabled item is.
   * Edge: with no initial value, the "first enabled" branch depends on `items()`, which resolves
   * after content init — so prefer giving the group a default `value` for SSR/pre-hydration keyboard.
   */
  readonly tabindex = computed(() => {
    if (this.isDisabled()) return -1;
    if (this.group.value() !== null) return this.checked() ? 0 : -1;
    const enabled = this.group.items().filter((i) => !i.isDisabled());
    return enabled[0] === this ? 0 : -1;
  });

  select(): void {
    if (this.isDisabled()) return;
    this.group.select(this.value());
    this.focus();
  }

  protected onSpace(event: Event): void {
    event.preventDefault(); // swallow Space-scroll
    this.select();
  }

  focus(): void {
    this.host.nativeElement.focus();
  }
}

@Directive({
  selector: '[signngRadioGroup]',
  exportAs: 'signngRadioGroup',
  host: {
    role: 'radiogroup',
    '[attr.aria-orientation]': 'orientation()',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '(keydown)': 'onKeydown($event)',
  },
})
export class SignngRadioGroup {
  /** Two-way bound selected value: `[(value)]`. */
  readonly value = model<string | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly orientation = input<'horizontal' | 'vertical'>('vertical');

  readonly items = contentChildren(SignngRadio);

  select(value: string): void {
    if (!this.disabled()) this.value.set(value);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    const enabled = this.items().filter((i) => !i.isDisabled());
    if (!enabled.length) return;

    let target: SignngRadio | undefined;
    const current = enabled.findIndex((i) => i.checked());
    const start = current < 0 ? 0 : current;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        target = enabled[(start + 1) % enabled.length];
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        target = enabled[(start - 1 + enabled.length) % enabled.length];
        break;
      case 'Home':
        target = enabled[0];
        break;
      case 'End':
        target = enabled[enabled.length - 1];
        break;
      default:
        return;
    }
    event.preventDefault();
    this.select(target.value());
    target.focus();
  }
}

/** Convenience import barrel for templates. */
export const SIGNNG_RADIO_GROUP = [SignngRadioGroup, SignngRadio] as const;
