import {
  Directive,
  ElementRef,
  afterNextRender,
  booleanAttribute,
  inject,
  input,
  isDevMode,
  model,
} from '@angular/core';

/**
 * Net-new headless Switch primitive (no switch primitive exists in @angular/aria/cdk).
 * Apply to a native `<button type="button">`. The directive owns role=switch, aria-checked,
 * the data-state hooks, soft-disable (tabindex/aria-disabled — NOT the native disabled prop),
 * and Space/Enter keyboard toggle. Drive visuals off the host `data-state`/`aria-disabled`.
 *
 * Signals-only, zoneless/SSR-safe, no DOM access at construction. No bypassSecurityTrust*.
 */
@Directive({
  selector: '[signngSwitch]',
  exportAs: 'signngSwitch',
  host: {
    role: 'switch',
    class: 'signng-switch',
    '[attr.aria-checked]': 'checked()',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.data-state]': 'checked() ? "checked" : "unchecked"',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '(click)': 'toggle()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class SignngSwitch {
  /** Two-way bound checked state: `[(checked)]`. */
  readonly checked = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    afterNextRender(() => {
      if (isDevMode() && !hasAccessibleName(host)) {
        console.warn('[signngSwitch] missing accessible name — add aria-label or aria-labelledby.');
      }
    });
  }

  /** Public imperative toggle. No-ops while disabled. */
  toggle(): void {
    if (!this.disabled()) this.checked.update((v) => !v);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === ' ' || event.key === 'Enter') {
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
