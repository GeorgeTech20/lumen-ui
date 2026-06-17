import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '@/lib/utils';

/** Styled Progress (helm). role=progressbar with aria-valuenow/min/max. */
@Component({
  selector: 'signng-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'progressbar',
    'aria-valuemin': '0',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-valuenow]': 'value()',
    '[attr.aria-label]': 'label() || null',
    '[class]': 'cls()',
  },
  template: `
    <div class="h-full w-full flex-1 bg-primary transition-transform" [style.transform]="barTransform()"></div>
  `,
})
export class Progress {
  readonly value = input(0);
  readonly max = input(100);
  readonly label = input('');
  readonly class = input('');

  protected readonly pct = computed(() => {
    const max = this.max() || 100;
    return Math.min(100, Math.max(0, (this.value() / max) * 100));
  });
  protected readonly barTransform = computed(() => `translateX(-${100 - this.pct()}%)`);
  protected readonly cls = computed(() =>
    cn('relative block h-2 w-full overflow-hidden rounded-full bg-secondary', this.class()),
  );
}
