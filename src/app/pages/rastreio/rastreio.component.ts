import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscaComponent } from './components/busca.component';
import { DetalhesComponent } from './components/detalhes.component';
import { PublicService } from '../../services/public.service';
import { ClientService } from '../../services/client.service';
import { Order } from '../../models/client';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

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

export class RastreioComponent {
  orderEncontrado: boolean = false;
  orderSelecionado?: Order;
  loading: boolean = false;

  constructor(
    private publicService: PublicService,
    private clientService: ClientService,
    private messageService: MessageService
  ) {}

  buscarOrder(trackingCode: string) {
    this.loading = true;

    // Primeiro tenta buscar via PublicService (sem autenticação)
    this.publicService.getOrderByTrackingCode(trackingCode).subscribe({
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
      error: (publicError) => {
        // Se falhar no PublicService, tenta buscar via ClientService (com autenticação)
        this.tentarBuscarComAutenticacao(trackingCode, publicError);
      }
    });
  }

  private tentarBuscarComAutenticacao(trackingCode: string, publicError: any) {
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
        this.messageService.add({
          severity: 'error',
          summary: 'Erro na Busca',
          detail: clientError.error?.message || 'Não foi possível buscar os pacotes'
        });
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
}