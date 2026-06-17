import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, CdkOverlayOrigin, type ConnectedPosition } from '@angular/cdk/overlay';
import { Button } from '@/components/ui/button';

/**
 * Styled Popover (helm) — click-triggered overlay via CDK connected overlay.
 * cdkTrapFocus + auto-capture moves focus into the panel on open and restores it to the trigger
 * on close. Dismisses on outside click (transparent backdrop) and Escape (document listener, so it
 * works regardless of focus). role=dialog + aria-label name the panel. Requires the `overlay`
 * registry item. SSR-safe (overlay only on click).
 */
@Component({
  selector: 'signng-popover',
  imports: [CdkConnectedOverlay, CdkOverlayOrigin, CdkTrapFocus, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onEscape()',
  },
  template: `
    <button
      signngButton
      variant="outline"
      cdkOverlayOrigin
      #origin="cdkOverlayOrigin"
      aria-haspopup="dialog"
      [attr.aria-expanded]="open()"
      (click)="open.set(!open())"
    >
      {{ triggerLabel() }}
    </button>
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="open()"
      [cdkConnectedOverlayPositions]="positions"
      [cdkConnectedOverlayHasBackdrop]="true"
      cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
      [cdkConnectedOverlayPush]="true"
      (backdropClick)="open.set(false)"
    >
      <div
        cdkTrapFocus
        [cdkTrapFocusAutoCapture]="true"
        role="dialog"
        tabindex="-1"
        [attr.aria-label]="label() || null"
        class="z-50 w-72 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none"
      >
        <ng-content />
      </div>
    </ng-template>
  `,
})
export class Popover {
  readonly triggerLabel = input('Open');
  readonly label = input('Popover');
  readonly open = signal(false);

  protected onEscape(): void {
    if (this.open()) this.open.set(false);
  }

  protected readonly positions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 6 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -6 },
  ];
}
