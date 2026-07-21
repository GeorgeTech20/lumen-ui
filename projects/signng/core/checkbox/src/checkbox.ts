import {
  Directive,
  ElementRef,
  afterNextRender,
  booleanAttribute,
  computed,
  inject,
  input,
  isDevMode,
  model,
} from '@angular/core';

/**
 * Net-new headless Checkbox primitive with tri-state (indeterminate) support.
 * Apply to a native `<button type="button">`. Adds role=checkbox, aria-checked
 * (true | false | mixed), data-state hooks, and Space-to-toggle. Per WAI-ARIA APG,
 * activating a "mixed" checkbox resolves it to checked.
 *
 * Signals-only, zoneless/SSR-safe. No bypassSecurityTrust*, no raw DOM writes.
 */
@Directive({
  selector: '[signngCheckbox]',
  exportAs: 'signngCheckbox',
  host: {
    role: 'checkbox',
    class: 'signng-checkbox',
    '[attr.aria-checked]': 'ariaChecked()',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.data-state]': 'dataState()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '(click)': 'toggle()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class SignngCheckbox {
  /** Two-way bound checked state: `[(checked)]`. */
  readonly checked = model(false);
  /** Two-way bound indeterminate ("mixed"). Activation resolves it to checked. */
  readonly indeterminate = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly ariaChecked = computed<'true' | 'false' | 'mixed'>(() =>
    this.indeterminate() ? 'mixed' : this.checked() ? 'true' : 'false',
  );
  protected readonly dataState = computed(() =>
    this.indeterminate() ? 'indeterminate' : this.checked() ? 'checked' : 'unchecked',
  );

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    afterNextRender(() => {
      if (isDevMode() && !hasAccessibleName(host)) {
        console.warn('[signngCheckbox] missing accessible name — add aria-label or aria-labelledby.');
      }
    });
  }

  /** Public imperative toggle. Resolves "mixed" -> checked; otherwise flips. No-ops while disabled. */
  toggle(): void {
    if (this.disabled()) return;
    if (this.indeterminate()) {
      this.indeterminate.set(false);
      this.checked.set(true);
    } else {
      this.checked.update((v) => !v);
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === ' ') {
      event.preventDefault(); // swallow Space-scroll even when disabled
      this.toggle();
    }
  }
}

function hasAccessibleName(el: HTMLElement): boolean {
  return !!(
    el.getAttribute('aria-label') ||
    el.getAttribute('aria-labelledby') ||
    el.textContent?.trim()
  );
}
