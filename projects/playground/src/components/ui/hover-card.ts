import { ChangeDetectionStrategy, Component, OnDestroy, inject, input, signal } from '@angular/core';
import { _IdGenerator } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, CdkOverlayOrigin, type ConnectedPosition } from '@angular/cdk/overlay';

/**
 * Styled HoverCard (helm) — supplementary card shown on hover/focus of the trigger (CDK connected
 * overlay). A short cancellable close-delay bridges the trigger→card gap so the pointer can land on
 * the card without it detaching (WCAG 1.4.13 "Hoverable"); Escape dismisses. The trigger references
 * the card via aria-describedby while open. Project `[hoverCardTrigger]` and `[hoverCardContent]`.
 * Requires the `overlay` registry item.
 */
@Component({
  selector: 'signng-hover-card',
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
      <ng-content select="[hoverCardTrigger]" />
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
        role="dialog"
        [attr.aria-label]="label() || 'Más información'"
        (mouseenter)="show()"
        (mouseleave)="scheduleHide()"
        class="z-50 w-64 rounded-md border border-border bg-popover p-4 text-sm text-popover-foreground shadow-md outline-none"
      >
        <ng-content select="[hoverCardContent]" />
      </div>
    </ng-template>
  `,
})
export class HoverCard implements OnDestroy {
  readonly label = input('');

  protected readonly id = inject(_IdGenerator).getId('signng-hovercard-');
  protected readonly open = signal(false);
  private timer: ReturnType<typeof setTimeout> | undefined;

  protected show(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = undefined;
    this.open.set(true);
  }
  protected scheduleHide(): void {
    if (typeof setTimeout === 'undefined') return;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.open.set(false), 150);
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
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 8 },
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -8 },
  ];
}
