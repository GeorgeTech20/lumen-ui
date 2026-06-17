import { Directive, computed, input } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const alertVariants = cva('relative w-full rounded-lg border px-4 py-3 text-sm', {
  variants: {
    variant: {
      default: 'bg-background text-foreground border-border',
      destructive: 'border-destructive/50 text-destructive',
    },
  },
  defaultVariants: { variant: 'default' },
});

/**
 * Alert part directives (helm). A styled container — NO role by default (a static info box is not a
 * live region). For dynamic important messages add role="alert" (assertive) or role="status" yourself.
 */
@Directive({ selector: '[signngAlert]', host: { '[class]': 'cls()' } })
export class Alert {
  readonly variant = input<VariantProps<typeof alertVariants>['variant']>('default');
  readonly class = input('');
  protected readonly cls = computed(() => cn(alertVariants({ variant: this.variant() }), this.class()));
}

@Directive({ selector: '[signngAlertTitle]', host: { '[class]': 'cls()' } })
export class AlertTitle {
  readonly class = input('');
  protected readonly cls = computed(() => cn('mb-1 font-medium leading-none tracking-tight', this.class()));
}

@Directive({ selector: '[signngAlertDescription]', host: { '[class]': 'cls()' } })
export class AlertDescription {
  readonly class = input('');
  protected readonly cls = computed(() => cn('text-sm [&_p]:leading-relaxed', this.class()));
}

export const SIGNNG_ALERT = [Alert, AlertTitle, AlertDescription] as const;
