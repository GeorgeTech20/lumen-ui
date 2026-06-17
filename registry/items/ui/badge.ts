import { Directive, computed, input } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

/** Styled Badge (helm). Use on a span: `<span signngBadge variant="secondary">New</span>`. */
@Directive({ selector: '[signngBadge]', host: { '[class]': 'cls()' } })
export class Badge {
  readonly variant = input<VariantProps<typeof badgeVariants>['variant']>('default');
  readonly class = input('');
  protected readonly cls = computed(() => cn(badgeVariants({ variant: this.variant() }), this.class()));
}
