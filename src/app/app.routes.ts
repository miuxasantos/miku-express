import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./dashboard/home/home.routes').then(m => m.HOME_ROUTES)
  },
  {
    path: 'rastreio',
    loadChildren: () =>
      import('./rastreio/rastreio.component.routes').then(m => m.RASTREIO_ROUTES)
  },
  {
    path: 'meuspacotes',
    loadChildren: () =>
      import('./pacotes/pacotes.routes').then(m => m.MEUS_PACOTES_ROUTES)
  },
  {
    path: 'contato',
    loadChildren: () =>
      import('./contato/contato.routes').then(m => m.CONTATO_ROUTES)
  },
  {
    path: 'signin',
    loadChildren: () =>
      import('./login/signin/signin.routes').then(m => m.SIGNIN_ROUTES)
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./login/signup/signup.routes').then(m => m.SIGNUP_ROUTES)
  },
  {
    path: 'adm',
    loadChildren: () =>
      import('./admin/adm.routes').then(m => m.ADM_ROUTES)
  }
];
