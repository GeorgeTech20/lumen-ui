import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Icon } from '@/components/ui/icon';
import { CodeBlock } from '@/components/ui/code-block';
import { CATS, DEMOS, registryItemFor, fetchRegistryItem, type RegistryItem } from './component-catalog';
import { ToastService } from '@/components/ui/toast';

/**
 * Per-component docs page (shadcn /docs/components/[name]-style): category sidebar + a page per
 * component with description, install command, dependencies, and full source pulled from the
 * signed registry. "View live" deep-links back to the Showcase card (id="c-{Name}") instead of
 * re-implementing every interactive demo a second time — see blocks-showcase skill for why.
 */
@Component({
  selector: 'signng-docs-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, Icon, CodeBlock],
  template: `
    <div class="min-h-screen bg-background text-foreground">
      <div class="sticky top-[52px] z-20 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
        <div class="mx-auto flex max-w-6xl items-center gap-3">
          <a routerLink="/" class="flex items-center gap-2 font-bold hover:opacity-80">
            <span class="text-primary"><signng-icon name="bar" [size]="18" /></span> Docs
          </a>
          <span class="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">{{ DEMOS.length }} components</span>
        </div>
      </div>

      <div class="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 md:grid-cols-[220px_1fr]">
        <!-- Sidebar: category > component links -->
        <nav class="md:sticky md:top-20 md:self-start">
          @for (cat of CATS; track cat) {
            <div class="mb-4">
              <div class="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{{ cat }}</div>
              @for (d of demosIn(cat); track d.name) {
                <a
                  [routerLink]="['/docs', d.name]"
                  routerLinkActive="bg-accent text-accent-foreground font-medium"
                  class="block truncate rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                >{{ d.name }}</a>
              }
            </div>
          }
        </nav>

        <!-- Detail -->
        <main>
          @if (!name()) {
            <div class="fade-up">
              <h1 class="text-3xl font-bold tracking-tight">Components</h1>
              <p class="mt-3 max-w-xl text-muted-foreground">Pick a component from the sidebar — each page shows its description, install command, dependencies, and full source pulled live from the signed registry.</p>
            </div>
          } @else if (item.isLoading()) {
            <div class="space-y-3">
              <div class="h-8 w-48 animate-pulse rounded bg-muted"></div>
              <div class="h-4 w-80 animate-pulse rounded bg-muted"></div>
            </div>
          } @else if (item.value(); as it) {
            <div class="fade-up">
              <div class="flex flex-wrap items-center gap-2">
                <h1 class="text-3xl font-bold tracking-tight">{{ name() }}</h1>
                <a [href]="'/#c-' + name()" class="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground">
                  <signng-icon name="external-link" [size]="12" /> View live
                </a>
              </div>
              <p class="mt-2 max-w-2xl text-muted-foreground">{{ it.description }}</p>

              <div class="mt-5 flex flex-wrap items-center gap-3">
                <code class="rounded-lg border border-[#27272a] bg-[#18181b] px-4 py-2.5 font-mono text-sm text-[#e4e4e7]"><span class="text-[#6a9955]">$</span> pnpm signng add {{ registryName() }}</code>
                <button
                  type="button"
                  (click)="copyInstall()"
                  [class]="'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm transition-colors ' + (copiedInstall() ? 'border-primary text-primary' : 'border-border hover:bg-accent')"
                >
                  <signng-icon [name]="copiedInstall() ? 'check' : 'copy'" [size]="14" />
                  {{ copiedInstall() ? 'Copied' : 'Copy' }}
                </button>
              </div>

              @if (it.dependencies?.length || it.registryDependencies?.length) {
                <div class="mt-4 flex flex-wrap gap-1.5">
                  @for (d of it.dependencies ?? []; track d) { <span class="rounded-full bg-muted px-2.5 py-0.5 text-xs">{{ d }}</span> }
                  @for (d of it.registryDependencies ?? []; track d) { <span class="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">{{ d }}</span> }
                </div>
              }

              <div class="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <signng-icon name="lock" [size]="12" />
                <span class="font-mono">{{ it.integrity.slice(0, 24) }}…</span> — ed25519-signed, verified before write
              </div>

              <h2 class="mb-2 mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Source</h2>
              <signng-code [code]="it.files[0].content" />
            </div>
          } @else {
            <p class="text-muted-foreground">Couldn't load "{{ name() }}" from the registry — it may not be published yet.</p>
          }
        </main>
      </div>
    </div>
  `,
})
export class DocsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);
  protected readonly CATS = CATS;
  protected readonly DEMOS = DEMOS;

  private readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
  protected readonly name = computed(() => this.params().get('name') ?? '');
  protected readonly registryName = computed(() => (this.name() ? registryItemFor(this.name()) : ''));

  protected readonly item = resource<RegistryItem | null, string>({
    params: () => this.name(),
    loader: ({ params }) => (params ? fetchRegistryItem(params) : Promise.resolve(null)),
  });

  protected demosIn(cat: string) {
    return this.DEMOS.filter((d) => d.cat === cat);
  }

  protected readonly copiedInstall = signal(false);
  protected copyInstall(): void {
    const cmd = `pnpm signng add ${this.registryName()}`;
    navigator.clipboard?.writeText(cmd);
    this.copiedInstall.set(true);
    setTimeout(() => this.copiedInstall.set(false), 1500);
    this.toast.success('Copied', cmd);
  }
}
