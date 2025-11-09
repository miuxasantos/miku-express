import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { CreateClient } from '../../models/client';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';

interface GenderOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-signup',
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
    TagModule,
    CheckboxModule
  ],
  providers: [MessageService],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  isSubmitting = false;
  acceptedTerms = false;

  genders: GenderOption[] = [
    { label: 'Feminino', value: 'WOMAN' },
    { label: 'Masculino', value: 'MAlE' }
  ];

  formData: CreateClient = {
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    cpf: '',
    dateOfBirth: '',
    gender: this.genders[0].value
  };

  maxDate = this.toDateInputValue(new Date());

  constructor(
    private clientService: ClientService,
    private router: Router,
    private messageService: MessageService
  ) {}

  register(form: NgForm) {
    if (form.invalid || !this.acceptedTerms) {
      form.control.markAllAsTouched();
      if (!this.acceptedTerms) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Termos de uso',
          detail: 'É necessário aceitar os termos de uso e privacidade.'
        });
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Dados incompletos',
          detail: 'Verifique as informações preenchidas e tente novamente.'
        });
      }
      return;
    }

    this.isSubmitting = true;
    const payload: CreateClient = {
      ...this.formData,
      cpf: this.onlyDigits(this.formData.cpf),
      phoneNumber: this.onlyDigits(this.formData.phoneNumber),
      dateOfBirth: this.formData.dateOfBirth
    };

    this.clientService.register(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Cadastro concluído',
          detail: 'Revise seu e-mail para confirmar o acesso.'
        });
        setTimeout(() => this.router.navigate(['/signin']), 700);
      },
      error: (err) => {
        let detail = 'Não foi possível concluir o cadastro.';
        if (err.status === 409) {
          detail = 'Já existe uma conta registrada com este e-mail ou CPF.';
        } else if (err.status === 0) {
          detail = 'Falha de comunicação com o servidor. Tente novamente em instantes.';
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Erro no cadastro',
          detail
        });
      }
    }).add(() => {
      this.isSubmitting = false;
    });
  }

  private onlyDigits(value: string): string {
    return value.replace(/\D/g, '');
  }

  private toDateInputValue(date: Date): string {
    const local = new Date(date);
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    return local.toISOString().split('T')[0];
  }
}
