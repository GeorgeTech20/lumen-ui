import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SignngRadio, SignngRadioGroup } from '@signng/core/radio-group';

/**
 * Styled RadioGroup (helm) over the @signng/core/radio-group compound primitive.
 * Container: `<signng-radio-group [(value)]="x" aria-labelledby="...">`.
 * Item: `<signng-radio value="a">Label</signng-radio>` — the projected text is the radio's name.
 */
@Component({
  selector: 'signng-radio-group',
  hostDirectives: [
    { directive: SignngRadioGroup, inputs: ['value', 'disabled', 'orientation'], outputs: ['valueChange'] },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'grid gap-2' },
  template: `<ng-content />`,
})
export class RadioGroup {}

@Component({
  selector: 'signng-radio',
  hostDirectives: [{ directive: SignngRadio, inputs: ['value', 'disabled'] }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'inline-flex items-center gap-2 text-sm cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
  },
  template: `
    <span
      class="flex size-5 shrink-0 items-center justify-center rounded-full border border-primary"
    >
      @if (radio.checked()) {
        <span class="size-2.5 rounded-full bg-primary"></span>
      }
    </span>
    <ng-content />
  `,
})
export class Radio {
  protected readonly radio = inject(SignngRadio, { self: true });
}
