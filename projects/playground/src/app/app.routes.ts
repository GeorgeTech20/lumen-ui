import { Routes } from '@angular/router';
import { Showcase } from './showcase';
import { Blocks } from './blocks';
import { Dashboard } from './dashboard';
import { IconsPage } from './icons';
import { ColorsPage } from './colors';
import { DocsPage } from './docs';

// 'demo' (Fase 0 scratch page) intentionally not routed — superseded by Showcase,
// file kept on disk for reference, not reachable from the site.
export const routes: Routes = [
  { path: '', component: Showcase, title: 'SignNG — Angular components you own' },
  { path: 'blocks', component: Blocks, title: 'SignNG — blocks' },
  { path: 'dashboard', component: Dashboard, title: 'SignNG — dashboard' },
  { path: 'icons', component: IconsPage, title: 'SignNG — icons' },
  { path: 'colors', component: ColorsPage, title: 'SignNG — colors' },
  { path: 'docs', component: DocsPage, title: 'SignNG — docs' },
  { path: 'docs/:name', component: DocsPage, title: 'SignNG — docs' },
];
