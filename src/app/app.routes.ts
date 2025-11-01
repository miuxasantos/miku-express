import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./dashboard/home/home.routes').then(m => m.HOME_ROUTES)
  },
  {
    path: 'clientes',
    loadChildren: () =>
      import('./cadastros/cliente/cliente.routes').then(m => m.CLIENTES_ROUTES)
  },
];
