import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon, ICONS, type IconName } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Toaster, ToastService } from '@/components/ui/toast';
import { inject } from '@angular/core';

/** Icon gallery — browse the built-in stroke icon set, click a card to copy its usage snippet. */
@Component({
  selector: 'signng-icons-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, Input, Toaster],
  template: `
    <div class="min-h-screen bg-background text-foreground">
      <div class="sticky top-0 z-20 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
        <div class="mx-auto flex max-w-5xl items-center gap-3">
          <a routerLink="/" class="flex items-center gap-2 font-bold hover:opacity-80">
            <span class="text-primary"><signng-icon name="bar" [size]="18" /></span> Icons
          </a>
          <span class="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">{{ names().length }}</span>
          <div class="flex-1"></div>
          <input signngInput class="max-w-xs" placeholder="Search icons…" [value]="q()" (input)="q.set($any($event.target).value)" />
        </div>
      </div>

      <main class="mx-auto max-w-5xl px-4 py-8">
        <p class="mb-6 text-sm text-muted-foreground">
          Feather-style stroke icons, 24px grid, zero dependencies — click a card to copy
          <code class="rounded bg-muted px-1 py-0.5">&lt;signng-icon name="…" /&gt;</code>.
        </p>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
          @for (name of filtered(); track name) {
            <button
              type="button"
              (click)="copy(name)"
              class="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-center hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <signng-icon [name]="name" [size]="22" />
              <span class="w-full truncate text-xs text-muted-foreground">{{ name }}</span>
            </button>
          }
        </div>
        @if (!filtered().length) {
          <p class="py-16 text-center text-muted-foreground">No icons match "{{ q() }}".</p>
        }
      </main>
      <signng-toaster />
    </div>
  `,
})
export class IconsPage {
  private readonly toast = inject(ToastService);
  protected readonly names = signal(Object.keys(ICONS) as IconName[]);
  protected readonly q = signal('');
  protected readonly filtered = computed(() => {
    const query = this.q().toLowerCase().trim();
    return query ? this.names().filter((n) => n.includes(query)) : this.names();
  });

  protected copy(name: IconName): void {
    const snippet = `<signng-icon name="${name}" />`;
    navigator.clipboard?.writeText(snippet);
    this.toast.success('Copied', snippet);
  }
}
