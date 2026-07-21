import { Routes } from '@angular/router';
import { Showcase } from './showcase';
import { Blocks } from './blocks';
import { Dashboard } from './dashboard';
import { IconsPage } from './icons';
import { ColorsPage } from './colors';
import { DocsPage } from './docs';

// 'demo' (Fase 0) isn't in SiteNav/linked anywhere — it's the e2e a11y test fixture
// (e2e/a11y.spec.ts drives every interaction pattern against this one page). Routed but
// lazy-loaded so it doesn't add a byte to the initial bundle real visitors download.
export const routes: Routes = [
  { path: '', component: Showcase, title: 'SignNG — Angular components you own' },
  { path: 'blocks', component: Blocks, title: 'SignNG — blocks' },
  { path: 'dashboard', component: Dashboard, title: 'SignNG — dashboard' },
  { path: 'icons', component: IconsPage, title: 'SignNG — icons' },
  { path: 'colors', component: ColorsPage, title: 'SignNG — colors' },
  { path: 'docs', component: DocsPage, title: 'SignNG — docs' },
  { path: 'docs/:name', component: DocsPage, title: 'SignNG — docs' },
  { path: 'demo', loadComponent: () => import('./demo').then((m) => m.Demo), title: 'SignNG — demo (test fixture)' },
];
