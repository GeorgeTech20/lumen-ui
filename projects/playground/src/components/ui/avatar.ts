import { ChangeDetectionStrategy, Component, computed, input, linkedSignal } from '@angular/core';
import { sanitizeUrl } from '@signng/core/primitives';
import { cn } from '@/lib/utils';

/**
 * Styled Avatar (helm). Renders an image, falling back to initials on error or unsafe src.
 * Security: the src is run through the signng URL scheme allowlist (`sanitizeUrl`) before binding,
 * so `javascript:`/unsafe schemes can never reach `[src]` (defense-in-depth over Angular's sanitizer).
 */
@Component({
  selector: 'signng-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    @if (!errored() && safeSrc()) {
      <img
        [src]="safeSrc()"
        [alt]="alt()"
        (error)="errored.set(true)"
        class="aspect-square size-full object-cover"
      />
    } @else {
      <span class="flex size-full items-center justify-center text-sm font-medium text-muted-foreground">
        {{ fallback() }}
      </span>
    }
  `,
})
export class Avatar {
  readonly src = input('');
  readonly alt = input('');
  readonly fallback = input('?');
  readonly class = input('');

  protected readonly safeSrc = computed(() => {
    const raw = this.src();
    return raw ? sanitizeUrl(raw, '') : '';
  });
  // Reset the error state whenever the (sanitized) src changes — avoids stale fallback on reuse.
  protected readonly errored = linkedSignal({ source: this.safeSrc, computation: () => false });
  protected readonly hostClass = computed(() =>
    cn('relative flex size-10 shrink-0 overflow-hidden rounded-full bg-muted', this.class()),
  );
}
