import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { Icon } from '@/components/ui/icon';

const LINKS = [
  { path: '/', label: 'Components', exact: true },
  { path: '/blocks', label: 'Blocks', exact: false },
  { path: '/icons', label: 'Icons', exact: false },
  { path: '/colors', label: 'Colors', exact: false },
  { path: '/docs', label: 'Docs', exact: false },
  { path: '/dashboard', label: 'Dashboard', exact: false },
];

/**
 * Global minimal navbar (shadcn-style): brand + route links + GitHub + theme toggle, mounted once
 * in the app shell. Hides itself on /dashboard — that route is a full app chrome with its own
 * header, and stacking two navigation bars there reads as a bug, not a feature.
 */
@Component({
  selector: 'signng-site-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, Icon],
  template: `
    @if (!onDashboard()) {
      <nav class="sticky top-0 z-30 h-[52px] border-b border-border bg-background/90 backdrop-blur">
        <div class="mx-auto flex h-full max-w-6xl items-center gap-1 px-4">
          <a routerLink="/" class="mr-3 flex items-center gap-2 font-bold tracking-tight hover:opacity-80">
            <span class="text-primary"><signng-icon name="bar" [size]="20" /></span> signng
          </a>
          @for (l of LINKS; track l.path) {
            <a
              [routerLink]="l.path"
              routerLinkActive="text-foreground font-medium"
              [routerLinkActiveOptions]="{ exact: l.exact }"
              class="hidden rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground sm:inline-flex"
            >{{ l.label }}</a>
          }
          <div class="flex-1"></div>
          <a href="https://github.com/GeorgeTech20/signng-ui" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
            class="inline-flex size-8 items-center justify-center rounded-md border border-border hover:bg-accent">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M12 1A11 11 0 0 0 8.52 22.44c.55.1.75-.24.75-.53v-1.86c-3.06.67-3.7-1.47-3.7-1.47-.5-1.27-1.22-1.61-1.22-1.61-1-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.68 2.57 1.2 3.2.92.1-.71.38-1.2.7-1.47-2.44-.28-5.01-1.22-5.01-5.43 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.92 0 0 .92-.3 3.02 1.13a10.4 10.4 0 0 1 5.5 0C17.46 5.6 18.38 5.9 18.38 5.9c.6 1.52.22 2.64.11 2.92.7.77 1.13 1.75 1.13 2.95 0 4.22-2.58 5.15-5.03 5.42.39.34.74 1.01.74 2.04v3.03c0 .29.2.64.76.53A11 11 0 0 0 12 1Z"/></svg>
          </a>
          <button (click)="dark.set(!dark())" [attr.aria-label]="dark() ? 'Modo claro' : 'Modo oscuro'" [attr.aria-pressed]="dark()"
            class="inline-flex size-8 items-center justify-center rounded-md border border-border hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <signng-icon [name]="dark() ? 'sun' : 'moon'" [size]="15" />
          </button>
        </div>
      </nav>
    }
  `,
})
export class SiteNav {
  protected readonly LINKS = LINKS;
  private readonly router = inject(Router);
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );
  protected onDashboard(): boolean {
    return this.url().startsWith('/dashboard');
  }

  // Dark mode lives on <html> so CDK overlays (portaled to <body>) inherit it too.
  protected readonly dark = signal(false);
  constructor() {
    effect(() => {
      if (typeof document !== 'undefined') document.documentElement.classList.toggle('dark', this.dark());
    });
    inject(DestroyRef).onDestroy(() => {
      if (typeof document !== 'undefined') document.documentElement.classList.remove('dark');
    });
  }
}
