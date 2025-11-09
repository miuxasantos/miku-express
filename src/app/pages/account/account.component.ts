import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ClientService } from '../../services/client.service';
import { Client, UpdateClient } from '../../models/client';

type EditableField = keyof UpdateClient;

interface GenderOption {
  label: string;
  value: string;
}

/**
 * Tela de gerenciamento de conta do cliente autenticado.
 * Permite visualizar e atualizar informações cadastrais,
 * além de encerrar sessão ou excluir definitivamente a conta.
 */
@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    DividerModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit {

  loading = true;
  account?: Client;
  formState: UpdateClient = {};
  isUpdating: Record<EditableField, boolean> = {
    name: false,
    email: false,
    phoneNumber: false,
    cpf: false,
    dateOfBirth: false,
    gender: false
  };

  readonly genderOptions: GenderOption[] = [
    { label: 'Feminino', value: 'WOMAN' },
    { label: 'Masculino', value: 'MALE' }
  ];

  constructor(
    private clientService: ClientService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) {}

  /** Inicializa a tela carregando os dados do cliente autenticado. */
  ngOnInit(): void {
    this.carregarDados();
  }

  /**
   * Recupera os dados da conta e sincroniza o formulário local.
   * Em caso de falha exibe toast e mantém o estado atual.
   */
  carregarDados(): void {
    this.loading = true;
    this.cdr.markForCheck();

    this.clientService.getAcc().subscribe({
      next: (data) => {
        this.account = data;
        this.syncFormState();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro ao carregar dados',
          detail: 'Não foi possível carregar seus dados no momento.'
        });
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Dispara a atualização de um campo individual usando PATCH parcial.
   * Normaliza CPF/telefone (somente dígitos) antes de enviar.
   */
  updateField(field: EditableField): void {
    if (!this.account) {
      return;
    }

    const value = this.formState[field];
    if (value === undefined || value === null || value === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campo obrigatório',
        detail: 'Informe um valor antes de salvar.'
      });
      return;
    }

    let preparedValue: string = value;
    if (field === 'cpf' || field === 'phoneNumber') {
      preparedValue = this.onlyDigits(value);
    }

    this.isUpdating[field] = true;
    const payload = { [field]: preparedValue } as UpdateClient;

    this.clientService.updateAcc(payload).subscribe({
      next: (updated) => {
        this.account = { ...this.account!, ...updated };
        this.syncFormState(field);
        this.messageService.add({
          severity: 'success',
          summary: 'Dados atualizados',
          detail: 'Informação salva com sucesso.'
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        let detail = 'Não foi possível atualizar o campo.';
        if (err.status === 409) {
          detail = 'Já existe um registro com este valor.';
        } else if (err.status === 400) {
          detail = 'Valor informado não é válido. Verifique e tente novamente.';
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Erro na atualização',
          detail
        });
        this.cdr.detectChanges();
      }
    }).add(() => {
      this.isUpdating[field] = false;
      this.cdr.detectChanges();
    });
  }

  /** Restaura o campo informado para o valor recebido do backend. */
  resetField(field: EditableField): void {
    if (!this.account) {
      return;
    }

    const currentValue = this.account[field as keyof Client] as string | undefined;
    this.formState[field] = currentValue ?? '';
  }

  /** Encerra a sessão e redireciona para a página de login. */
  logout(): void {
    this.authService.logout();
    this.messageService.add({
      severity: 'info',
      summary: 'Sessão encerrada',
      detail: 'Você saiu da sua conta.'
    });
    this.router.navigate(['/signin']);
  }

  /**
   * Solicita confirmação e remove definitivamente a conta do cliente.
   * Também limpa a sessão e redireciona para a tela de cadastro.
   */
  deleteAccount(): void {
    this.confirmationService.confirm({
      header: 'Excluir conta',
      message: 'Esta ação é irreversível. Deseja realmente excluir sua conta?',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clientService.deleteAcc().subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Conta excluída',
              detail: 'Sua conta foi removida com sucesso.'
            });
            this.authService.logout();
            this.router.navigate(['/signup']);
            this.cdr.detectChanges();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro ao excluir conta',
              detail: 'Não foi possível concluir a exclusão da conta.'
            });
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  /** Formata CPF com máscara padrão brasileira. */
  formatCpf(cpf?: string): string {
    if (!cpf) {
      return '-';
    }
    const digits = cpf.replace(/\D/g, '').padEnd(11, ' ');
    return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4').trim();
  }

  /** Formata número de telefone usando máscara dinâmica. */
  formatPhone(phone?: string): string {
    if (!phone) {
      return '-';
    }
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      return phone;
    }
    return digits.replace(/^(\d{2})(\d{4,5})(\d{4}).*/, '($1) $2-$3');
  }

  /** Mantém apenas os dígitos de uma string (usado em CPF/telefone). */
  private onlyDigits(value: string): string {
    return value.replace(/\D/g, '');
  }

  /** Sincroniza o estado do formulário com os dados carregados da conta. */
  private syncFormState(field?: EditableField): void {
    if (!this.account) {
      return;
    }

    const mapField = (f: EditableField) => {
      const value = this.account?.[f as keyof Client];
      if (f === 'dateOfBirth' && typeof value === 'string' && value) {
        this.formState.dateOfBirth = value.substring(0, 10);
      } else {
        (this.formState as any)[f] = value ?? '';
      }
    };

    if (field) {
      mapField(field);
    } else {
      (Object.keys(this.isUpdating) as EditableField[]).forEach(mapField);
    }
  }
}

