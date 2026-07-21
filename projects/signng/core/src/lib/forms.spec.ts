import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SignngSwitch } from '../../switch/src/switch';
import { SignngCheckbox } from '../../checkbox/src/checkbox';

// Verifies the three review fixes from Fase 1B at the primitive level.

@Component({
  imports: [SignngSwitch],
  template: `<button signngSwitch [(checked)]="checked" [disabled]="disabled()" aria-label="s"></button>`,
})
class SwitchHost {
  readonly checked = signal(false);
  readonly disabled = signal(false);
}

@Component({
  imports: [SignngCheckbox],
  template: `<button signngCheckbox [(checked)]="checked" [(indeterminate)]="indeterminate" aria-label="c"></button>`,
})
class CheckboxHost {
  readonly checked = signal(false);
  readonly indeterminate = signal(true);
}

describe('SignngSwitch (Fase 1B)', () => {
  it('toggles aria-checked on click when enabled', async () => {
    const f = TestBed.createComponent(SwitchHost);
    await f.whenStable();
    const btn = f.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.getAttribute('role')).toBe('switch');
    expect(btn.getAttribute('aria-checked')).toBe('false');
    btn.click();
    f.detectChanges();
    expect(btn.getAttribute('aria-checked')).toBe('true');
  });

  it('soft-disable: aria-disabled set, tabindex -1, click no-ops (review BLOCKER fix)', async () => {
    const f = TestBed.createComponent(SwitchHost);
    f.componentInstance.disabled.set(true);
    await f.whenStable();
    const btn = f.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.getAttribute('aria-disabled')).toBe('true');
    expect(btn.getAttribute('tabindex')).toBe('-1');
    btn.click();
    f.detectChanges();
    expect(btn.getAttribute('aria-checked')).toBe('false'); // unchanged
  });
});

describe('SignngCheckbox (Fase 1B)', () => {
  it('resolves "mixed" -> checked on activation (review HIGH fix)', async () => {
    const f = TestBed.createComponent(CheckboxHost);
    await f.whenStable();
    const btn = f.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.getAttribute('aria-checked')).toBe('mixed');
    btn.click();
    f.detectChanges();
    expect(btn.getAttribute('aria-checked')).toBe('true');
    expect(f.componentInstance.indeterminate()).toBe(false);
    expect(f.componentInstance.checked()).toBe(true);
  });
});
