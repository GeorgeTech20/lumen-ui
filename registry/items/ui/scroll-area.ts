import { Directive, computed, input } from '@angular/core';
import { cn } from '@/lib/utils';

/** Styled scroll container (helm). Native overflow + thin themed scrollbar. Set a max height. */
@Directive({
  selector: '[signngScrollArea]',
  host: {
    // Keyboard users must be able to focus + scroll the region (axe scrollable-region-focusable).
    tabindex: '0',
    '[class]': 'cls()',
  },
})
export class ScrollArea {
  readonly class = input('');
  protected readonly cls = computed(() =>
    cn(
      'relative overflow-auto rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring [scrollbar-width:thin] [scrollbar-color:var(--color-border)_transparent]',
      this.class(),
    ),
  );
}
