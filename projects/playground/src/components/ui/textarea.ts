import { Directive, computed, input } from '@angular/core';
import { cn } from '@/lib/utils';

/** Styled native textarea (helm). Attribute directive — keeps native textarea semantics + a11y. */
@Directive({
  selector: 'textarea[signngTextarea]',
  host: {
    '[class]': 'classes()',
  },
})
export class Textarea {
  readonly class = input('');
  protected readonly classes = computed(() =>
    cn(
      'flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      this.class(),
    ),
  );
}
