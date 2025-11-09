import { Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { clientOnlyGuard } from '../../core/auth/client-only.guard';

export const ACCOUNT_ROUTES: Routes = [
  {
    path: '',
    component: AccountComponent,
    canActivate: [clientOnlyGuard]
  }
];

