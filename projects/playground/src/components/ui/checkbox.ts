import { ChangeDetectionStrategy, Component, booleanAttribute, input, model } from '@angular/core';
import { SignngCheckbox } from '@signng/core/checkbox';
import { cn } from '@/lib/utils';

/** Styled tri-state Checkbox (helm) over the @signng/core/checkbox primitive. */
@Component({
  selector: 'signng-checkbox',
  imports: [SignngCheckbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      signngCheckbox
      [(checked)]="checked"
      [(indeterminate)]="indeterminate"
      [disabled]="disabled()"
      [attr.aria-labelledby]="ariaLabelledby()"
      [attr.aria-label]="ariaLabel()"
      [class]="
        cn(
          'inline-flex size-6 shrink-0 items-center justify-center rounded border border-primary shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground',
          class()
        )
      "
    >
      @if (checked() && !indeterminate()) {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="size-4" aria-hidden="true">
          <path d="M5 12l5 5L20 7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      } @else if (indeterminate()) {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="size-4" aria-hidden="true">
          <path d="M5 12h14" stroke-linecap="round" />
        </svg>
      }
    </button>
  `,
})
export class Checkbox {
  readonly checked = model(false);
  readonly indeterminate = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelledby = input<string | undefined>(undefined);
  readonly class = input('');
  protected readonly cn = cn;
}
