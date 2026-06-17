import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { _IdGenerator } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, CdkOverlayOrigin, type ConnectedPosition } from '@angular/cdk/overlay';

/**
 * Styled HoverCard (helm) — supplementary card shown on hover/focus of the trigger (CDK connected
 * overlay). Hoverable (the card stays open while the pointer is over it; WCAG 1.4.13) and Escape-
 * dismissable. The trigger references the card via aria-describedby while open.
 * Project `[hoverCardTrigger]` and `[hoverCardContent]`. Requires the `overlay` registry item.
 */
@Component({
  selector: 'signng-hover-card',
  imports: [CdkConnectedOverlay, CdkOverlayOrigin],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'dismiss()',
  },
  template: `
    <span
      cdkOverlayOrigin
      #origin="cdkOverlayOrigin"
      class="inline-flex"
      [attr.aria-describedby]="open() ? id : null"
      (mouseenter)="triggerHovered.set(true)"
      (mouseleave)="triggerHovered.set(false)"
      (focusin)="focused.set(true)"
      (focusout)="focused.set(false)"
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
        (mouseenter)="cardHovered.set(true)"
        (mouseleave)="cardHovered.set(false)"
        class="z-50 w-64 rounded-md border border-border bg-popover p-4 text-sm text-popover-foreground shadow-md outline-none"
      >
        <ng-content select="[hoverCardContent]" />
      </div>
    </ng-template>
  `,
})
export class HoverCard {
  readonly label = input('');

  protected readonly id = inject(_IdGenerator).getId('signng-hovercard-');
  protected readonly triggerHovered = signal(false);
  protected readonly cardHovered = signal(false);
  protected readonly focused = signal(false);
  protected readonly open = computed(() => this.triggerHovered() || this.cardHovered() || this.focused());

  protected dismiss(): void {
    this.triggerHovered.set(false);
    this.cardHovered.set(false);
    this.focused.set(false);
  }

  protected readonly positions: ConnectedPosition[] = [
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 8 },
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -8 },
  ];
}
