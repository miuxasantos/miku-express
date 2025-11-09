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
      import('./pages/rastreio/rastreio.component.routes').then(m => m.RASTREIO_ROUTES)
  },
  {
    path: 'meuspacotes',
    loadChildren: () =>
      import('./pages/pacotes/pacotes.component.routes').then(m => m.MEUS_PACOTES_ROUTES)
  },
  {
    path: 'minha-conta',
    loadChildren: () =>
      import('./pages/account/account.component.routes').then(m => m.ACCOUNT_ROUTES)
  },
  {
    path: 'contato',
    loadChildren: () =>
      import('./pages/contato/contato.component.routes').then(m => m.CONTATO_ROUTES)
  },
  {
    path: 'signin',
    loadChildren: () =>
      import('./pages/signin/signin.component.routes').then(m => m.SIGNIN_ROUTES)
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./pages/signup/signup.component.routes').then(m => m.SIGNUP_ROUTES)
  },
  {
    path: 'adm',
    loadChildren: () =>
      import('./pages/admin/adm.component.routes').then(m => m.ADM_ROUTES)
  },
  {
    path: 'notfound',
    loadChildren: () =>
      import('./pages/notfound/notfound.component.routes').then(m => m.NOTFOUND_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
