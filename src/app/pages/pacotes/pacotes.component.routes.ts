import { Routes } from '@angular/router';
import { PacotesComponent } from './pacotes.component';
import { clientOnlyGuard } from '../../core/auth/client-only.guard';

export const MEUS_PACOTES_ROUTES: Routes = [
  { 
    path: '', 
    component: PacotesComponent,
    canActivate: [clientOnlyGuard]
  }
];