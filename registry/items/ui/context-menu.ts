import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { _IdGenerator } from '@angular/cdk/a11y';
import {
  CdkConnectedOverlay,
  type ConnectedPosition,
  type FlexibleConnectedPositionStrategyOrigin,
} from '@angular/cdk/overlay';
import { Menu, MenuItem } from '@angular/aria/menu';

export interface MenuOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Styled ContextMenu (helm) — right-click a projected region to open an @angular/aria Menu at the
 * pointer (CDK overlay connected to the click point). role=menu/menuitem, roving + typeahead inherited.
 * Focus moves to the first item on open; Escape/outside-click dismiss. Requires the `overlay` item.
 */
@Component({
  selector: 'signng-context-menu',
  imports: [CdkConnectedOverlay, Menu, MenuItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(contextmenu)': 'onContext($event)',
    '(document:keydown.escape)': 'onEscape()',
  },
  template: `
    <ng-content />
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin()"
      [cdkConnectedOverlayOpen]="open()"
      [cdkConnectedOverlayPositions]="positions"
      [cdkConnectedOverlayHasBackdrop]="true"
      cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
      [cdkConnectedOverlayPush]="true"
      (attach)="onAttach()"
      (backdropClick)="open.set(false)"
    >
      <div
        ngMenu
        [id]="menuId"
        [attr.aria-label]="label() || 'Menú contextual'"
        (itemSelected)="select($event)"
        class="z-50 min-w-44 overflow-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none"
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
export class ContextMenu {
  readonly items = input<MenuOption[]>([]);
  readonly label = input('');
  readonly selected = output<string>();
  readonly open = signal(false);
  readonly origin = signal<FlexibleConnectedPositionStrategyOrigin>({ x: 0, y: 0 });

  protected readonly menuId = inject(_IdGenerator).getId('signng-context-');

  protected onContext(event: MouseEvent): void {
    event.preventDefault();
    this.origin.set({ x: event.clientX, y: event.clientY });
    this.open.set(true);
  }

  protected select(value: string): void {
    this.selected.emit(value);
    this.open.set(false);
  }

  protected onEscape(): void {
    if (this.open()) this.open.set(false);
  }

  protected onAttach(): void {
    queueMicrotask(() => {
      const menu = document.getElementById(this.menuId);
      const first = menu?.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])');
      (first ?? menu)?.focus();
    });
  }

  protected readonly positions: ConnectedPosition[] = [
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'top' },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'top' },
  ];
}
