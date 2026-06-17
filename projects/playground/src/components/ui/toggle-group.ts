import {
  Directive,
  ElementRef,
  booleanAttribute,
  computed,
  contentChildren,
  forwardRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { cn } from '@/lib/utils';
import { toggleVariants } from '@/components/ui/toggle';

/**
 * ToggleGroup (helm compound) — a roving-tabindex group of toggle buttons, single or multiple
 * selection. role=group; one tab stop, Arrow keys roam (APG toolbar), Space/Enter (native button)
 * toggles. forwardRef breaks the item<->group DI cycle. Value is always a string[] (single = 0/1).
 */
@Directive({
  selector: 'button[signngToggleItem]',
  host: {
    type: 'button',
    '[attr.aria-pressed]': 'selected()',
    '[attr.data-state]': 'selected() ? "on" : "off"',
    '[attr.tabindex]': 'tabindex()',
    '[disabled]': 'isDisabled() ? true : null',
    '[class]': 'cls()',
    '(click)': 'toggle()',
  },
})
export class SignngToggleItem {
  private readonly group = inject<SignngToggleGroup>(forwardRef(() => SignngToggleGroup));
  private readonly host = inject<ElementRef<HTMLButtonElement>>(ElementRef);

  readonly value = input.required<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly variant = input<'default' | 'outline'>('outline');
  readonly size = input<'default' | 'sm' | 'lg'>('default');
  readonly class = input('');

  readonly selected = computed(() => this.group.isSelected(this.value()));
  readonly isDisabled = computed(() => this.group.disabled() || this.disabled());
  readonly tabindex = computed(() => {
    if (this.isDisabled()) return -1;
    return this.group.tabbableValue() === this.value() ? 0 : -1;
  });

  protected readonly cls = computed(() =>
    cn(toggleVariants({ variant: this.variant(), size: this.size() }), this.class()),
  );

  toggle(): void {
    if (this.isDisabled()) return;
    this.group.toggle(this.value());
    this.group.setFocused(this.value());
  }
  focus(): void {
    this.host.nativeElement.focus();
  }
}

@Directive({
  selector: '[signngToggleGroup]',
  host: {
    role: 'group',
    class: 'inline-flex gap-1',
    '(keydown)': 'onKeydown($event)',
  },
})
export class SignngToggleGroup {
  /** Selected values (single-select still uses an array of 0 or 1). */
  readonly value = model<string[]>([]);
  readonly type = input<'single' | 'multiple'>('single');
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly items = contentChildren(SignngToggleItem);
  private readonly focused = signal<string | null>(null);

  readonly tabbableValue = computed(() => {
    const f = this.focused();
    const enabled = this.items().filter((i) => !i.isDisabled());
    if (f && enabled.some((i) => i.value() === f)) return f;
    return enabled[0]?.value() ?? null;
  });

  isSelected(v: string): boolean {
    return this.value().includes(v);
  }

  toggle(v: string): void {
    const cur = this.value();
    if (this.type() === 'single') {
      this.value.set(cur.includes(v) ? [] : [v]);
    } else {
      this.value.set(cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]);
    }
  }

  setFocused(v: string): void {
    this.focused.set(v);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const enabled = this.items().filter((i) => !i.isDisabled());
    if (!enabled.length) return;
    const cur = Math.max(0, enabled.findIndex((i) => i.value() === this.tabbableValue()));
    let target: SignngToggleItem | undefined;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        target = enabled[(cur + 1) % enabled.length];
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        target = enabled[(cur - 1 + enabled.length) % enabled.length];
        break;
      case 'Home':
        target = enabled[0];
        break;
      case 'End':
        target = enabled[enabled.length - 1];
        break;
      default:
        return;
    }
    event.preventDefault();
    this.setFocused(target.value());
    target.focus();
  }
}

export const SIGNNG_TOGGLE_GROUP = [SignngToggleGroup, SignngToggleItem] as const;
