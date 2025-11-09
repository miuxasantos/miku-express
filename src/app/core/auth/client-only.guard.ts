import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

export const clientOnlyGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  const user = authService.getUser();

  if (!user) {
    messageService.add({
      severity: 'warn',
      summary: 'Sessão necessária',
      detail: 'Faça login para acessar seus pacotes.'
    });
    router.navigate(['/signin']);
    return false;
  }

  if (user.role?.toUpperCase() === 'ADMIN') {
    messageService.add({
      severity: 'warn',
      summary: 'Acesso restrito',
      detail: 'Esta área é exclusiva para clientes.'
    });
    router.navigate(['/adm']);
    return false;
  }

  return true;
};

