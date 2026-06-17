import { ChangeDetectionStrategy, Component, computed, input, linkedSignal } from '@angular/core';
import { cn } from '@/lib/utils';

/**
 * Image-scoped URL allowlist: relative URLs, http(s), blob:, and data:image/* are all safe as an
 * <img src> (not script-executing); javascript:/vbscript:/file:/data:text/html etc. are blocked.
 * Broader than a generic link allowlist on purpose — avatars use object-URLs and data-URI previews.
 */
function safeImageUrl(raw: string): string {
  const s = raw.trim();
  if (!s) return '';
  const scheme = s.toLowerCase().match(/^([a-z][a-z0-9+.-]*):/);
  if (!scheme) return s; // relative URL, no scheme
  switch (scheme[1]) {
    case 'http':
    case 'https':
    case 'blob':
      return s;
    case 'data':
      return /^data:image\//i.test(s) ? s : '';
    default:
      return ''; // javascript:, vbscript:, file:, data:text/html, …
  }
}

/**
 * Styled Avatar (helm). Renders an image, falling back to initials on error or unsafe src.
 * The src passes the image-scoped URL allowlist before binding (defense-in-depth over Angular's
 * sanitizer); `javascript:`/unsafe schemes never reach `[src]`.
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

  protected readonly safeSrc = computed(() => safeImageUrl(this.src()));
  // Reset the error state whenever the (sanitized) src changes — avoids stale fallback on reuse.
  protected readonly errored = linkedSignal({ source: this.safeSrc, computation: () => false });
  protected readonly hostClass = computed(() =>
    cn('relative flex size-10 shrink-0 overflow-hidden rounded-full bg-muted', this.class()),
  );
}
