import { Directive, ElementRef, computed, inject, input, model } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
  {
    variants: {
      variant: { default: 'bg-transparent', outline: 'border border-input bg-transparent' },
      size: { default: 'h-10 px-3', sm: 'h-9 px-2.5', lg: 'h-11 px-5' },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

/**
 * Styled Toggle (helm) — a two-state button (aria-pressed). Apply to a native `<button>`; use the
 * native `disabled` attribute (the directive reads it, so `:disabled` styling works correctly).
 */
@Directive({
  selector: 'button[signngToggle]',
  host: {
    type: 'button',
    '[attr.aria-pressed]': 'pressed()',
    '[attr.data-state]': 'pressed() ? "on" : "off"',
    '[class]': 'cls()',
    '(click)': 'toggle()',
  },
})
export class Toggle {
  readonly pressed = model(false);
  readonly variant = input<VariantProps<typeof toggleVariants>['variant']>('default');
  readonly size = input<VariantProps<typeof toggleVariants>['size']>('default');
  readonly class = input('');

  private readonly host = inject<ElementRef<HTMLButtonElement>>(ElementRef);
  protected readonly cls = computed(() =>
    cn(toggleVariants({ variant: this.variant(), size: this.size() }), this.class()),
  );

  toggle(): void {
    if (!this.host.nativeElement.disabled) this.pressed.update((v) => !v);
  }
}
