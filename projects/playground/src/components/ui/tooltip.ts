import { ChangeDetectionStrategy, Component, OnDestroy, inject, input, signal } from '@angular/core';
import { _IdGenerator } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, CdkOverlayOrigin, type ConnectedPosition } from '@angular/cdk/overlay';

/**
 * Styled Tooltip (helm) composed from @angular/cdk/overlay's declarative connected overlay.
 * Shows on hover/focus, hides on leave/blur/Escape. A short cancellable close-delay bridges the gap
 * between trigger and bubble so the pointer can land on the bubble without it detaching (WCAG 1.4.13
 * "Hoverable"). The bubble has a stable id; the trigger references it via aria-describedby while open.
 * Overlay opens only on interaction → SSR-safe.
 */
@Component({
  selector: 'signng-tooltip',
  imports: [CdkConnectedOverlay, CdkOverlayOrigin],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'hide()',
  },
  template: `
    <span
      cdkOverlayOrigin
      #origin="cdkOverlayOrigin"
      class="inline-flex"
      [attr.aria-describedby]="open() ? id : null"
      (mouseenter)="show()"
      (mouseleave)="scheduleHide()"
      (focusin)="show()"
      (focusout)="scheduleHide()"
    >
      <ng-content />
    </span>
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="open()"
      [cdkConnectedOverlayPositions]="positions"
      [cdkConnectedOverlayPush]="true"
    >
      <div
        [id]="id"
        role="tooltip"
        (mouseenter)="show()"
        (mouseleave)="scheduleHide()"
        class="z-50 max-w-xs rounded-md bg-foreground px-3 py-1.5 text-xs text-background shadow-md"
      >
        {{ text() }}
      </div>
    </ng-template>
  `,
})
export class Tooltip implements OnDestroy {
  readonly text = input('');

  protected readonly id = inject(_IdGenerator).getId('signng-tooltip-');
  protected readonly open = signal(false);
  private timer: ReturnType<typeof setTimeout> | undefined;

  protected show(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = undefined;
    this.open.set(true);
  }
  /** Defer the close so the pointer can cross the trigger→bubble gap (cancelled by show()). */
  protected scheduleHide(): void {
    if (typeof setTimeout === 'undefined') return;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.open.set(false), 120);
  }
  protected hide(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = undefined;
    this.open.set(false);
  }
  ngOnDestroy(): void {
    if (this.timer) clearTimeout(this.timer);
  }

  protected readonly positions: ConnectedPosition[] = [
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -6 },
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 6 },
  ];
}
