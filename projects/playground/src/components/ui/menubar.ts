import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { _IdGenerator } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, CdkOverlayOrigin, type ConnectedPosition } from '@angular/cdk/overlay';
import { Menu, MenuItem } from '@angular/aria/menu';

export interface MenubarMenu {
  label: string;
  items: { value: string; label: string; disabled?: boolean }[];
}

/**
 * Styled Menubar (helm) — a role=menubar of menu buttons, each opening an @angular/aria Menu in a CDK
 * overlay (the proven dropdown pattern). Roving tabindex across the bar; ArrowLeft/Right roam (and move
 * the open menu when one is open), ArrowDown/Enter open, Escape closes to the button. Choosing an item
 * emits `selected` ({ menu, value }). Requires the `overlay` registry item.
 */
@Component({
  selector: 'signng-menubar',
  imports: [CdkConnectedOverlay, CdkOverlayOrigin, Menu, MenuItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'menubar',
    '(document:keydown.escape)': 'closeAll()',
    class: 'inline-flex items-center gap-1 rounded-md border border-border bg-background p-1',
  },
  template: `
    @for (menu of menus(); track menu.label; let i = $index) {
      <button
        #btn
        cdkOverlayOrigin
        #origin="cdkOverlayOrigin"
        type="button"
        role="menuitem"
        aria-haspopup="menu"
        [attr.aria-expanded]="openIndex() === i"
        [attr.aria-controls]="openIndex() === i ? menuId(i) : null"
        [attr.tabindex]="focusedIndex() === i ? 0 : -1"
        (click)="toggle(i)"
        (keydown)="onTriggerKeydown($event, i)"
        class="rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring aria-expanded:bg-accent aria-expanded:text-accent-foreground hover:bg-accent"
      >
        {{ menu.label }}
      </button>
      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="origin"
        [cdkConnectedOverlayOpen]="openIndex() === i"
        [cdkConnectedOverlayPositions]="positions"
        [cdkConnectedOverlayHasBackdrop]="true"
        cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
        [cdkConnectedOverlayPush]="true"
        (attach)="onAttach(i)"
        (backdropClick)="closeAll()"
      >
        <div
          ngMenu
          [id]="menuId(i)"
          [attr.aria-label]="menu.label"
          (itemSelected)="onSelect(menu.label, $event)"
          class="z-50 min-w-44 overflow-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none"
        >
          @for (item of menu.items; track item.value) {
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
    }
  `,
})
export class Menubar {
  readonly menus = input<MenubarMenu[]>([]);
  readonly selected = output<{ menu: string; value: string }>();

  protected readonly openIndex = signal(-1);
  protected readonly focusedIndex = signal(0);
  private readonly gridId = inject(_IdGenerator).getId('signng-menubar-');
  private readonly buttons = viewChildren<ElementRef<HTMLButtonElement>>('btn');

  protected menuId(i: number): string {
    return `${this.gridId}-${i}`;
  }

  protected toggle(i: number): void {
    this.focusedIndex.set(i);
    this.openIndex.update((cur) => (cur === i ? -1 : i));
  }

  protected closeAll(): void {
    if (this.openIndex() === -1) return;
    const i = this.focusedIndex();
    this.openIndex.set(-1);
    this.buttons()[i]?.nativeElement.focus();
  }

  protected onTriggerKeydown(event: KeyboardEvent, i: number): void {
    const n = this.menus().length;
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        this.move((i + 1) % n);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.move((i - 1 + n) % n);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.openIndex.set(i); // onAttach moves focus into the menu
        break;
      case 'Home':
        event.preventDefault();
        this.move(0);
        break;
      case 'End':
        event.preventDefault();
        this.move(n - 1);
        break;
    }
  }

  /** Move the roving focus to bar item j; if a menu was open, open j's menu instead (menubar behaviour). */
  private move(j: number): void {
    const wasOpen = this.openIndex() !== -1;
    this.focusedIndex.set(j);
    if (wasOpen) this.openIndex.set(j);
    else this.buttons()[j]?.nativeElement.focus();
  }

  protected onAttach(i: number): void {
    queueMicrotask(() => {
      const menu = document.getElementById(this.menuId(i));
      const first = menu?.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])');
      (first ?? menu)?.focus();
    });
  }

  protected onSelect(menu: string, value: string): void {
    this.selected.emit({ menu, value });
    this.closeAll();
  }

  protected readonly positions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
  ];
}
