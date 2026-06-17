import { ChangeDetectionStrategy, Component, booleanAttribute, input, model } from '@angular/core';
import { SignngSwitch } from '@signng/core/switch';
import { cn } from '@/lib/utils';

/** Styled Switch (helm). Behaviour + a11y from the versioned @signng/core/switch primitive. */
@Component({
  selector: 'signng-switch',
  imports: [SignngSwitch],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      signngSwitch
      [(checked)]="checked"
      [disabled]="disabled()"
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
export class Switch {
  readonly checked = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelledby = input<string | undefined>(undefined);
  readonly class = input('');
  protected readonly cn = cn;
}
