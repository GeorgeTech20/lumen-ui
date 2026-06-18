import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CdkTrapFocus, _IdGenerator } from '@angular/cdk/a11y';
import { SignngDialogTrigger } from '@signng/core/dialog';
import { Button } from '@/components/ui/button';

/**
 * Styled Drawer (helm) — a bottom sheet (the @signng/core/dialog trigger with position="bottom").
 * Same modal guarantees as Dialog (focus trap, backdrop, Esc, focus restore); slides up from the
 * bottom with a grab handle, full width, rounded top. Requires the `overlay` registry item.
 */
@Component({
  selector: 'signng-drawer',
  imports: [SignngDialogTrigger, CdkTrapFocus, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button signngButton variant="outline" [signngDialogTrigger]="content" position="bottom">
      {{ triggerLabel() }}
    </button>
    <ng-template #content let-ctx>
      <div
        cdkTrapFocus
        [cdkTrapFocusAutoCapture]="true"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="title() ? titleId : null"
        [attr.aria-label]="title() ? null : 'Panel'"
        [attr.aria-describedby]="description() ? descId : null"
        class="max-h-[90vh] w-screen overflow-auto rounded-t-xl border-t border-border bg-background p-6"
      >
        <div class="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted" aria-hidden="true"></div>
        @if (title()) {
          <h2 [id]="titleId" class="text-lg font-semibold">{{ title() }}</h2>
        }
        @if (description()) {
          <p [id]="descId" class="mt-1 text-sm text-muted-foreground">{{ description() }}</p>
        }
        <div class="mx-auto mt-4 max-w-md text-sm"><ng-content /></div>
        <div class="mx-auto mt-6 flex max-w-md justify-end">
          <button signngButton variant="outline" (click)="ctx.close()">{{ closeLabel() }}</button>
        </div>
      </div>
    </ng-template>
  `,
})
export class Drawer {
  readonly title = input('');
  readonly description = input('');
  readonly triggerLabel = input('Open');
  readonly closeLabel = input('Close');

  protected readonly titleId = inject(_IdGenerator).getId('signng-drawer-title-');
  protected readonly descId = inject(_IdGenerator).getId('signng-drawer-desc-');
}
