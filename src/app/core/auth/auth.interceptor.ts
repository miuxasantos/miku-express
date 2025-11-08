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
    const decoded: any = jwtDecode(token);
    console.log('Usuário logado com ID:', decoded.id); // ou "decoded.id" dependendo do token
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req);
};
