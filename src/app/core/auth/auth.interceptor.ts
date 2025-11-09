import { HttpInterceptorFn } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  // const token = this.authService.getToken();
  //   if (token) {
  //     req = req.clone({
  //       setHeaders: { Authorization: `Bearer ${token}` }
  //     });
  // }

  if (token) {
    const decoded: Record<string, unknown> = jwtDecode(token);
    const userId =
      decoded['id'] ??
      decoded['userId'] ??
      decoded['user_id'] ??
      decoded['sub'] ??
      null;

    console.log('Usuário logado com ID:', userId ?? '(não informado no token)');
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req);
};
