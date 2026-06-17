import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { _IdGenerator } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, CdkOverlayOrigin, type ConnectedPosition } from '@angular/cdk/overlay';
import { Menu, MenuItem } from '@angular/aria/menu';
import { Button } from '@/components/ui/button';

export interface MenuOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Styled DropdownMenu (helm) — trigger button + CDK overlay hosting @angular/aria's Menu/MenuItem
 * (role=menu/menuitem, arrow-key roving, typeahead inherited). Selection is wired through the menu's
 * `(itemSelected)` output so BOTH mouse and keyboard (Enter/Space) activate items — a per-item
 * `(click)` would miss keyboard, since aria preventDefaults the key event. cdkTrapFocus auto-capture,
 * transparent backdrop outside-click, document Escape; focus returns to the trigger on close.
 * Requires the `overlay` registry item. SSR-safe (overlay only on click).
 */
@Component({
  selector: 'signng-dropdown-menu',
  imports: [CdkConnectedOverlay, CdkOverlayOrigin, Menu, MenuItem, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onEscape()',
  },
  template: `
    <button
      #trigger
      cdkOverlayOrigin
      #origin="cdkOverlayOrigin"
      signngButton
      variant="outline"
      aria-haspopup="menu"
      [attr.aria-expanded]="open()"
      [attr.aria-controls]="open() ? menuId : null"
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
      (attach)="onAttach()"
      (backdropClick)="close()"
    >
      <div
        ngMenu
        [id]="menuId"
        [attr.aria-label]="label() || 'Menu'"
        (itemSelected)="select($event)"
        class="z-50 min-w-48 overflow-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none"
      >
        @for (item of items(); track item.value) {
          <button
            ngMenuItem
            [value]="item.value"
            [disabled]="!!item.disabled"
            class="flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[active]:bg-accent data-[active]:text-accent-foreground aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            {{ item.label }}
          </button>
        }
      </div>
    </ng-template>
  `,
})
export class DropdownMenu {
  readonly items = input<MenuOption[]>([]);
  readonly triggerLabel = input('Open menu');
  readonly label = input('');
  readonly open = signal(false);
  readonly selected = output<string>();

  private readonly trigger = viewChild.required<ElementRef<HTMLElement>>('trigger');
  protected readonly menuId = inject(_IdGenerator).getId('signng-menu-');

  protected select(value: string): void {
    this.selected.emit(value);
    this.close();
  }

  /** On overlay attach, move focus to the first enabled menuitem so keyboard nav works (APG). */
  protected onAttach(): void {
    queueMicrotask(() => {
      const menu = document.getElementById(this.menuId);
      const first = menu?.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])');
      (first ?? menu)?.focus();
    });
  }

  protected close(): void {
    this.open.set(false);
    this.trigger().nativeElement.focus(); // return focus to trigger (APG menu button)
  }

  protected onEscape(): void {
    if (this.open()) this.close();
  }

  protected readonly positions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 6 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -6 },
  ];
}
