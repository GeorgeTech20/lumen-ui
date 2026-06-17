import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface ChartDatum {
  label: string;
  value: number;
  color?: string;
}

// Minimal themed palette (oklch). Per-datum `color` overrides.
const PALETTE = [
  'var(--color-primary)',
  'oklch(0.7 0.15 200)',
  'oklch(0.75 0.15 145)',
  'oklch(0.8 0.13 85)',
  'oklch(0.65 0.2 25)',
  'var(--color-muted-foreground)',
];
const fmt = (n: number) => (Math.round(n * 10) / 10).toString();
const summarize = (kind: string, data: ChartDatum[]) =>
  `${kind}: ${data.map((d) => `${d.label} ${fmt(d.value)}`).join(', ')}`;

/** Minimal bar chart (pure SVG, signals). role=img with a data summary. */
@Component({
  selector: 'signng-bar-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <svg viewBox="0 0 100 60" class="h-auto w-full overflow-visible" role="img" [attr.aria-label]="summary()">
      <title>{{ summary() }}</title>
      @for (b of bars(); track b.label) {
        <rect [attr.x]="b.x" [attr.y]="b.y" [attr.width]="b.w" [attr.height]="b.h" [attr.fill]="b.color" rx="1.2" />
        <text [attr.x]="b.cx" y="58" text-anchor="middle" font-size="3" fill="var(--color-muted-foreground)">{{ b.label }}</text>
      }
    </svg>
  `,
})
export class BarChart {
  readonly data = input<ChartDatum[]>([]);
  protected readonly summary = computed(() => summarize('Gráfico de barras', this.data()));
  protected readonly bars = computed(() => {
    const d = this.data();
    const max = Math.max(1, ...d.map((x) => x.value));
    const n = Math.max(1, d.length);
    const gap = 2;
    const w = (100 - gap * (n - 1)) / n;
    const chartH = 50;
    return d.map((x, i) => {
      const h = Math.max(0, (x.value / max) * chartH);
      const px = i * (w + gap);
      return { label: x.label, x: px, y: chartH - h, w, h, cx: px + w / 2, color: x.color ?? PALETTE[0] };
    });
  });
}

/** Minimal line chart (pure SVG). Optional soft area fill. */
@Component({
  selector: 'signng-line-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <svg viewBox="0 0 100 60" class="h-auto w-full overflow-visible" role="img" [attr.aria-label]="summary()">
      <title>{{ summary() }}</title>
      @if (area()) {
        <path [attr.d]="areaPath()" fill="var(--color-primary)" fill-opacity="0.12" />
      }
      <path [attr.d]="linePath()" fill="none" stroke="var(--color-primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      @for (p of points(); track p.i) {
        <circle [attr.cx]="p.x" [attr.cy]="p.y" r="1.4" fill="var(--color-primary)" />
        <text [attr.x]="p.x" y="58" text-anchor="middle" font-size="3" fill="var(--color-muted-foreground)">{{ p.label }}</text>
      }
    </svg>
  `,
})
export class LineChart {
  readonly data = input<ChartDatum[]>([]);
  readonly area = input(true);
  protected readonly summary = computed(() => summarize('Gráfico de líneas', this.data()));
  protected readonly points = computed(() => {
    const d = this.data();
    const max = Math.max(1, ...d.map((x) => x.value));
    const n = Math.max(1, d.length);
    const chartH = 50;
    return d.map((x, i) => ({
      i,
      label: x.label,
      x: n === 1 ? 50 : (i / (n - 1)) * 100,
      y: chartH - (x.value / max) * chartH,
    }));
  });
  protected readonly linePath = computed(() =>
    this.points().map((p, i) => `${i ? 'L' : 'M'} ${fmt(p.x)} ${fmt(p.y)}`).join(' '),
  );
  protected readonly areaPath = computed(() => {
    const pts = this.points();
    if (!pts.length) return '';
    return `${this.linePath()} L ${fmt(pts[pts.length - 1].x)} 50 L ${fmt(pts[0].x)} 50 Z`;
  });
}

/** Minimal donut / circle chart (pure SVG via stroke-dasharray). Legend below. */
@Component({
  selector: 'signng-donut-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="flex items-center gap-4">
      <svg viewBox="0 0 42 42" class="h-28 w-28 -rotate-90" role="img" [attr.aria-label]="summary()">
        <title>{{ summary() }}</title>
        <circle cx="21" cy="21" r="15.915" fill="none" stroke="var(--color-muted)" stroke-width="5" />
        @for (s of slices(); track s.label) {
          <circle
            cx="21" cy="21" r="15.915" fill="none"
            [attr.stroke]="s.color" stroke-width="5" stroke-linecap="round"
            [attr.stroke-dasharray]="s.dash" [attr.stroke-dashoffset]="s.offset"
          />
        }
      </svg>
      <ul class="space-y-1 text-sm">
        @for (s of slices(); track s.label) {
          <li class="flex items-center gap-2">
            <span class="size-2.5 rounded-full" [style.background]="s.color"></span>
            <span>{{ s.label }}</span>
            <span class="text-muted-foreground">{{ s.pct }}%</span>
          </li>
        }
      </ul>
    </div>
  `,
})
export class DonutChart {
  readonly data = input<ChartDatum[]>([]);
  protected readonly summary = computed(() => summarize('Gráfico circular', this.data()));
  protected readonly slices = computed(() => {
    const d = this.data();
    const total = Math.max(1, d.reduce((a, x) => a + x.value, 0));
    const circ = 100; // r=15.915 → circumference ≈ 100
    let acc = 0;
    return d.map((x, i) => {
      const frac = x.value / total;
      const len = frac * circ;
      const offset = -acc * circ;
      acc += frac;
      return {
        label: x.label,
        color: x.color ?? PALETTE[i % PALETTE.length],
        dash: `${fmt(len)} ${fmt(circ - len)}`,
        offset: fmt(offset),
        pct: Math.round(frac * 100),
      };
    });
  });
}

/** Minimal sparkline (tiny inline line, no axis). */
@Component({
  selector: 'signng-sparkline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-block' },
  template: `
    <svg viewBox="0 0 100 30" class="h-6 w-24" [attr.aria-label]="label() || null" [attr.role]="label() ? 'img' : null" [attr.aria-hidden]="label() ? null : 'true'">
      <path [attr.d]="path()" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,
})
export class Sparkline {
  readonly values = input<number[]>([]);
  readonly label = input('');
  protected readonly path = computed(() => {
    const v = this.values();
    if (!v.length) return '';
    const max = Math.max(...v);
    const min = Math.min(...v);
    const span = max - min || 1;
    const n = v.length;
    return v
      .map((y, i) => `${i ? 'L' : 'M'} ${fmt(n === 1 ? 50 : (i / (n - 1)) * 100)} ${fmt(28 - ((y - min) / span) * 26)}`)
      .join(' ');
  });
}

export const SIGNNG_CHART = [BarChart, LineChart, DonutChart, Sparkline] as const;
