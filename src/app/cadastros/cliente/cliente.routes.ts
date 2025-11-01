import { Routes } from '@angular/router';

export const CLIENTES_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'listar' },
  {
    path: 'listar',
    loadComponent: () =>
      import('./cliente-listar/cliente-listar').then(m => m.ClienteListar)
  },
  {
    path: 'novo',
    loadComponent: () =>
      import('./cliente-cadastrar/cliente-cadastrar').then(m => m.ClienteCadastrar)
  },
  {
    path: ':id/editar',
    loadComponent: () =>
      import('./cliente-cadastrar/cliente-cadastrar').then(m => m.ClienteCadastrar)
  }
];
