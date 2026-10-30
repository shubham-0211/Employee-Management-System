
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'departments/:id/employees',
    renderMode: RenderMode.Server,
  },
  {
    path: 'departments',
    renderMode: RenderMode.Server,
  },
  {
    path: 'employees/:id/edit',
    renderMode: RenderMode.Server,
  },
  {
    path: 'employees/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'employees/directory',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
