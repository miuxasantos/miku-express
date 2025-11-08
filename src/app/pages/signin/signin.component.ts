import { Component } from '@angular/core';
import { AuthService, LoginRequest } from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  imports: [],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {

  credentials: LoginRequest = { email: '', password: '' };
  error: string | null = null;

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        console.log('Usuário logado:', res.name);
        // redireciona conforme papel
        if (res.role === 'admin') {
          // navegue para dashboard admin
        } else {
          // navegue para área do cliente
        }
      },
      error: (err) => {
        this.error = 'Credenciais inválidas';
        console.error(err);
      }
    });
  }
}
