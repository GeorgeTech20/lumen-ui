import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '@/lib/utils';

/**
 * Form field wrapper (helm) — label + projected control + description + error message. Presentational
 * and form-library-agnostic: bind `invalid`/`error` from your reactive form, e.g.
 * `[invalid]="c.invalid && c.touched" [error]="c.errors?.['required'] ? 'Requerido' : ''"`.
 * Set `htmlFor` to the projected control's id so the label associates. The error has role=alert.
 */
@Component({
  selector: 'signng-form-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block space-y-1.5' },
  template: `
    <label [attr.for]="htmlFor() || null" [class]="labelClass()">{{ label() }}</label>
    <ng-content />
    @if (description() && !(invalid() && error())) {
      <p class="text-xs text-muted-foreground">{{ description() }}</p>
    }
    @if (invalid() && error()) {
      <p class="text-xs font-medium text-destructive" role="alert">{{ error() }}</p>
    }
  `,
})
export class FormField {
  readonly label = input('');
  readonly description = input('');
  readonly error = input('');
  readonly invalid = input(false);
  readonly htmlFor = input('');

  protected readonly labelClass = computed(() =>
    cn('text-sm font-medium leading-none', this.invalid() ? 'text-destructive' : ''),
  );
}
