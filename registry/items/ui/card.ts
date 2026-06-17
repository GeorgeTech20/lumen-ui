import { Directive, computed, input } from '@angular/core';
import { cn } from '@/lib/utils';

/** Card part directives (helm). Compose: `<div signngCard><div signngCardHeader>…`. */
@Directive({ selector: '[signngCard]', host: { '[class]': 'cls()' } })
export class Card {
  readonly class = input('');
  protected readonly cls = computed(() =>
    cn('rounded-lg border border-border bg-card text-card-foreground shadow-sm', this.class()),
  );
}

@Directive({ selector: '[signngCardHeader]', host: { '[class]': 'cls()' } })
export class CardHeader {
  readonly class = input('');
  protected readonly cls = computed(() => cn('flex flex-col gap-1.5 p-6', this.class()));
}

@Directive({ selector: '[signngCardTitle]', host: { '[class]': 'cls()' } })
export class CardTitle {
  readonly class = input('');
  protected readonly cls = computed(() => cn('font-semibold leading-none tracking-tight', this.class()));
}

@Directive({ selector: '[signngCardDescription]', host: { '[class]': 'cls()' } })
export class CardDescription {
  readonly class = input('');
  protected readonly cls = computed(() => cn('text-sm text-muted-foreground', this.class()));
}

@Directive({ selector: '[signngCardContent]', host: { '[class]': 'cls()' } })
export class CardContent {
  readonly class = input('');
  protected readonly cls = computed(() => cn('p-6 pt-0', this.class()));
}

@Directive({ selector: '[signngCardFooter]', host: { '[class]': 'cls()' } })
export class CardFooter {
  readonly class = input('');
  protected readonly cls = computed(() => cn('flex items-center p-6 pt-0', this.class()));
}

export const SIGNNG_CARD = [Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter] as const;
