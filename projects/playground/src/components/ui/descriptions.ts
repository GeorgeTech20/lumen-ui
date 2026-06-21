import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface DescItem {
  label: string;
  value: string;
}

/**
 * Descriptions (helm) — a labelled key/value detail list (admin "view record" pages). Renders a semantic
 * `<dl>` with `<dt>`/`<dd>` pairs in a configurable column grid; `bordered` boxes it. Column count uses an
 * inline grid-template (so it's Tailwind-purge safe). Presentational, OnPush.
 */
@Component({
  selector: 'signng-descriptions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <dl
      [class]="bordered() ? 'grid gap-x-6 overflow-hidden rounded-lg border border-border' : 'grid gap-x-6 gap-y-1'"
      [style.grid-template-columns]="'repeat(' + columns() + ', minmax(0, 1fr))'"
    >
      @for (it of items(); track $index) {
        <div [class]="bordered() ? 'border-b border-border px-4 py-2.5' : 'py-1'">
          <dt class="text-xs text-muted-foreground">{{ it.label }}</dt>
          <dd class="mt-0.5 text-sm font-medium">{{ it.value }}</dd>
        </div>
      }
    </dl>
  `,
})
export class Descriptions {
  readonly items = input<DescItem[]>([]);
  readonly columns = input(1);
  readonly bordered = input(false);
}
