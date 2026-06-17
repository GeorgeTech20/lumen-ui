import { Directive, computed, input } from '@angular/core';
import { cn } from '@/lib/utils';

/** Skeleton placeholder (helm). Decorative (aria-hidden) pulsing block. */
@Directive({
  selector: '[signngSkeleton]',
  host: {
    'aria-hidden': 'true',
    '[class]': 'cls()',
  },
})
export class Skeleton {
  readonly class = input('');
  protected readonly cls = computed(() => cn('animate-pulse rounded-md bg-muted', this.class()));
}
