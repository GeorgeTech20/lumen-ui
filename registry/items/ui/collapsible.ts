import { ChangeDetectionStrategy, Component, inject, input, model } from '@angular/core';
import { _IdGenerator } from '@angular/cdk/a11y';
import { cn } from '@/lib/utils';

/**
 * Styled Collapsible (helm) — a single disclosure (trigger + lazily-rendered region). The trigger is
 * a native button with aria-expanded + aria-controls; the region is rendered only while open.
 */
@Component({
  selector: 'signng-collapsible',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      [attr.aria-expanded]="open()"
      [attr.aria-controls]="contentId"
      (click)="open.update((v) => !v)"
      [class]="
        cn(
          'group flex w-full items-center justify-between rounded-md px-1 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          triggerClass()
        )
      "
    >
      {{ triggerLabel() }}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        class="size-4 shrink-0 transition-transform group-aria-expanded:rotate-180"
        aria-hidden="true"
      >
        <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    @if (open()) {
      <div [id]="contentId" class="px-1 pb-2 pt-1 text-sm">
        <ng-content />
      </div>
    }
  `,
})
export class Collapsible {
  readonly open = model(false);
  readonly triggerLabel = input('');
  readonly triggerClass = input('');

  protected readonly cn = cn;
  protected readonly contentId = inject(_IdGenerator).getId('signng-collapsible-');
}
