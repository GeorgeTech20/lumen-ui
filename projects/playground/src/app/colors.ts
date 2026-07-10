import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { PRESETS } from './theme-customizer';
import { generateScale } from './color-scale';
import { ToastService } from '@/components/ui/toast';

const GROUPS = [
  { range: '1–2', label: 'Backgrounds' },
  { range: '3–5', label: 'Component bg / border / hover' },
  { range: '6–8', label: 'Borders / separators' },
  { range: '9–10', label: 'Solid / accent' },
  { range: '11–12', label: 'Accessible text' },
];

const HEX_RE = /^#?[0-9a-fA-F]{6}$/;

/**
 * Custom palette creator (Radix /colors/custom pattern): pick an accent + gray from hex/native
 * color inputs, preview both 12-step OKLCH scales in light or dark ramps, copy the whole thing
 * as CSS variables, or apply the accent as the live brand color. Preset scales below for reference.
 */
@Component({
  selector: 'signng-colors-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Button],
  template: `
    <div class="min-h-screen bg-background text-foreground">
      <main class="mx-auto max-w-5xl px-4 py-10">
        <!-- Centered hero -->
        <div class="fade-up mx-auto max-w-2xl text-center">
          <h1 class="text-4xl font-bold tracking-tight">Crea tu <span class="text-primary">paleta a medida</span></h1>
          <p class="mt-3 text-muted-foreground">
            Un color de marca + un gris → dos escalas de 12 pasos en OKLCH, listas para copiar como
            variables CSS o aplicar en vivo a toda la librería. Sin saber programar.
          </p>
          <div class="mt-5 inline-flex rounded-md bg-muted p-0.5 text-sm" role="radiogroup" aria-label="Modo de la escala">
            <button role="radio" [attr.aria-checked]="scaleMode() === 'light'" (click)="scaleMode.set('light')" [class]="'rounded px-3 py-1 ' + (scaleMode() === 'light' ? 'bg-background shadow-sm' : 'text-muted-foreground')">☀ Light</button>
            <button role="radio" [attr.aria-checked]="scaleMode() === 'dark'" (click)="scaleMode.set('dark')" [class]="'rounded px-3 py-1 ' + (scaleMode() === 'dark' ? 'bg-background shadow-sm' : 'text-muted-foreground')">🌙 Dark</button>
          </div>
        </div>

        <!-- Inputs: accent + gray + actions -->
        <div class="mt-8 flex flex-wrap items-end justify-center gap-4">
          <div>
            <label for="accent-hex" class="mb-1 block text-xs font-medium text-muted-foreground">Accent</label>
            <div class="flex items-center gap-2 rounded-md border border-border px-2 py-1.5">
              <input type="color" [value]="accent()" (input)="accent.set($any($event.target).value)" aria-label="Elegir accent" class="size-6 cursor-pointer rounded border-0 bg-transparent p-0" />
              <input id="accent-hex" [value]="accent()" (change)="setHex(accent, $any($event.target))" spellcheck="false" class="w-24 bg-transparent font-mono text-sm uppercase focus:outline-none" />
            </div>
          </div>
          <div>
            <label for="gray-hex" class="mb-1 block text-xs font-medium text-muted-foreground">Gray</label>
            <div class="flex items-center gap-2 rounded-md border border-border px-2 py-1.5">
              <input type="color" [value]="gray()" (input)="gray.set($any($event.target).value)" aria-label="Elegir gris" class="size-6 cursor-pointer rounded border-0 bg-transparent p-0" />
              <input id="gray-hex" [value]="gray()" (change)="setHex(gray, $any($event.target))" spellcheck="false" class="w-24 bg-transparent font-mono text-sm uppercase focus:outline-none" />
            </div>
          </div>
          <button signngButton (click)="copyCss()" class="gap-1.5">
            <signng-icon [name]="copied() ? 'check' : 'copy'" [size]="15" /> {{ copied() ? 'Copiado' : 'Copiar CSS' }}
          </button>
          <button signngButton variant="outline" (click)="applyBrand()">Aplicar como marca</button>
        </div>

        <!-- Custom scales -->
        <div class="mt-10 space-y-4">
          <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            @for (g of GROUPS; track g.range) {
              <span><b class="text-foreground">{{ g.range }}</b> {{ g.label }}</span>
            }
          </div>
          @for (row of customRows(); track row.name) {
            <div class="flex items-center gap-3">
              <span class="w-16 shrink-0 text-sm font-medium">{{ row.name }}</span>
              <div class="grid flex-1 grid-cols-12 gap-1">
                @for (step of row.scale; track step.step) {
                  <button
                    type="button"
                    (click)="copy(step.css)"
                    [style.background]="step.css"
                    [attr.aria-label]="row.name + ' step ' + step.step"
                    [title]="step.css"
                    class="h-12 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  ></button>
                }
              </div>
            </div>
          }
        </div>

        <!-- Presets reference -->
        <h2 class="mb-4 mt-14 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Presets</h2>
        <div class="space-y-3">
          @for (preset of presets; track preset.key) {
            <div class="flex items-center gap-3">
              <button type="button" (click)="accent.set(preset.primary)" class="w-16 shrink-0 truncate text-left text-sm font-medium hover:text-primary" [title]="'Usar ' + preset.label + ' como accent'">{{ preset.label }}</button>
              <div class="grid flex-1 grid-cols-12 gap-1">
                @for (step of scaleFor(preset.primary); track step.step) {
                  <button
                    type="button"
                    (click)="copy(step.css)"
                    [style.background]="step.css"
                    [attr.aria-label]="preset.label + ' step ' + step.step"
                    [title]="step.css"
                    class="h-8 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  ></button>
                }
              </div>
            </div>
          }
        </div>
      </main>
    </div>
  `,
})
export class ColorsPage {
  private readonly toast = inject(ToastService);
  protected readonly presets = PRESETS;
  protected readonly GROUPS = GROUPS;

  protected readonly scaleMode = signal<'light' | 'dark'>('light');
  protected readonly accent = signal('#6d4aff');
  protected readonly gray = signal('#8b8d98');
  protected readonly copied = signal(false);

  protected readonly customRows = computed(() => [
    { name: 'Accent', scale: generateScale(this.accent(), this.scaleMode()) },
    { name: 'Gray', scale: generateScale(this.gray(), this.scaleMode()) },
  ]);

  protected scaleFor(hex: string) {
    return generateScale(hex, this.scaleMode());
  }

  protected setHex(target: { set(v: string): void }, input: HTMLInputElement): void {
    const v = input.value.trim();
    if (HEX_RE.test(v)) {
      target.set(v.startsWith('#') ? v : `#${v}`);
    } else {
      this.toast.error('Hex inválido', 'Usa el formato #RRGGBB.');
      input.value = this.accent();
    }
  }

  protected copy(css: string): void {
    navigator.clipboard?.writeText(css);
    this.toast.success('Copiado', css);
  }

  protected copyCss(): void {
    const lines: string[] = [':root {'];
    for (const row of this.customRows()) {
      row.scale.forEach((s) => lines.push(`  --${row.name.toLowerCase()}-${s.step}: ${s.css};`));
    }
    lines.push('}');
    navigator.clipboard?.writeText(lines.join('\n'));
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1500);
    this.toast.success('CSS copiado', '24 variables (accent 1-12 + gray 1-12).');
  }

  protected applyBrand(): void {
    if (typeof document === 'undefined') return;
    const s = document.documentElement.style;
    s.setProperty('--color-primary', this.accent());
    s.setProperty('--color-primary-foreground', '#ffffff');
    s.setProperty('--color-ring', this.accent());
    this.toast.success('Aplicado', `${this.accent()} es ahora el color de marca.`);
  }
}
