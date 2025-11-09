import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { BuscaComponent } from './components/busca.component';
import { DetalhesComponent } from './components/detalhes.component';
import { PublicService } from '../../services/public.service';
import { ClientService } from '../../services/client.service';
import { Order } from '../../models/client';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-rastreio',
  standalone: true,
  imports: [
    CommonModule, 
    BuscaComponent, 
    DetalhesComponent,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './rastreio.component.html',
  styleUrls: ['./rastreio.component.scss']
})

export class RastreioComponent implements OnInit {
  trackingCodeInput?: string;
  orderEncontrado: boolean = false;
  orderSelecionado?: Order;
  loading: boolean = false;

  constructor(
    private publicService: PublicService,
    private clientService: ClientService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const trackingCode = params['code'];
      console.log('Query parameter code:', trackingCode);
      
      if (trackingCode) {
        this.buscarOrder(trackingCode);
      }
    });
  }

  buscarOrder(trackingCode: string) {
    this.loading = true;

    const sanitizedCode = trackingCode.trim().toUpperCase();

    // Primeiro tenta buscar via PublicService (sem autenticação)
    this.publicService.getOrderByTrackingCode(sanitizedCode).subscribe({
      next: (order: Order) => {
        this.orderSelecionado = order;
        this.orderEncontrado = true;
        this.loading = false;
        
        this.messageService.add({
          severity: 'success',
          summary: 'Pacote Encontrado',
          detail: 'Detalhes do pacote carregados com sucesso'
        });
      },
      error: (publicError: HttpErrorResponse) => {
        if (this.deveTentarAutenticado(publicError)) {
          this.tentarBuscarComAutenticacao(sanitizedCode);
          return;
        }

        this.loading = false;
        this.exibirErroBusca(publicError);
      }
    });
  }

  private tentarBuscarComAutenticacao(trackingCode: string) {
    if (!this.isAutenticado()) {
      this.loading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Pacote Não Encontrado',
        detail: 'Não foi possível encontrar o pacote com o código informado'
      });
      return;
    }

    // Primeiro busca a lista de orders para encontrar o ID pelo trackingCode
    this.clientService.getOrders().subscribe({
      next: (orders: Order[]) => {
        // Encontra o order pelo trackingCode
        const orderEncontrado = orders.find(order => 
          order.trackingCode === trackingCode
        );

        if (orderEncontrado) {
          // Agora busca os detalhes completos usando o ID
          this.buscarDetalhesOrder(orderEncontrado.id);
        } else {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Pacote Não Encontrado',
            detail: 'Não foi possível encontrar o pacote com o código informado'
          });
        }
      },
      error: (clientError) => {
        this.loading = false;
        this.exibirErroBusca(clientError);
      }
    });
  }

  private buscarDetalhesOrder(orderId: number) {
    // Busca os detalhes completos do order usando o ID
    this.clientService.getOrderById(orderId).subscribe({
      next: (order: Order) => {
        this.orderSelecionado = order;
        this.orderEncontrado = true;
        this.loading = false;
        
        this.messageService.add({
          severity: 'success',
          summary: 'Pacote Encontrado',
          detail: 'Detalhes do pacote carregados com sucesso'
        });
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro ao Carregar Detalhes',
          detail: error.error?.message || 'Não foi possível carregar os detalhes do pacote'
        });
      }
    });
  }

  voltarParaBusca() {
    this.orderEncontrado = false;
    this.orderSelecionado = undefined;
  }

  private isAutenticado(): boolean {
    return !!localStorage.getItem('token');
  }

  private deveTentarAutenticado(error: HttpErrorResponse): boolean {
    return this.isAutenticado() && [401, 403].includes(error.status);
  }

  private exibirErroBusca(error: HttpErrorResponse) {
    const status = error.status;
    let summary = 'Erro na Busca';
    let detail = error.error?.message;

    if (status === 404) {
      summary = 'Pacote Não Encontrado';
      detail = 'Não encontramos nenhum pacote com o código informado.';
    } else if (status === 0) {
      detail = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
    }

    if (!detail) {
      detail = 'Não foi possível buscar o pacote.';
    }

    this.messageService.add({
      severity: 'error',
      summary,
      detail
    });
  }
}