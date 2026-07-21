/**
 * Accordion adapter over `@angular/aria` (Developer Preview) — same isolation rule as Tabs:
 * every aria touchpoint funnels through this one file, so preview churn is a 1-file change.
 * SignNG inherits Google's accordion a11y (keyboard, aria-expanded, panel wiring) and adds the skin.
 *
 * Selectors (from aria): `[ngAccordionGroup]` (+ `[multiExpandable]`), `[ngAccordionTrigger]`
 * (+ `[panel]` -> the panel ref), `[ngAccordionPanel]` (exportAs `ngAccordionPanel`),
 * `ng-template[ngAccordionContent]` (lazy content).
 */
import {
  AccordionContent,
  AccordionGroup,
  AccordionPanel,
  AccordionTrigger,
} from '@angular/aria/accordion';

export {
  AccordionGroup as SignngAccordionGroup,
  AccordionTrigger as SignngAccordionTrigger,
  AccordionPanel as SignngAccordionPanel,
  AccordionContent as SignngAccordionContent,
};

/** Single import barrel for the accordion primitive set. */
export const SIGNNG_ACCORDION = [
  AccordionGroup,
  AccordionPanel,
  AccordionTrigger,
  AccordionContent,
] as const;
