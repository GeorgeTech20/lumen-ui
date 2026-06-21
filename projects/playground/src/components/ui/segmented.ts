import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

export interface SegmentOption {
  value: string;
  label: string;
}

/**
 * Segmented (helm) — an iOS-style segmented control: a row of options with a sliding pill indicator that
 * animates to the active one. role=radiogroup with role=radio + aria-checked per option; Arrow keys move
 * selection (under prefers-reduced-motion the slide is dropped by the browser). `value` is a two-way model.
 * Signals-only, OnPush, no deps.
 */
@Component({
  selector: 'signng-segmented',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-block' },
  template: `
    <div
      role="radiogroup"
      [attr.aria-label]="ariaLabel() || null"
      (keydown)="onKey($event)"
      class="relative inline-flex rounded-lg bg-muted p-1 text-sm"
    >
      @if (activeIndex() >= 0) {
        <div
          class="absolute bottom-1 top-1 rounded-md bg-background shadow-sm transition-all duration-200 motion-reduce:transition-none"
          [style.left]="'calc(' + activeIndex() * unit() + '% + 4px)'"
          [style.width]="'calc(' + unit() + '% - 8px)'"
        ></div>
      }
      @for (opt of options(); track opt.value) {
        <button
          type="button"
          role="radio"
          [attr.aria-checked]="opt.value === value()"
          (click)="value.set(opt.value)"
          [class]="
            'relative z-10 flex-1 whitespace-nowrap rounded-md px-3 py-1.5 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ' +
            (opt.value === value() ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')
          "
        >
          {{ opt.label }}
        </button>
      }
    </div>
  `,
})
export class Segmented {
  readonly options = input<SegmentOption[]>([]);
  readonly value = model<string>('');
  readonly ariaLabel = input('');

  protected readonly activeIndex = computed(() => this.options().findIndex((o) => o.value === this.value()));
  protected unit(): number {
    const n = this.options().length;
    return n ? 100 / n : 0;
  }
  protected onKey(e: KeyboardEvent): void {
    const opts = this.options();
    if (!opts.length) return;
    const i = Math.max(0, this.activeIndex());
    let n = i;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % opts.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + opts.length) % opts.length;
    else return;
    e.preventDefault();
    this.value.set(opts[n].value);
  }
}
