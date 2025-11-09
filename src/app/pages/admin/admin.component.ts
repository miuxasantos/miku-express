import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AdmService, Adm, CreateAdm, CreatePackage, Order, StatusUpdate, UpdateAdm } from '../../services/adm.service';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CepMaskDirective } from '../../core/mask/cepMask.directive';
import { PhoneMaskDirective } from '../../core/mask/phoneMask.directive';
import { CnpjMaskDirective } from '../../core/mask/cnpjMask.directive';

interface DashboardStat {
  label: string;
  value: string | number;
  icon: string;
  description: string;
  severity: 'info' | 'success' | 'warn' | 'danger';
}

/**
 * Painel administrativo que centraliza visualização e manutenção de pedidos
 * e usuários administradores. Executa ações como criação de pacotes,
 * atualização de status, geração de métricas e gestão de contas administrativas.
 */
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    TagModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    CardModule,
    DividerModule,
    ToastModule,
    ConfirmDialogModule,
    CepMaskDirective,
    PhoneMaskDirective,
    CnpjMaskDirective
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];

  loading = false;
  searchTerm = '';

  stats: DashboardStat[] = [];

  admins: Adm[] = [];
  filteredAdmins: Adm[] = [];
  adminsLoading = false;
  adminSearchTerm = '';

  adminDialogVisible = false;
  createAdminDialogVisible = false;

  adminForm: FormGroup;
  adminSaving = false;

  createAdminForm: FormGroup;
  creatingAdminUser = false;

  selectedAdmin?: Adm;

  selectedOrder?: Order;
  orderDialogVisible = false;

  statusDialogVisible = false;
  statusForm: FormGroup;
  savingStatus = false;

  createDialogVisible = false;
  packageForm: FormGroup;
  creatingPackage = false;

  constructor(
    private admService: AdmService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) {
    this.statusForm = this.fb.group({
      status: ['', [Validators.required, Validators.minLength(3)]],
      source: ['', [Validators.required, Validators.minLength(3)]],
      destination: ['']
    });

    this.packageForm = this.fb.group({
      source: ['', [Validators.required, Validators.minLength(5)]],
      destination: ['', [Validators.required, Validators.minLength(5)]],
      customerName: ['', [Validators.required, Validators.minLength(3)]],
      customerEmail: ['', [Validators.required, Validators.email]],
      weightInKg: [null, [Validators.required, Validators.min(0.1)]]
    });

    this.adminForm = this.fb.group({
      id: [{ value: null, disabled: true }],
      name: ['', [Validators.required, Validators.minLength(3)]],
      phoneNumber: ['', [Validators.minLength(8)]],
      organizationName: ['', [Validators.required, Validators.minLength(3)]],
      email: [{ value: '', disabled: true }],
      cnpj: [{ value: '', disabled: true }]
    });

    this.createAdminForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(8)]],
      cnpj: ['', [Validators.required, Validators.minLength(14)]],
      organizationName: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  /**
   * Inicializa o painel carregando pedidos e administradores
   * de forma assíncrona (evitando ExpressionChanged em modo zoneless).
   */
  ngOnInit(): void {
    Promise.resolve().then(() => this.loadOrders());
    Promise.resolve().then(() => this.loadAdmins());
  }

  /** Obtém todos os pedidos e recalcula as métricas exibidas. */
  loadOrders(showToast = false): void {
    this.loading = true;
    this.cdr.markForCheck();

    this.admService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data ?? [];
        this.applyFilter();
        this.recalculateStats();

        if (showToast) {
          this.messageService.add({
            severity: 'success',
            summary: 'Pedidos atualizados',
            detail: 'Lista de pedidos sincronizada com sucesso.'
          });
        }
      },
      error: (error) => {
        console.error('Erro ao carregar pedidos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Falha ao carregar',
          detail: 'Não foi possível obter os pedidos no momento.'
        });
      }
    }).add(() => {
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  /** Aplica filtro textual sobre a tabela de pedidos. */
  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.filteredOrders = [...this.orders];
      return;
    }

    this.filteredOrders = this.orders.filter(order => {
      return [
        order.trackingCode,
        order.customerName,
        order.customerEmail,
        order.source,
        order.destination
      ]
        .filter(Boolean)
        .some(value => value.toLowerCase().includes(term));
    });
  }

  /** Carrega a lista de administradores para gestão. */
  loadAdmins(showToast = false): void {
    this.adminsLoading = true;
    this.cdr.markForCheck();

    this.admService.getAllAdmins().subscribe({
      next: (data) => {
        this.admins = data ?? [];
        this.applyAdminFilter();

        if (showToast) {
          this.messageService.add({
            severity: 'success',
            summary: 'Administradores atualizados',
            detail: 'Lista de administradores sincronizada com sucesso.'
          });
        }
      },
      error: (error) => {
        console.error('Erro ao carregar administradores:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Falha ao carregar administradores',
          detail: 'Não foi possível obter a lista de administradores.'
        });
      }
    }).add(() => {
      this.adminsLoading = false;
      this.cdr.detectChanges();
    });
  }

  /** Filtra a tabela de administradores conforme busca digitada. */
  applyAdminFilter(): void {
    const term = this.adminSearchTerm.trim().toLowerCase();

    if (!term) {
      this.filteredAdmins = [...this.admins];
      return;
    }

    this.filteredAdmins = this.admins.filter((admin) =>
      [
        admin.name,
        admin.email,
        admin.phoneNumber,
        admin.cnpj,
        admin.organizationName
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term))
    );
  }

  /** Abre o modal com os detalhes completos do pedido selecionado. */
  openOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.orderDialogVisible = true;
  }

  /** Fecha o modal de detalhes de pedido. */
  closeOrderDetails(): void {
    this.orderDialogVisible = false;
    this.selectedOrder = undefined;
  }

  /** Prepara o formulário e exibe o diálogo de atualização de status. */
  openStatusDialog(order: Order): void {
    this.selectedOrder = order;
    const lastUpdate = this.getLastStatus(order);

    this.statusForm.reset({
      status: '',
      source: lastUpdate?.destination ?? order.destination,
      destination: ''
    });

    this.statusDialogVisible = true;
  }

  /** Envia atualização de status ao backend e sincroniza a lista local. */
  submitStatus(): void {
    if (!this.selectedOrder) {
      return;
    }

    if (this.statusForm.invalid) {
      this.statusForm.markAllAsTouched();
      return;
    }

    this.savingStatus = true;
    const { status, source, destination } = this.statusForm.value;

    this.admService.updateOrderStatus(this.selectedOrder.id, { status, source, destination }).subscribe({
      next: (update) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Status atualizado',
          detail: `Pedido ${this.selectedOrder?.trackingCode} recebeu a atualização.`
        });

        const targetOrder = this.orders.find(order => order.id === this.selectedOrder?.id);
        if (targetOrder) {
          const normalizedUpdate: StatusUpdate = {
            status: update.status,
            source: update.source,
            destination: update.destination,
            dateUpdate: update.dateUpdate
          };

          targetOrder.statusUpdates = [
            ...(targetOrder.statusUpdates ?? []),
            normalizedUpdate
          ];
        }

        this.recalculateStats();
        this.statusDialogVisible = false;
      },
      error: (error) => {
        console.error('Erro ao atualizar status:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Falha ao atualizar',
          detail: 'Não foi possível atualizar o status. Tente novamente.'
        });
      }
    }).add(() => {
      this.savingStatus = false;
      this.selectedOrder = undefined;
      this.statusForm.reset();
    });
  }

  /** Abre o modal de criação de novo pedido. */
  openCreateDialog(): void {
    this.packageForm.reset();
    this.createDialogVisible = true;
  }

  /** Abre o modal de criação de novo administrador. */
  openCreateAdminDialog(): void {
    this.createAdminForm.reset();
    this.createAdminDialogVisible = true;
  }

  /** Submete o formulário de criação de pedido/pacote. */
  submitPackage(): void {
    if (this.packageForm.invalid) {
      this.packageForm.markAllAsTouched();
      return;
    }

    this.creatingPackage = true;
    const payload = this.packageForm.value as CreatePackage;

    this.admService.createPackage(payload).subscribe({
      next: (order) => {
        const detailMessage = order?.trackingCode
          ? `Pacote ${order.trackingCode} criado com sucesso.`
          : 'Pedido criado com sucesso.';

        this.messageService.add({
          severity: 'success',
          summary: 'Pedido criado',
          detail: detailMessage
        });

        this.createDialogVisible = false;
        this.loadOrders();
      },
      error: (error) => {
        console.error('Erro ao criar pedido:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Falha ao criar pedido',
          detail: 'Não foi possível registrar o pacote. Revise os dados e tente novamente.'
        });
      }
    }).add(() => {
      this.creatingPackage = false;
      this.packageForm.markAsPristine();
    });
  }

  /** Submete o formulário de criação de administradores. */
  submitRegisterAdmin(): void {
    if (this.createAdminForm.invalid) {
      this.createAdminForm.markAllAsTouched();
      return;
    }

    this.creatingAdminUser = true;
    const payload = this.createAdminForm.value as CreateAdm;

    this.admService.register(payload).subscribe({
      next: (admin) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Administrador criado',
          detail: `Administrador ${admin.name} cadastrado com sucesso.`
        });

        this.createAdminDialogVisible = false;
        this.loadAdmins();
      },
      error: (error) => {
        console.error('Erro ao criar administrador:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Falha ao criar administrador',
          detail: error?.error?.message || 'Não foi possível registrar o administrador.'
        });
      }
    }).add(() => {
      this.creatingAdminUser = false;
      this.createAdminForm.markAsPristine();
    });
  }

  /** Abre o modal de edição e pré-preenche os dados do administrador. */
  openUpdateAdminDialog(admin: Adm): void {
    this.selectedAdmin = admin;
    this.adminForm.reset({
      id: admin.id,
      name: admin.name,
      phoneNumber: admin.phoneNumber ?? '',
      organizationName: admin.organizationName ?? '',
      email: admin.email,
      cnpj: admin.cnpj
    });
    this.adminDialogVisible = true;
  }

  /** Persiste as alterações realizadas no administrador selecionado. */
  submitAdminUpdate(): void {
    if (!this.selectedAdmin) {
      return;
    }

    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      return;
    }

    const raw = this.adminForm.getRawValue();
    const updates: UpdateAdm = {};
    const changes: Array<keyof UpdateAdm> = [];

    if (raw.name && raw.name !== this.selectedAdmin.name) {
      updates.name = raw.name;
      changes.push('name');
    }

    if (raw.phoneNumber !== undefined && raw.phoneNumber !== (this.selectedAdmin.phoneNumber ?? '')) {
      updates.phoneNumber = raw.phoneNumber || undefined;
      changes.push('phoneNumber');
    }

    if (raw.organizationName && raw.organizationName !== (this.selectedAdmin.organizationName ?? '')) {
      updates.organizationName = raw.organizationName;
      changes.push('organizationName');
    }

    if (changes.length === 0) {
      this.messageService.add({
        severity: 'info',
        summary: 'Nenhuma alteração',
        detail: 'Atualize pelo menos um dos campos antes de salvar.'
      });
      return;
    }

    this.adminSaving = true;

    this.admService.updateAdminById(this.selectedAdmin.id, updates).subscribe({
      next: (updated) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Administrador atualizado',
          detail: `Informações de ${updated.name} foram atualizadas.`
        });

        this.admins = this.admins.map((admin) =>
          admin.id === updated.id ? { ...admin, ...updated } : admin
        );
        this.applyAdminFilter();
        this.adminDialogVisible = false;
        this.selectedAdmin = undefined;
      },
      error: (error) => {
        console.error('Erro ao atualizar administrador:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Falha ao atualizar',
          detail: error?.error?.message || 'Não foi possível atualizar o administrador.'
        });
      }
    }).add(() => {
      this.adminSaving = false;
    });
  }

  /** Solicita confirmação do usuário antes de excluir um pedido. */
  confirmDelete(order: Order, event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Deseja excluir o pedido ${order.trackingCode}? Esta ação não pode ser desfeita.`,
      header: 'Excluir pedido',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteOrder(order)
    });
  }

  /** Remove o pedido informado e atualiza a listagem/métricas. */
  private deleteOrder(order: Order): void {
    this.admService.deleteOrder(order.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Pedido removido',
          detail: `Pedido ${order.trackingCode} removido com sucesso.`
        });
        this.orders = this.orders.filter(item => item.id !== order.id);
        this.applyFilter();
        this.recalculateStats();
      },
      error: (error) => {
        console.error('Erro ao excluir pedido:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Falha ao excluir',
          detail: 'Não foi possível excluir o pedido. Tente novamente mais tarde.'
        });
      }
    });
  }

  /** Solicita confirmação antes de remover um administrador. */
  confirmDeleteAdmin(admin: Adm, event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Excluir o administrador ${admin.name}? Esta ação é irreversível.`,
      header: 'Excluir administrador',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteAdmin(admin)
    });
  }

  /** Executa a exclusão do administrador e atualiza a listagem local. */
  private deleteAdmin(admin: Adm): void {
    this.admService.deleteAdminById(admin.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Administrador removido',
          detail: `${admin.name} foi removido com sucesso.`
        });

        this.admins = this.admins.filter((item) => item.id !== admin.id);
        this.applyAdminFilter();
      },
      error: (error) => {
        console.error('Erro ao excluir administrador:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Falha ao excluir',
          detail: error?.error?.message || 'Não foi possível excluir o administrador.'
        });
      }
    });
  }

  /** Recarrega pedidos e administradores, emitindo toast de sucesso. */
  refresh(): void {
    this.loadOrders(true);
    this.loadAdmins(true);
  }

  /** Retorna o último status registrado para o pedido. */
  getLastStatus(order: Order): StatusUpdate | undefined {
    const updates = order.statusUpdates ?? [];
    if (!updates.length) {
      return undefined;
    }

    return updates[updates.length - 1];
  }

  /** Converte uma string de status para a severidade usada pelo PrimeNG. */
  getStatusSeverity(status?: string): 'info' | 'success' | 'warn' | 'danger' {
    if (!status) {
      return 'info';
    }

    const normalized = status.toLowerCase();

    if (normalized.includes('entreg')) {
      return 'success';
    }

    if (normalized.includes('atras')) {
      return 'warn';
    }

    if (normalized.includes('cancel')) {
      return 'danger';
    }

    return 'info';
  }

  /** Formata o valor de distância com sufixo em quilômetros. */
  formatDistance(distance: string | number | null | undefined): string {
    if (distance == null) {
      return '—';
    }

    if (typeof distance === 'number') {
      return `${distance.toFixed(1)} km`;
    }

    return distance;
  }

  /** Otimiza a renderização rastreando pedidos pelo ID. */
  trackByOrderId(_: number, order: Order): number {
    return order.id;
  }

  /** Normaliza valores numéricos recebidos como string/number e aplica formatação monetária. */
  formatPriceValue(value: number | string | null | undefined): string {
    if (value === null || value === undefined) {
      return '—';
    }

    const numeric = typeof value === 'string' ? Number(value) : value;

    if (Number.isNaN(numeric)) {
      return '—';
    }

    return numeric.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  /** Converte valores para número seguro (tratando strings e NaN). */
  private toNumber(value: number | string | null | undefined): number {
    if (value === null || value === undefined) {
      return 0;
    }

    const numeric = typeof value === 'string' ? Number(value) : value;
    return Number.isNaN(numeric) ? 0 : numeric;
  }

  /** Recalcula os cartões estatísticos exibidos no topo da página. */
  private recalculateStats(): void {
    const total = this.orders.length;
    const revenue = this.orders.reduce((sum, current) => sum + this.toNumber(current.price), 0);

    let delivered = 0;
    let inTransit = 0;

    this.orders.forEach(order => {
      const last = this.getLastStatus(order)?.status?.toLowerCase() ?? '';

      if (last.includes('entregue')) {
        delivered += 1;
      } else if (last.includes('cancel')) {
        return;
      } else {
        inTransit += 1;
      }
    });

    this.stats = [
      {
        label: 'Pedidos ativos',
        value: total,
        icon: 'pi pi-inbox',
        description: 'Total de pedidos cadastrados',
        severity: 'info'
      },
      {
        label: 'Entregues',
        value: delivered,
        icon: 'pi pi-send',
        description: 'Pedidos finalizados com sucesso',
        severity: 'success'
      },
      {
        label: 'Em rota',
        value: inTransit,
        icon: 'pi pi-truck',
        description: 'Pacotes em transporte ou processamento',
        severity: 'success'
      },
      {
        label: 'Receita estimada',
        value: revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        icon: 'pi pi-dollar',
        description: 'Somatória dos pedidos cadastrados',
        severity: 'success'
      }
    ];
  }
}
