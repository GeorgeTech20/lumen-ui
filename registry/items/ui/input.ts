import { Directive, computed, input } from '@angular/core';
import { cn } from '@/lib/utils';

/** Styled native input (helm). Attribute directive — keeps full native input semantics + a11y. */
@Directive({
  selector: 'input[signngInput]',
  host: {
    '[class]': 'classes()',
  },
})
export class Input {
  readonly class = input('');
  protected readonly classes = computed(() =>
    cn(
      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      this.class(),
    ),
  );
}
