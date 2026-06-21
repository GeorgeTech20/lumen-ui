import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';

export interface TransferItem {
  value: string;
  label: string;
}

/**
 * Transfer (helm) — a dual-list "shuttle": check items in the source/target panels and move them across
 * with the ›/‹ buttons. `selected` is a two-way `string[]` model holding the values currently on the
 * RIGHT panel; everything else stays on the left. Signals-only, OnPush, no deps.
 */
@Component({
  selector: 'signng-transfer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="flex items-stretch gap-3">
      <div class="flex w-44 flex-col rounded-lg border border-border">
        <div class="border-b border-border px-3 py-2 text-sm font-medium">{{ titles()[0] }} <span class="text-muted-foreground">({{ source().length }})</span></div>
        <ul class="flex-1 overflow-auto p-1" role="listbox" aria-multiselectable="true" [attr.aria-label]="titles()[0]">
          @for (it of source(); track it.value) {
            <li role="option" [attr.aria-selected]="lChecked().has(it.value)" (click)="toggle('l', it.value)" class="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent">
              <input type="checkbox" [checked]="lChecked().has(it.value)" tabindex="-1" aria-hidden="true" class="pointer-events-none size-4 accent-[var(--color-primary)]" />
              {{ it.label }}
            </li>
          } @empty { <li class="px-2 py-5 text-center text-sm text-muted-foreground">—</li> }
        </ul>
      </div>

      <div class="flex flex-col justify-center gap-2">
        <button type="button" (click)="moveRight()" [disabled]="!lChecked().size" aria-label="Mover a seleccionados" [class]="btn">›</button>
        <button type="button" (click)="moveLeft()" [disabled]="!rChecked().size" aria-label="Quitar de seleccionados" [class]="btn">‹</button>
      </div>

      <div class="flex w-44 flex-col rounded-lg border border-border">
        <div class="border-b border-border px-3 py-2 text-sm font-medium">{{ titles()[1] }} <span class="text-muted-foreground">({{ target().length }})</span></div>
        <ul class="flex-1 overflow-auto p-1" role="listbox" aria-multiselectable="true" [attr.aria-label]="titles()[1]">
          @for (it of target(); track it.value) {
            <li role="option" [attr.aria-selected]="rChecked().has(it.value)" (click)="toggle('r', it.value)" class="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent">
              <input type="checkbox" [checked]="rChecked().has(it.value)" tabindex="-1" aria-hidden="true" class="pointer-events-none size-4 accent-[var(--color-primary)]" />
              {{ it.label }}
            </li>
          } @empty { <li class="px-2 py-5 text-center text-sm text-muted-foreground">—</li> }
        </ul>
      </div>
    </div>
  `,
})
export class Transfer {
  readonly items = input<TransferItem[]>([]);
  readonly selected = model<string[]>([]);
  readonly titles = input<[string, string]>(['Disponibles', 'Seleccionados']);

  protected readonly btn =
    'inline-flex size-8 items-center justify-center rounded-md border border-border text-base hover:bg-accent disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';
  protected readonly lChecked = signal<Set<string>>(new Set());
  protected readonly rChecked = signal<Set<string>>(new Set());

  protected readonly source = computed(() => {
    const sel = new Set(this.selected());
    return this.items().filter((i) => !sel.has(i.value));
  });
  protected readonly target = computed(() => {
    const sel = new Set(this.selected());
    return this.items().filter((i) => sel.has(i.value));
  });

  protected toggle(side: 'l' | 'r', v: string): void {
    const sig = side === 'l' ? this.lChecked : this.rChecked;
    const next = new Set(sig());
    next.has(v) ? next.delete(v) : next.add(v);
    sig.set(next);
  }
  protected moveRight(): void {
    this.selected.set([...this.selected(), ...this.lChecked()]);
    this.lChecked.set(new Set());
  }
  protected moveLeft(): void {
    const rem = this.rChecked();
    this.selected.set(this.selected().filter((v) => !rem.has(v)));
    this.rChecked.set(new Set());
  }
}
