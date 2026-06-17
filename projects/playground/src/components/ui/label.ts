import { Directive, computed, input } from '@angular/core';
import { cn } from '@/lib/utils';

/** Styled native label (helm). Attribute directive. Use with `for` to associate a control (a11y). */
@Directive({
  selector: 'label[signngLabel]',
  host: {
    '[class]': 'classes()',
  },
})
export class Label {
  readonly class = input('');
  protected readonly classes = computed(() =>
    cn('text-sm font-medium leading-none select-none', this.class()),
  );
}
