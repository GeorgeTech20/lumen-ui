import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Per-component docs pages fetch their content client-side from the signed registry (/r) —
  // no build-time param list to prerender against, so this one route renders on the client.
  {
    path: 'docs/:name',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
