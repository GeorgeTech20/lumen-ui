import { Directive, input } from '@angular/core';

/** Aspect-ratio box (helm). `<div signngAspectRatio ratio="16/9">`. Children fill the box. */
@Directive({
  selector: '[signngAspectRatio]',
  host: {
    class: 'block w-full overflow-hidden',
    '[style.aspect-ratio]': 'ratio()',
  },
})
export class AspectRatio {
  readonly ratio = input('16/9');
}
