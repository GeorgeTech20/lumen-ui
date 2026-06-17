import { Directive, computed, input } from '@angular/core';
import { cn } from '@/lib/utils';

/** Styled Separator (helm). role=separator with orientation. */
@Directive({
  selector: '[signngSeparator]',
  host: {
    role: 'separator',
    '[attr.aria-orientation]': 'orientation()',
    '[class]': 'cls()',
  },
})
export class Separator {
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly class = input('');
  protected readonly cls = computed(() =>
    cn('shrink-0 bg-border', this.orientation() === 'horizontal' ? 'h-px w-full' : 'h-full w-px', this.class()),
  );
}
