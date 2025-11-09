import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, LoginRequest } from '../../services/auth.service';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    DividerModule,
    ToastModule,
    TagModule
  ],
  providers: [MessageService],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {

  credentials: LoginRequest = { email: '', password: '' };
  isSubmitting = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  login(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Dados incompletos',
        detail: 'Informe e-mail e senha para entrar.'
      });
      return;
    }

    this.isSubmitting = true;
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Bem-vindo(a)!',
          detail: `Login realizado com a conta ${response.email}.`
        });

        const target = response.role?.toLowerCase() === 'admin' ? '/adm' : '/meuspacotes';
        setTimeout(() => this.router.navigate([target]), 600);
      },
      error: (err) => {
        const status = err.status;
        let detail = 'Não foi possível realizar o login. Tente novamente.';

        if (status === 401) {
          detail = 'Credenciais inválidas. Verifique seu e-mail e senha.';
        } else if (status === 0) {
          detail = 'Falha de comunicação com o servidor.';
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Erro ao entrar',
          detail
        });
      }
    }).add(() => {
      this.isSubmitting = false;
    });
  }
}
