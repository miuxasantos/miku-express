import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';
import { Order, StatusUpdate } from '../../../models/client';

@Component({
  selector: 'app-detalhes',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TimelineModule],
  templateUrl: './detalhes.component.html',
  styleUrls: ['./detalhes.component.scss']
})

export class DetalhesComponent implements OnInit {
  @Input() order!: Order;
  @Output() voltar = new EventEmitter<void>();

  sortedStatusUpdates: StatusUpdate[] = [];

  ngOnInit() {
    this.processarStatusUpdates();
  }

  processarStatusUpdates() {
    if (this.order.statusUpdates) {
      this.sortedStatusUpdates = [...this.order.statusUpdates].reverse();
    } else {
      this.sortedStatusUpdates = [];
    }
  }

  getCurrentStatus(): string {
    if (!this.order.statusUpdates || this.order.statusUpdates.length === 0) {
      return 'PENDING';
    }
    return this.order.statusUpdates[this.order.statusUpdates.length - 1].status || 'PENDING';
  }

  getStatusText(status: string | undefined): string {
    if (!status) return 'Pendente';
    
    const statusMap: { [key: string]: string } = {
      'DELIVERED': 'Entregue',
      'IN_TRANSIT': 'Em Trânsito',
      'PENDING': 'Pendente',
      'PROCESSING': 'Processando',
      'OUT_FOR_DELIVERY': 'Saiu para Entrega',
      'FAILED_DELIVERY': 'Entrega Falhou'
    };

    return statusMap[status] || status;
  }

  getStatusDescription(status: string | undefined): string {
    if (!status) return 'Status pendente';
    
    const descriptionMap: { [key: string]: string } = {
      'DELIVERED': 'Pacote entregue com sucesso',
      'IN_TRANSIT': 'Pacote em trânsito',
      'PENDING': 'Aguardando processamento',
      'PROCESSING': 'Pacote sendo processado',
      'OUT_FOR_DELIVERY': 'Pacote saiu para entrega',
      'FAILED_DELIVERY': 'Tentativa de entrega falhou'
    };

    return descriptionMap[status] || 'Atualização de status';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
  }
}